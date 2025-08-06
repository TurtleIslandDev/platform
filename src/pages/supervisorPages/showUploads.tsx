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
  RefreshCw
} from "lucide-react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navigationBar/navbar";

const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
// const UPLOAD_URL = "http://127.0.0.1:3173";

// Mock data - replace with actual API call
const mockUploadData = [
  {
    function: "blacklist_alliance_upload",
    data: {
      good_phone_count: 195,
      total_categories: {
        suppress: 64,
        landline: 64,
        federal_dnc: 64
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
        suppress: 20,
        landline: 15,
        federal_dnc: 10
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
        suppress: 45,
        landline: 30,
        federal_dnc: 25,
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
        suppress: 35,
        landline: 25,
        federal_dnc: 20,
        wireless: 10,
        business: 5
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);   
  const { token } = useSelector((state: any) => state.user);

  // Get all unique categories from the data
  const getAllCategories = () => {
    const categories = new Set<string>();
    uploadData.forEach((upload: any) => {
      Object.keys(upload.data.total_categories).forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories).sort();
  };

  const categories = getAllCategories();

  // Filter data based on search term and test mode
  useEffect(() => {
    let filtered = uploadData;

    // Filter by test mode
    if (testModeFilter !== "all") {
      filtered = filtered.filter((upload: any) => upload?.data?.test_mode === testModeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((upload: any) => 
        upload?.data?.upload_file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload?.data?.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [uploadData, testModeFilter, searchTerm]);

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
        setUploadData(data.data);
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

  // Get total counts
  const getTotalStats = () => {
    const total = filteredData.length;
    const totalPhones = filteredData.reduce((sum: any, upload: any) => sum + upload?.data?.good_phone_count, 0);
    const testModeCount = filteredData.filter((upload: any) => upload?.data?.test_mode === "true").length;
    const productionCount = filteredData.filter((upload: any) => upload?.data?.test_mode === "false").length;

    return { total, totalPhones, testModeCount, productionCount };
  };

  const stats = getTotalStats();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Navbar />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Upload className="h-8 w-8" />
          Upload History
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage blacklist alliance upload records
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
                  placeholder="Search by filename or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Phone Count</TableHead>
                    {categories.map(category => (
                      <TableHead key={category} className="capitalize">
                        {category.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
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
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {upload?.data?.user_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {upload?.data?.upload_file_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {upload?.data?.good_phone_count.toLocaleString()}
                        </div>
                      </TableCell>
                      {categories.map(category => (
                        <TableCell key={category}>
                          {upload?.data?.total_categories[category] || 0}
                        </TableCell>
                      ))}
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

export default ShowUploads;
