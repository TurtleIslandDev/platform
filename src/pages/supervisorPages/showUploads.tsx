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
  DollarSign,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navigationBar/navbar";

const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "http://54.167.53.149"


// Mock data - replace with actual API call
const mockUploadData = [
  {
    function: "blacklist_alliance_upload",
    data: {
      good_phone_count: 195,
      total_categories: {
        all_clean: 45,
        carrier: 32,
        federal_dnc: 64,
        invalid: 12,
        landline: 64,
        no_carrier: 8,
        wireless: 28
      },
      test_mode: "true",
      upload_file_name: "test_200.csv",
      user_name: "admin@gmail.com"
    },
    timestamp: "2025-07-26T18:50:19.938Z"
  },
  {
    function: "blacklist_alliance_upload",
    data: {
      good_phone_count: 95,
      total_categories: {
        all_clean: 25,
        carrier: 18,
        federal_dnc: 10,
        invalid: 5,
        landline: 15,
        no_carrier: 3,
        wireless: 12
      },
      test_mode: "true",
      upload_file_name: "test_100.csv",
      user_name: "supervisor@gmail.com"
    },
    timestamp: "2025-07-26T18:50:19.938Z"
  },
  {
    function: "blacklist_alliance_upload",
    data: {
      good_phone_count: 250,
      total_categories: {
        all_clean: 60,
        carrier: 45,
        federal_dnc: 25,
        invalid: 8,
        landline: 30,
        no_carrier: 12,
        wireless: 15
      },
      test_mode: "false",
      upload_file_name: "production_250.csv",
      user_name: "manager@gmail.com"
    },
    timestamp: "2025-07-25T14:30:12.123Z"
  },
  {
    function: "blacklist_alliance_upload",
    data: {
      good_phone_count: 180,
      total_categories: {
        all_clean: 40,
        carrier: 35,
        federal_dnc: 20,
        invalid: 6,
        landline: 25,
        no_carrier: 9,
        wireless: 10
      },
      test_mode: "false",
      upload_file_name: "live_180.csv",
      user_name: "admin@gmail.com"
    },
    timestamp: "2025-07-24T09:15:45.789Z"
  }
];

