
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";
import AnalysisLoader from "./analysis/AnalysisLoader";
import SkillsMatchTab from "./analysis/SkillsMatchTab";
import ResumeImprovementsTab from "./analysis/ResumeImprovementsTab";
import LearningPathTab from "./analysis/LearningPathTab";

interface AnalysisResultsProps {
  resumeText: string;
  fileName: string;
  jobRole: string;
}

const AnalysisResults = ({ resumeText, fileName, jobRole }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState("skills");
  const analysis = useResumeAnalysis(resumeText, jobRole);

  if (analysis.loading) {
    return <AnalysisLoader jobRole={jobRole} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
          <p className="text-sm text-muted-foreground">
            Resume: {fileName} | Job Role: {jobRole}
          </p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Resume analysis saved")}>
          Save Analysis
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="skills">Skills Match</TabsTrigger>
          <TabsTrigger value="improvements">Resume Tips</TabsTrigger>
          <TabsTrigger value="learning">Learning Path</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills" className="space-y-4 mt-6">
          <SkillsMatchTab 
            matchingSkills={analysis.matchingSkills}
            missingSkills={analysis.missingSkills}
            irrelevantSkills={analysis.irrelevantSkills}
            jobRole={jobRole}
          />
        </TabsContent>
        
        <TabsContent value="improvements" className="space-y-4 mt-6">
          <ResumeImprovementsTab 
            resumeImprovements={analysis.resumeImprovements}
            jobRole={jobRole}
            matchingSkills={analysis.matchingSkills}
            missingSkills={analysis.missingSkills}
          />
        </TabsContent>
        
        <TabsContent value="learning" className="space-y-4 mt-6">
          <LearningPathTab 
            learningPaths={analysis.learningPaths}
            missingSkills={analysis.missingSkills}
            jobRole={jobRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
