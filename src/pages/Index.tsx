
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Search, CheckCircle, ArrowRight, GraduationCap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Boost Your Career with AI-Powered Resume Analysis
                </h1>
                <p className="text-xl text-muted-foreground">
                  Upload your resume, specify your dream job, and let our AI assistant guide you to career success.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate("/resume-analysis")} size="lg" className="gap-2">
                    <FileText className="h-5 w-5" />
                    Analyze My Resume
                  </Button>
                  <Button onClick={() => navigate("/job-search")} variant="outline" size="lg" className="gap-2">
                    <Search className="h-5 w-5" />
                    Browse Jobs
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg transform rotate-3"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 border-b border-r p-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Skills Match</h3>
                      <p className="text-sm text-muted-foreground">Identify matching and missing skills</p>
                    </div>
                    <div className="space-y-2 border-b p-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Resume Tips</h3>
                      <p className="text-sm text-muted-foreground">Get personalized optimization advice</p>
                    </div>
                    <div className="space-y-2 border-r p-4">
                      <GraduationCap className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">Learning Path</h3>
                      <p className="text-sm text-muted-foreground">Custom skill development plans</p>
                    </div>
                    <div className="space-y-2 p-4">
                      <BarChart className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Job Matching</h3>
                      <p className="text-sm text-muted-foreground">Find roles that fit your profile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How CareerBoost Works</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Our AI-powered platform helps you land your dream job
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="section-card">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Upload Your Resume</CardTitle>
                  <CardDescription>
                    Upload your resume in PDF or DOC format. Our system will extract and analyze the content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our advanced text extraction ensures accurate processing of your experience, skills, and qualifications.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="section-card">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Specify Your Target Role</CardTitle>
                  <CardDescription>
                    Tell us what job position you're aiming for so we can provide relevant insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Whether it's "Frontend Developer," "Data Analyst," or any other role, our AI will tailor recommendations accordingly.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="section-card">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Get Personalized Insights</CardTitle>
                  <CardDescription>
                    Receive detailed analysis and actionable recommendations for your career growth.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our AI identifies skill gaps, suggests resume improvements, and recommends learning resources to boost your chances.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Ready to Transform Your Career?</h2>
                <p className="text-xl opacity-90">
                  Upload your resume now and get personalized insights to help you land your dream job.
                </p>
                <Button onClick={() => navigate("/resume-analysis")} variant="secondary" size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Analyze My Resume
                </Button>
              </div>
              <div className="bg-primary-foreground/10 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">AI-Powered Analysis:</span> Get insights tailored to your experience and goals
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Resume Optimization:</span> Make your resume stand out to recruiters and ATS systems
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Learning Recommendations:</span> Develop the skills that matter for your target role
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="h-5 w-5 text-primary-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Job Matching:</span> Find opportunities that align with your experience and skills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