const ShowUploads = () => {
  const [uploadData, setUploadData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [testModeFilter, setTestModeFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);   
  const [viewMode, setViewMode] = useState<"table" | "breakdown">("table");
  const { token } = useSelector((state: any) => state.user);



  // Filter data based on search term, test mode, and campaign
  useEffect(() => {
    let filtered = uploadData;

    // Filter by test mode
    if (testModeFilter !== "all") {
      filtered = filtered.filter((upload: any) => upload?.data?.test_mode === testModeFilter);
    }

    // Filter by campaign
    if (campaignFilter !== "all") {
      filtered = filtered.filter((upload: any) => {
        const campaignName = upload?.data?.campaign_name || "__Unknown__";
        return campaignName === campaignFilter;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((upload: any) => 
        upload?.data?.upload_file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [uploadData, testModeFilter, campaignFilter, searchTerm]);

  // Fetch data from API
  const fetchUploadData = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API endpoint
      const response = await fetch(`${UPLOAD_URL}/guides/get-upload-history`, {
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
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get unique campaigns for filter
  const getUniqueCampaigns = () => {
    const campaigns = [...new Set(uploadData.map((upload: any) => upload?.data?.campaign_name).filter(Boolean))];
    return campaigns.sort();
  };

  // Calculate cost based on scrub usage
  const calculateCost = (scrubCount: number) => {
    const costPerScrub = 3000 / 7000000; // $3,000 for 7M scrubs
    return scrubCount * costPerScrub;
  };

  // Get monthly breakdown data
  const getMonthlyBreakdown = () => {
    const monthlyData: { [key: string]: { [key: string]: { scrubs: number; cost: number; uploads: number } } } = {};
    
    filteredData.forEach((upload: any) => {
      const date = new Date(upload?.timestamp);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const campaign = upload?.data?.campaign_name || "__Unknown__";
      const scrubs = upload?.data?.good_phone_count || 0;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {};
      }
      
      if (!monthlyData[monthYear][campaign]) {
        monthlyData[monthYear][campaign] = { scrubs: 0, cost: 0, uploads: 0 };
      }
      
      monthlyData[monthYear][campaign].scrubs += scrubs;
      monthlyData[monthYear][campaign].cost += calculateCost(scrubs);
      monthlyData[monthYear][campaign].uploads += 1;
    });
    
    return monthlyData;
  };

  // Get total counts
  const getTotalStats = () => {
    const total = filteredData.length;
    const totalPhones = filteredData.reduce((sum: any, upload: any) => sum + (upload?.data?.good_phone_count || 0), 0);
    const testModeCount = filteredData.filter((upload: any) => upload?.data?.test_mode === "true").length;
    const productionCount = filteredData.filter((upload: any) => upload?.data?.test_mode === "false").length;
    const totalCost = filteredData.reduce((sum: any, upload: any) => sum + calculateCost(upload?.data?.good_phone_count || 0), 0);

    return { total, totalPhones, testModeCount, productionCount, totalCost };
  };

  const stats = getTotalStats();

  return (
    <div className="max-w-4xl p-6 space-y-12">
      <Navbar />
      <div className="mb-8 mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Upload className="h-8 w-8" />
          Upload History
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage blacklist alliance upload records
        </p>
      </div>

      {/* Statistics Cards */}
      <div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"      
      >
        <Card>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Phones</p>
                <p className="text-2xl font-bold">{stats.totalPhones.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Test Mode</p>
                <p className="text-2xl font-bold">{stats.testModeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Production</p>
                <p className="text-2xl font-bold">{stats.productionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* View Mode Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            View Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Table View
            </Button>
            <Button
              variant={viewMode === "breakdown" ? "default" : "outline"}
              onClick={() => setViewMode("breakdown")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Monthly Breakdown
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by filename, username, or campaign..."
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
                  <SelectItem value="TM_Debt">TM_Debt</SelectItem>
                  <SelectItem value="Homebound">Homebound</SelectItem>
                  <SelectItem value="Press1">Press1</SelectItem>
                  <SelectItem value="Press1A">Press1A</SelectItem>
                  <SelectItem value="Press1B">Press1B</SelectItem>
                  <SelectItem value="Press1C">Press1C</SelectItem>
                  <SelectItem value="Press1D">Press1D</SelectItem>
                  <SelectItem value="__Unknown__">Unknown Campaigns</SelectItem>
                  {getUniqueCampaigns().filter(campaign => 
                    !["TM_Debt", "Homebound", "Press1", "Press1A", "Press1B", "Press1C", "Press1D"].includes(campaign)
                  ).map((campaign) => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showTestMode && (

                    <div>
                    <Label>Test Mode</Label>
                    <RadioGroup
                    value={testModeFilter}
                    onValueChange={setTestModeFilter}
                    className="flex space-x-4"
                    >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="test" />
                        <Label htmlFor="test">Test</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="production" />
                        <Label htmlFor="production">Production</Label>
                    </div>
                    </RadioGroup>
                    </div>
              
            )}

            {/* Test Mode Filter */}
            

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

      {/* Data Table or Monthly Breakdown */}
      {viewMode === "table" ? (
        <Card
        style={{
          width: "min-content",
        }}
        >
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
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Filename</TableHead>
                      <TableHead>Phone Count</TableHead>
                      {/* <TableHead>Cost</TableHead> */}
                      <TableHead>All Clean</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Federal DNC</TableHead>
                      <TableHead>Invalid</TableHead>
                      <TableHead>Landline</TableHead>
                      <TableHead>No Carrier</TableHead>
                      <TableHead>Wireless</TableHead>
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
                            {upload?.data?.campaign_name || "__Unknown__"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {upload?.data?.user_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 group relative">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[180px]" title={upload?.data?.upload_file_name}>
                              {upload?.data?.upload_file_name}
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
                                      // directory is everything before the filename
                                      const directory = parts.slice(0, -1).join('/')
                                      const url = `https://platformbackend.itsbuzzmarketing.com/file/download?filename=${encodeURIComponent(filename)}&directory=${directory}`;
                                      
                                      link.href = url;
                                      link.download = filename || 'download.csv';
                                      link.target = '_blank';
                                      link.rel = 'noopener noreferrer';
                                      
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                }}
                              >
                                <Download className="h-3 w-3 text-blue-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {(upload?.data?.good_phone_count || 0).toLocaleString()}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            ${calculateCost(upload?.data?.good_phone_count || 0).toFixed(2)}
                          </div>
                        </TableCell> */}
                        <TableCell>
                          {upload?.data?.total_categories?.all_clean || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.carrier || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.federal_dnc || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.invalid || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.landline || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.no_carrier || 0}
                        </TableCell>
                        <TableCell>
                          {upload?.data?.total_categories?.wireless || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Scrub Usage Breakdown
            </CardTitle>
            <CardDescription>
              Scrub usage and cost breakdown by campaign and month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const monthlyData = getMonthlyBreakdown();
              const months = Object.keys(monthlyData).sort().reverse();
              
              if (months.length === 0) {
                return (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No data available for the selected filters</p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {months.map((month) => {
                    const monthData = monthlyData[month];
                    const campaigns = Object.keys(monthData).sort();
                    const monthTotal = campaigns.reduce((sum, campaign) => sum + monthData[campaign].scrubs, 0);
                    const monthCost = campaigns.reduce((sum, campaign) => sum + monthData[campaign].cost, 0);
                    
                    return (
                      <div key={month} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            {new Date(month + '-01').toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Total Scrubs: <strong className="text-foreground">{monthTotal.toLocaleString()}</strong></span>
                            <span>Total Cost: <strong className="text-foreground">${monthCost.toFixed(2)}</strong></span>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Uploads</TableHead>
                                <TableHead>Scrub Count</TableHead>
                                <TableHead>Estimated Cost</TableHead>
                                <TableHead>Cost per Upload</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {campaigns.map((campaign) => {
                                const data = monthData[campaign];
                                return (
                                  <TableRow key={campaign}>
                                    <TableCell>
                                      <Badge variant={campaign === "__Unknown__" ? "destructive" : "secondary"}>
                                        {campaign}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{data.uploads}</TableCell>
                                    <TableCell>{data.scrubs.toLocaleString()}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        ${data.cost.toFixed(2)}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        ${(data.cost / data.uploads).toFixed(2)}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShowUploads;
