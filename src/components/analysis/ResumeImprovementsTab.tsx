
import { FileEdit, Lightbulb, CheckCircle2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ResumeImprovement } from "@/types/analysis";

interface ResumeImprovementsTabProps {
  resumeImprovements: ResumeImprovement[];
  jobRole: string;
  matchingSkills: string[];
  missingSkills: string[];
}

const ResumeImprovementsTab = ({ 
  resumeImprovements, 
  jobRole,
  matchingSkills,
  missingSkills
}: ResumeImprovementsTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileEdit className="mr-2 h-5 w-5 text-primary" />
            Resume Optimization
          </CardTitle>
          <CardDescription>
            Suggestions to improve your resume for the {jobRole} role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeImprovements.map((improvement, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-medium">{improvement.section} Section</h3>
              <ul className="space-y-2">
                {improvement.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
              {index < resumeImprovements.length - 1 && (
                <div className="border-t my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>ATS Optimization Tips</CardTitle>
          <CardDescription>
            Make your resume more visible to Applicant Tracking Systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Keyword Optimization</h3>
            <p className="text-sm">
              Include these keywords from the job description: {jobRole}, 
              {matchingSkills.slice(0, 3).join(", ")}, and 
              {missingSkills.slice(0, 2).join(", ")}.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">Formatting Recommendations</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Use standard section headings (Experience, Skills, Education)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Avoid complex formatting, tables, and graphics</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Use bullet points for achievements and responsibilities</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeImprovementsTab;
