/**
 * Environment configuration
 * Centralized access to environment variables
 */

export const env = {
  // API Endpoints
  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL || "https://app.itsbuzzmarketing.com",
  AUTH_URL: import.meta.env.VITE_AUTH_URL || "https://auth.itsbuzzmarketing.com",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "https://app.itsbuzzmarketing.com",
  PLATFORM_BACKEND_URL: import.meta.env.VITE_PLATFORM_BACKEND_URL || "https://platformbackend.itsbuzzmarketing.com",
  PLATFORM_FRONTEND_URL: import.meta.env.VITE_PLATFORM_FRONTEND_URL || "https://platform.itsbuzzmarketing.com",

  // Vici Dialer URLs
  VICI_CLASSIC_URL: import.meta.env.VITE_VICI_CLASSIC_URL || "https://vici-lp1.itsbuzzmarketing.com/agc/vicidial.php",
  VICI_NEW_URL: import.meta.env.VITE_VICI_NEW_URL || "https://vici-lp1.itsbuzzmarketing.com/agent/",
  VICI_ADMIN_URL: import.meta.env.VITE_VICI_ADMIN_URL || "https://vici-lp1.itsbuzzmarketing.com/vicidial/admin_listloader_fourth_gen.php",
  VICI_REALTIME_REPORT_URL: import.meta.env.VITE_VICI_REALTIME_REPORT_URL || "https://vici-lp1.itsbuzzmarketing.com/vicidial/realtime_report.php",
  VICI_WELCOME_URL: import.meta.env.VITE_VICI_WELCOME_URL || "https://vici-lp1.itsbuzzmarketing.com/vicidial/welcome.php",
  VICI_ADMIN_PHP_URL: import.meta.env.VITE_VICI_ADMIN_PHP_URL || "https://vici-lp1.itsbuzzmarketing.com/vicidial/admin.php",

  // External Services
  IP_CHECK_API: import.meta.env.VITE_IP_CHECK_API || "https://api.ipify.org?format=json",

  // Default Emails
  DEFAULT_EMAILS: import.meta.env.VITE_DEFAULT_EMAILS
    ? import.meta.env.VITE_DEFAULT_EMAILS.split(",")
    : [
        "glenfiddich.apayart@itsbuzzmarketing.com",
        "harold.bondoc@itsbuzzmarketing.com",
        "jessie.fernando@itsbuzzmarketing.com",
        "james.chavez@itsbuzzmarketing.com",
        "kenneth.candor@itsbuzzmarketing.com",
      ],

  // Legacy
  LEGACY_AUTH_URL: import.meta.env.VITE_LEGACY_AUTH_URL || "https://end-point.75e8s1syn0vdw.us-east-1.cs.amazonlightsail.com/guide_auth/",
};


