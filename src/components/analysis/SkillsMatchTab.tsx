
import { CheckCircle2, XCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillsMatchTabProps {
  matchingSkills: string[];
  missingSkills: string[];
  irrelevantSkills: string[];
  jobRole: string;
}

const SkillsMatchTab = ({ 
  matchingSkills, 
  missingSkills, 
  irrelevantSkills, 
  jobRole 
}: SkillsMatchTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="section-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Matching Skills
            </CardTitle>
            <CardDescription>
              Skills that align with the {jobRole} role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              Missing Skills
            </CardTitle>
            <CardDescription>
              Skills to develop for the {jobRole} role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-600">
              <XCircle className="mr-2 h-5 w-5" />
              Less Relevant
            </CardTitle>
            <CardDescription>
              Skills less important for this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {irrelevantSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Skills Analysis Summary</CardTitle>
          <CardDescription>
            Overall assessment for the {jobRole} position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Your resume shows strong alignment with {matchingSkills.length} core skills 
            required for a {jobRole} position. However, there are {missingSkills.length} key 
            skills that employers typically look for that aren't clearly demonstrated in your resume.
          </p>
          <p>
            To maximize your chances of landing a {jobRole} position, consider developing the missing 
            skills identified above and updating your resume to better highlight your relevant experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsMatchTab;
