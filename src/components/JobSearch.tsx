import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Filter, 
  ArrowUpRight,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { searchJobs, Job } from "@/utils/jobApi";
import { GEMINI_API_KEY } from "@/config/api";

const JobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("any");
  const [experience, setExperience] = useState("any");
  const [datePosted, setDatePosted] = useState("any");
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [dataSources, setDataSources] = useState<string[]>([]);
  
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setUsingFallbackData(false);
    setDataSources([]);
    
    try {
      const fetchedJobs = await searchJobs({
        query,
        location,
        jobType: jobType !== "any" ? jobType : undefined,
        datePosted: datePosted !== "any" ? datePosted : undefined,
        experience: experience !== "any" ? experience : undefined,
        sortBy,
        page
      });
      
      setJobs(fetchedJobs);
      
      // Check the sources of the data
      if (fetchedJobs.length > 0) {
        // Get unique sources
        const sources = [...new Set(fetchedJobs.map(job => job.source))];
        setDataSources(sources);
        
        const usingMock = sources.includes("Mock Data");
        setUsingFallbackData(usingMock);
        
        if (usingMock && sources.length === 1) {
          toast.info("Using demo data. Web scraping sources are not available at the moment.");
        } else if (sources.length > 0) {
          toast.success(`Found ${fetchedJobs.length} job opportunities from ${sources.join(", ")}`);
        }
      } else if (query) {
        toast.info("No jobs found matching your criteria. Try adjusting your search.");
      }
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      
      // Show specific error message
      const errorMessage = err?.message || "Error loading job listings";
      setError(errorMessage);
      toast.error("Error loading jobs. Using fallback data instead.");
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page for new searches
    fetchJobs();
  };

  // Check if Gemini API key is configured (for chatbot)
  const apiKeysConfigured = !!GEMINI_API_KEY;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">
          Browse job listings matched to your skills and experience
        </p>
      </div>

      {!apiKeysConfigured && (
        <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-800" />
          <AlertTitle>API Keys Not Configured</AlertTitle>
          <AlertDescription>
            For best experience with our career chatbot, please add your Gemini API key in src/config/api.ts.
          </AlertDescription>
        </Alert>
      )}

      {usingFallbackData && (
        <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-800" />
          <AlertTitle>Using Demo Data</AlertTitle>
          <AlertDescription>
            Currently showing demo job listings. Web scraping may be temporarily unavailable.
          </AlertDescription>
        </Alert>
      )}

      {dataSources.length > 0 && !usingFallbackData && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-800" />
          <AlertTitle>Data Sources: {dataSources.join(", ")}</AlertTitle>
          <AlertDescription>
            Showing job listings from multiple sources. Results may vary based on availability.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Job title, company, or keywords" 
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Location (e.g. Bangalore, Mumbai)" 
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Search Jobs
                </Button>
                <Button variant="outline" type="button">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Experience</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                </SelectContent>
              </Select>
              <Select value={datePosted} onValueChange={setDatePosted}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date Posted" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{jobs.length} Jobs Found</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading job opportunities...</p>
        </div>
      ) : error && !usingFallbackData ? (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-500">Error Loading Jobs</h3>
            <p className="mt-2">{error}</p>
            <Button 
              onClick={fetchJobs} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No Jobs Found</h3>
                <p className="mt-2">Try adjusting your search criteria</p>
              </div>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="section-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row p-6">
                    <div className="md:w-16 md:h-16 w-12 h-12 rounded-md bg-secondary flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <Building className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              {job.company}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {job.location}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {job.posted}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm font-medium">{job.salary}</span>
                          </div>
                          <Badge variant="outline" className="mt-1">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mt-3">{job.description}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="p-4 flex justify-between items-center bg-secondary/30">
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">Source: {job.source}</span>
                    </div>
                    <Button variant="default" size="sm" onClick={() => window.open(job.url, '_blank')}>
                      View Job
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {jobs.length > 0 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button 
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
