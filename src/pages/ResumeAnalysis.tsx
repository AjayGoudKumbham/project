
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeUploader from "@/components/ResumeUploader";
import JobRoleInput from "@/components/JobRoleInput";
import AnalysisResults from "@/components/AnalysisResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText, Info } from "lucide-react";

const ResumeAnalysis = () => {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleResumeProcessed = (text: string, name: string) => {
    setResumeText(text);
    setFileName(name);
    setActiveTab("job-role");
  };

  const handleJobRoleSubmit = (role: string) => {
    setJobRole(role);
    setActiveTab("analysis");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume and specify your target job role to get personalized career insights
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Upload Resume</span>
            </TabsTrigger>
            <TabsTrigger value="job-role" disabled={!resumeText} className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Specify Role</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!resumeText || !jobRole} className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume to analyze your skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUploader onResumeProcessed={handleResumeProcessed} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Learn how our resume analysis process helps your career
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our AI-powered system analyzes your resume and provides personalized insights to help you land your dream job. Here's how it works:
                </p>
                <ol className="space-y-2 pl-5 list-decimal">
                  <li className="text-sm">
                    <span className="font-medium">Upload your resume:</span> We safely extract text from your resume for analysis.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Specify your target job role:</span> Tell us what position you're aiming for.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Get personalized insights:</span> Receive a detailed analysis of your skills match, resume optimization tips, and learning recommendations.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="job-role" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specify Your Target Job Role</CardTitle>
                <CardDescription>
                  Tell us the job role you're applying for to get targeted recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JobRoleInput onJobRoleSubmit={handleJobRoleSubmit} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resume Details</CardTitle>
                <CardDescription>
                  Your uploaded resume information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">File Name</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Extracted Content Preview</h3>
                    <div className="mt-2 bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-6">
                        {resumeText}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            {resumeText && fileName && jobRole && (
              <AnalysisResults 
                resumeText={resumeText}
                fileName={fileName}
                jobRole={jobRole}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResumeAnalysis;
