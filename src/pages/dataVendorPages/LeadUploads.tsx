import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  FileText,
  Phone,
  Shield,
  RefreshCw,
  Database,
  Building,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navigationBar/navbar";

// const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
const UPLOAD_URL = "http://127.0.0.1:3173";

const LeadUploads = () => {
  const [uploadData, setUploadData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state: any) => state.user);

  // Filter data based on search term and campaign
  useEffect(() => {
    let filtered = uploadData;

    // Filter by campaign
    if (campaignFilter !== "all") {
      filtered = filtered.filter((upload: any) => upload?.data?.campaignName === campaignFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((upload: any) => 
        upload?.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.leadProviderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.preferredListName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.campaignName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [uploadData, campaignFilter, searchTerm]);

  // Fetch data from API
  const fetchUploadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${UPLOAD_URL}/guides/get-lead-form-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUploadData(data.data.reverse());
      } else {
        console.error("Failed to fetch upload data");
      }
    } catch (error) {
      console.error("Error fetching upload data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUploadData();
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: any) => {
    const date = timestamp?.$date || timestamp;
    return new Date(date).toLocaleString();
  };

  // Get unique campaigns for filter
  const getUniqueCampaigns = () => {
    const campaigns = [...new Set(uploadData.map((upload: any) => upload?.data?.campaignName).filter(Boolean))];
    return campaigns.sort();
  };

  // Get total stats
  const getTotalStats = () => {
    const total = filteredData.length;
    const campaigns = [...new Set(filteredData.map((upload: any) => upload?.data?.campaignName).filter(Boolean))];

    return { total, campaigns: campaigns.length };
  };

  const stats = getTotalStats();

  return (
    <div className="w-full p-6 space-y-12">
      <Navbar />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Lead Form Upload History
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage lead form upload records
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="flex gap-4 mb-6">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Uploads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/4">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campaigns</p>
                <p className="text-2xl font-bold">{stats.campaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by filename, provider, or campaign..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Campaign Filter */}
            <div>
              <Label>Campaign</Label>
              <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {getUniqueCampaigns().map((campaign) => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <Button 
                onClick={fetchUploadData} 
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Records</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {uploadData.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upload records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Lead Provider</TableHead>
                    <TableHead>Preferred List</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>ForthCRM</TableHead>
                    <TableHead>Name Columns</TableHead>
                    <TableHead>Scrubbing</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((upload: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatTimestamp(upload?.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {upload?.data?.campaignName || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {upload?.data?.leadProviderName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {upload?.data?.preferredListName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 group relative">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]" title={upload?.filename}>
                            {upload?.filename?.split('/').pop() || "N/A"}
                          </span>

                          {upload?.uploaded_filename && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 hover:bg-blue-50"
                                title="Download file"
                                onClick={() => {
                                    // Create download link
                                    const link = document.createElement('a');
                                    const parts = upload.uploaded_filename.split('/')
                                    const filename = parts[parts.length - 1]
                                    const directory = parts.slice(0, -1).join('/')
                                    const url = `http://platformbackend.itsbuzzmarketing.com/file/download?filename=${filename}&directory=${directory}`
                                    link.href = `${url}`;
                                    link.download = upload.filename.split('/').pop() || 'download.csv';
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                >
                                <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {upload?.data?.forthCRM ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {upload?.data?.hasNameColumns ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {upload?.data?.scrubbing ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="truncate max-w-[150px]" title={upload?.data?.note}>
                          {upload?.data?.note || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadUploads;
