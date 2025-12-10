import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { 
  Search, 
  Calendar,
  User,
  FileText,
  RefreshCw,
  Eye,
  Loader2,
  List,
  Upload,
  FileCheck,
  Wrench
} from "lucide-react";
import { useSelector } from "react-redux";
import { getHeaders } from "../../helpers/config";
import Navbar from "../../components/navigationBar/navbar";

// Backend URL configuration - matches uploadLeadFile.tsx
// const BACKEND_URL = "https://endpoint.itsbuzzmarketing.com";
// const BACKEND_URL = "https://app.itsbuzzmarketing.com"
const BACKEND_URL = "http://127.0.0.1:3173";  // Local backend for testing

const ShowJobs = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortByOldest, setSortByOldest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state: any) => state.user);

  // Filter data based on search term, date range, and sort
  useEffect(() => {
    let filtered = jobData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((job: any) => {
        const filename = job?.upload_file_name || "";
        const username = job?.user_name || "";
        const jobId = job?.job_id || "";
        
        return filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
               username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               jobId.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by date range (inclusive - compare only date portion, ignore time/timezone)
    if (startDate) {
      filtered = filtered.filter((job: any) => {
        const jobDate = new Date(job?.timestamp);
        // Extract date string in YYYY-MM-DD format (using local date components)
        const year = jobDate.getFullYear();
        const month = String(jobDate.getMonth() + 1).padStart(2, '0');
        const day = String(jobDate.getDate()).padStart(2, '0');
        const jobDateStr = `${year}-${month}-${day}`;
        return jobDateStr >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter((job: any) => {
        const jobDate = new Date(job?.timestamp);
        // Extract date string in YYYY-MM-DD format (using local date components)
        const year = jobDate.getFullYear();
        const month = String(jobDate.getMonth() + 1).padStart(2, '0');
        const day = String(jobDate.getDate()).padStart(2, '0');
        const jobDateStr = `${year}-${month}-${day}`;
        // Compare date strings directly (YYYY-MM-DD format) - inclusive
        return jobDateStr <= endDate;
      });
    }

    // Sort data
    const sorted = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a?.timestamp).getTime();
      const dateB = new Date(b?.timestamp).getTime();
      return sortByOldest ? dateA - dateB : dateB - dateA;
    });

    setFilteredData(sorted);
  }, [jobData, searchTerm, startDate, endDate, sortByOldest]);

  // Fetch data from API
  const fetchJobData = async () => {
    setIsLoading(true);
    try {
      const headers = await getHeaders(token);
      const response = await fetch(`${BACKEND_URL}/guides/get-job-history`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setJobData(data.data || []);
      } else {
        console.error("Failed to fetch job data");
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchJobData();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  // Get total stats
  const getTotalStats = () => {
    const total = filteredData.length;
    return { total };
  };

  const stats = getTotalStats();

  // Handle job row click
  const handleJobClick = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  // Truncate job ID for display
  const truncateJobId = (jobId: string) => {
    if (!jobId) return "N/A";
    return jobId.length > 20 ? `${jobId.substring(0, 20)}...` : jobId;
  };

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Job History</h1>
            <p className="text-muted-foreground mt-2">
              View and track queue job processing status
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/show-uploads")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              View Uploads
            </Button>
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/upload-lead-file")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics + Filters Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Jobs Card - Compact */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Card - Expanded */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Search */}
              <div className="lg:col-span-2">
                <Label htmlFor="search" className="mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by filename, username, or job ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block">Date Range</Label>
                <div className="flex gap-2">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Sort Toggle */}
              <div>
                <Label className="mb-2 block">Sort</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="sort-oldest"
                    checked={sortByOldest}
                    onCheckedChange={(checked) => setSortByOldest(checked as boolean)}
                  />
                  <Label htmlFor="sort-oldest" className="cursor-pointer">
                    Sort by Oldest
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Job Records</CardTitle>
              <CardDescription className="mt-1">
                Showing {filteredData.length} of {jobData.length} jobs
              </CardDescription>
            </div>
            <Button
              onClick={fetchJobData}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && jobData.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Original Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((job: any, index: number) => {
                    return (
                      <TableRow 
                        key={index}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleJobClick(job.job_id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs" title={job.job_id}>
                              {truncateJobId(job.job_id)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatTimestamp(job.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]" title={job.upload_file_name}>
                              {job.upload_file_name || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {job.user_name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {(job.original_count || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJobClick(job.job_id);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowJobs;

