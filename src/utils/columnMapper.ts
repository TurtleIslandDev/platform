/**
 * Column auto-mapping utility.
 * Simplified version: normalization + token overlap + Levenshtein distance.
 */

type PlatformColumn = {
  id: string;
  label: string;
  required?: boolean;
};

/**
 * Normalize column name for comparison.
 * - Lowercase
 * - Replace spaces, dots, dashes with underscores
 * - Remove special characters
 * - Remove leading/trailing underscores
 */
function normalizeColumn(name: string): string {
  if (!name) return "";

  // Lowercase
  let normalized = name.toLowerCase();

  // Replace spaces, dots, dashes with underscores
  normalized = normalized.replace(/[\s.\-]+/g, "_");

  // Remove special characters (keep alphanumeric and underscores)
  normalized = normalized.replace(/[^a-z0-9_]/g, "");

  // Remove leading/trailing underscores
  normalized = normalized.replace(/^_+|_+$/g, "");

  return normalized;
}

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) {
    return levenshteinDistance(s2, s1);
  }

  if (s2.length === 0) {
    return s1.length;
  }

  const previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);

  for (let i = 0; i < s1.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const insertions = previousRow[j + 1] + 1;
      const deletions = currentRow[j] + 1;
      const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow.length = 0;
    previousRow.push(...currentRow);
  }

  return previousRow[previousRow.length - 1];
}

/**
 * Calculate similarity score between CSV column and platform column.
 * Combines token overlap and Levenshtein similarity.
 * Returns score between 0 and 1.
 */
function calculateScore(
  csvCol: string,
  platformId: string,
  platformLabel: string
): number {
  const csvNorm = normalizeColumn(csvCol);
  const platformNorm = normalizeColumn(platformLabel);

  // Token overlap (handles word order independence)
  const csvTokens = new Set(csvNorm.split("_").filter((t) => t));
  const platformTokens = new Set(platformNorm.split("_").filter((t) => t));

  let tokenScore = 0;
  if (csvTokens.size > 0 && platformTokens.size > 0) {
    const intersection = new Set(
      [...csvTokens].filter((x) => platformTokens.has(x))
    );
    const union = new Set([...csvTokens, ...platformTokens]);
    tokenScore = intersection.size / union.size;
  }

  // Levenshtein similarity (handles typos, abbreviations)
  const levDist = levenshteinDistance(csvNorm, platformNorm);
  const maxLen = Math.max(csvNorm.length, platformNorm.length);
  const levScore = maxLen > 0 ? 1 - levDist / maxLen : 0;

  // Take the better of the two scores
  return Math.max(tokenScore, levScore);
}

/**
 * Auto-map CSV headers to platform columns.
 *
 * Process:
 * 1. Score all platform columns for each CSV header
 * 2. One-to-one mapping (each platform column can only map to one CSV column)
 *
 * @param csvHeaders - List of CSV column headers
 * @param platformColumns - List of platform column objects with 'id' and 'label'
 * @returns Dictionary mapping CSV header -> platform column ID
 */
export function autoMapColumns(
  csvHeaders: string[],
  platformColumns: PlatformColumn[]
): Record<string, string> {
  const mappings: Record<string, string> = {};
  const usedPlatformCols = new Set<string>();

  for (const csvHeader of csvHeaders) {
    if (!csvHeader || csvHeader.trim() === "") {
      continue;
    }

    let bestMatch: PlatformColumn | null = null;
    let bestScore = 0;

    // Score all platform columns
    for (const platformCol of platformColumns) {
      // Skip if platform column already mapped
      if (usedPlatformCols.has(platformCol.id)) {
        continue;
      }

      const score = calculateScore(
        csvHeader,
        platformCol.id,
        platformCol.label
      );

      // Only consider matches above threshold (60% confidence)
      if (score > bestScore && score > 0.6) {
        bestScore = score;
        bestMatch = platformCol;
      }
    }

    // Assign mapping if good match found
    if (bestMatch) {
      mappings[csvHeader] = bestMatch.id;
      usedPlatformCols.add(bestMatch.id);
    }
  }

  return mappings;
}
