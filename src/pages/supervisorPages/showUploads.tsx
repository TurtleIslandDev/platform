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
import { Checkbox } from "../../components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
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
  TrendingUp,
  Eye,
  X,
  FileCheck
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigationBar/navbar";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const UPLOAD_URL = "https://app.itsbuzzmarketing.com";
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

// Upload Details Modal Component
const UploadDetailsModal = ({ upload, isOpen, onClose }: { upload: any; isOpen: boolean; onClose: () => void }) => {
  const downloadFile = (filename: string, category: string) => {
    if (!filename) return;
    
    const link = document.createElement('a');
    const parts = filename.split('/');
    const file = parts[parts.length - 1];
    const directory = parts.slice(0, -1).join('/');
    const url = `https://platformbackend.itsbuzzmarketing.com/file/download?filename=${encodeURIComponent(file)}&directory=${directory}`;
    
    link.href = url;
    link.download = file || `${category}.csv`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!upload) return null;

  const data = upload.data || {};
  const totalCategories = data.total_categories || {};
  const categoryFilenames = data.category_filenames || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Details: {data.upload_file_name || upload.filename}
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of upload counts and download options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Upload Date</Label>
                <p className="font-medium">{formatTimestamp(upload.timestamp)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                <p className="font-medium">{data.user_name || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Campaign</Label>
                <p className="font-medium">{data.campaign_name || "__Unknown__"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Duplicate Check Scope</Label>
                <p className="font-medium">{data.dup_check_scope && data.enabled_duplicate_check ? data.dup_check_scope : "None"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">List ID</Label>
                <p className="font-medium">{data.list_id || "N/A"}</p>
              </div>
              
            </CardContent>
          </Card>

          {/* Count Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Main Processing Flow */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-muted-foreground">Original Count</p>
                    <p className="text-3xl font-bold text-blue-600">{data.original_count || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total records uploaded</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-muted-foreground">Good Phones</p>
                    <p className="text-3xl font-bold text-green-600">{data.good_phone_count || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid phone numbers</p>
                  </div>
                </div>
                

                {/* Excluded Records */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Excluded Records</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {(data.blacklist_count !== undefined && data.blacklist_count !== null) && (
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-muted-foreground">Blacklist</p>
                        <p className="text-xl font-bold text-red-600">{data.blacklist_count || 0}</p>
                      </div>
                    )}
                    {data.duplicate_count != null && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-muted-foreground">Duplicates  {data.dup_check_scope? `|| ${data.dup_check_scope}` : ''}</p>
                        <p className="text-xl font-bold text-orange-600">{data.duplicate_count || 0}</p>
                      </div>
                    )}
                    {(data.system_dnc_count !== undefined && data.system_dnc_count !== null) && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-muted-foreground">System DNC</p>
                        <p className="text-xl font-bold text-purple-600">{data.system_dnc_count || 0}</p>
                      </div>
                    )}
                    {(data.file_duplicates_count !== undefined && data.file_duplicates_count !== null) && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-muted-foreground">File Duplicates</p>
                        <p className="text-xl font-bold text-yellow-600">{data.file_duplicates_count || 0}</p>
                      </div>
                    )}
                    {(data.invalid_count !== undefined && data.invalid_count !== null) && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-muted-foreground">Invalid</p>
                        <p className="text-xl font-bold text-gray-600">{data.invalid_count || 0}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processing Steps Summary */}
                {(data.dataframe_count !== undefined || data.count_after_general_lead_cleaning !== undefined) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Processing Steps</h4>
                    <div className="space-y-2">
                      {data.dataframe_count !== undefined && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">DataFrame Count</span>
                          <span className="font-medium">{data.dataframe_count}</span>
                        </div>
                      )}
                      {data.count_after_general_lead_cleaning !== undefined && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">After General Cleaning</span>
                          <span className="font-medium">{data.count_after_general_lead_cleaning}</span>
                        </div>
                      )}
                      {data.count_after_dropping_duplicates !== undefined && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">After Dropping Duplicates</span>
                          <span className="font-medium">{data.count_after_dropping_duplicates}</span>
                        </div>
                      )}
                      {data.count_after_checking_for_dnc_numbers !== undefined && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">After DNC Check</span>
                          <span className="font-medium">{data.count_after_checking_for_dnc_numbers}</span>
                        </div>
                      )}
                      {data.count_after_black_list_dnc !== undefined && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">After Blacklist DNC</span>
                          <span className="font-medium">{data.count_after_black_list_dnc}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(totalCategories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{category.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">Count: {count as number}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(categoryFilenames[category], category)}
                      disabled={!categoryFilenames[category]}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.uploaded_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Clean Data</p>
                        <p className="text-sm text-muted-foreground">Main processed file</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.uploaded_filename, "clean")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.original_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Original File</p>
                        <p className="text-sm text-muted-foreground">Original uploaded file</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.original_filename, "original")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.black_list_dnc_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Blacklist DNC</p>
                        <p className="text-sm text-muted-foreground">Numbers on blacklist/DNC</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.black_list_dnc_filename, "blacklist_dnc")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.invalid_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Invalid Numbers</p>
                        <p className="text-sm text-muted-foreground">Invalid phone numbers</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.invalid_filename, "invalid")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.system_dnc_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <p className="font-medium">System DNC</p>
                        <p className="text-sm text-muted-foreground">Numbers on system DNC list</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.system_dnc_filename, "system_dnc")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.file_duplicates_name && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">File Duplicates</p>
                        <p className="text-sm text-muted-foreground">Duplicate records within the file</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.file_duplicates_name, "file_duplicates")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}

                {data.duplicates_filename && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Duplicates {data.dup_check_scope? `|| ${data.dup_check_scope}` : ''}</p>
                        <p className="text-sm text-muted-foreground">Duplicate records in the {}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadFile(data.duplicates_filename, "duplicates")}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShowUploads = () => {
  const navigate = useNavigate();
  const [uploadData, setUploadData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [testModeFilter, setTestModeFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortByOldest, setSortByOldest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);   
  const [viewMode, setViewMode] = useState<"table" | "breakdown">("table");
  const [selectedUpload, setSelectedUpload] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useSelector((state: any) => state.user);



  // Filter data based on search term, test mode, and campaign
  useEffect(() => {
    let filtered = uploadData;

    // Filter by test mode
    if (testModeFilter !== "all") {
      filtered = filtered.filter((upload: any) => {
        const testMode = upload?.data?.test_mode;
        // Handle both boolean and string values for test_mode
        if (typeof testMode === 'boolean') {
          return testMode === (testModeFilter === "true");
        }
        return testMode === testModeFilter;
      });
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
      filtered = filtered.filter((upload: any) => {
        const filename = upload?.data?.upload_file_name || upload?.filename || "";
        const username = upload?.data?.user_name || "";
        const campaign = upload?.data?.campaign_name || "";
        
        return filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
               username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               campaign.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((upload: any) => {
        const uploadDate = new Date(upload?.timestamp);
        // Extract date string in YYYY-MM-DD format 
        const year = uploadDate.getFullYear();
        const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
        const day = String(uploadDate.getDate()).padStart(2, '0');
        const uploadDateStr = `${year}-${month}-${day}`;
        // Compare date strings directly (YYYY-MM-DD format)
        return uploadDateStr >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter((upload: any) => {
        const uploadDate = new Date(upload?.timestamp);
        // Extract date string in YYYY-MM-DD format 
        const year = uploadDate.getFullYear();
        const month = String(uploadDate.getMonth() + 1).padStart(2, '0');
        const day = String(uploadDate.getDate()).padStart(2, '0');
        const uploadDateStr = `${year}-${month}-${day}`;
        // Compare date strings directly (YYYY-MM-DD format)
        return uploadDateStr <= endDate;
      });
    }

    // Sort data
    const sorted = [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a?.timestamp).getTime();
      const dateB = new Date(b?.timestamp).getTime();
      return sortByOldest ? dateA - dateB : dateB - dateA;
    });

    setFilteredData(sorted);
  }, [uploadData, testModeFilter, campaignFilter, searchTerm, startDate, endDate, sortByOldest]);

  // Fetch data from API
  const fetchUploadData = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API endpoint
      const response = await fetchWithAuth(`${UPLOAD_URL}/guides/get-upload-history`, {
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
    
    const testModeCount = filteredData.filter((upload: any) => {
      const testMode = upload?.data?.test_mode;
      if (typeof testMode === 'boolean') {
        return testMode === true;
      }
      return testMode === "true";
    }).length;
    
    const productionCount = filteredData.filter((upload: any) => {
      const testMode = upload?.data?.test_mode;
      if (typeof testMode === 'boolean') {
        return testMode === false;
      }
      return testMode === "false";
    }).length;
    
    const totalCost = filteredData.reduce((sum: any, upload: any) => sum + calculateCost(upload?.data?.good_phone_count || 0), 0);

    return { total, totalPhones, testModeCount, productionCount, totalCost };
  };

  const stats = getTotalStats();

  // Modal handlers
  const handleUploadClick = (upload: any) => {
    setSelectedUpload(upload);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUpload(null);
  };

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Upload className="h-8 w-8" />
              Upload History
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage blacklist alliance upload records
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/show-jobs")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileCheck className="h-4 w-4" />
              View Jobs
            </Button>
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/upload-lead-file")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div 
      className="grid gap-4 md:grid-cols-3 mb-6"      
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
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </div>
            <Button 
              onClick={fetchUploadData} 
              disabled={isLoading}
              variant="ghost"
              size="icon"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="mb-2 block">Search</Label>
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
              <Label className="mb-2 block">Campaign</Label>
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
            
          </div>
        </CardContent>
      </Card>

      {/* Data Table or Monthly Breakdown */}
      {viewMode === "table" ? (
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
                            <button
                              onClick={() => handleUploadClick(upload)}
                              className="truncate max-w-[180px] text-left hover:text-blue-600 hover:underline cursor-pointer"
                              title={`Click to view details: ${upload?.data?.upload_file_name || upload?.filename}`}
                            >
                              {upload?.data?.upload_file_name || upload?.filename}
                            </button>

                            {upload?.uploaded_filename && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 hover:bg-blue-50"
                                title="Download file"
                                onClick={(e) => {
                                  e.stopPropagation();
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

      {/* Upload Details Modal */}
      <UploadDetailsModal 
        upload={selectedUpload} 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </div>
  );
};

export default ShowUploads;
