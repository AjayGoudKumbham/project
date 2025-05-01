
import { Book, Star, Award, ArrowRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LearningPath } from "@/types/analysis";

interface LearningPathTabProps {
  learningPaths: LearningPath[];
  missingSkills: string[];
  jobRole: string;
}

const LearningPathTab = ({ learningPaths, missingSkills, jobRole }: LearningPathTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="mr-2 h-5 w-5 text-primary" />
            Recommended Learning Paths
          </CardTitle>
          <CardDescription>
            Resources to develop the skills needed for a {jobRole} role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {learningPaths.map((path, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-medium flex items-center">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                {path.skill}
              </h3>
              <div className="space-y-3 pl-7">
                {path.resources.map((resource, idx) => (
                  <div key={idx} className="bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.provider} • {resource.duration}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {index < learningPaths.length - 1 && (
                <div className="border-t my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Career Development Plan
          </CardTitle>
          <CardDescription>
            A structured approach to reaching your career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative pl-6 border-l-2 border-primary space-y-6 py-2">
            <div className="relative">
              <div className="absolute left-[-1.65rem] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                1
              </div>
              <h3 className="text-base font-medium">Skill Development</h3>
              <p className="text-sm mt-1">
                Focus on learning {missingSkills.slice(0, 2).join(" and ")} 
                through the recommended courses.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-1.65rem] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                2
              </div>
              <h3 className="text-base font-medium">Resume Enhancement</h3>
              <p className="text-sm mt-1">
                Update your resume following our suggestions to better position yourself for {jobRole} roles.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-1.65rem] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                3
              </div>
              <h3 className="text-base font-medium">Portfolio Development</h3>
              <p className="text-sm mt-1">
                Create projects that demonstrate your new skills and add them to your portfolio.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-1.65rem] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                4
              </div>
              <h3 className="text-base font-medium">Job Application</h3>
              <p className="text-sm mt-1">
                Apply for {jobRole} positions using your enhanced resume and portfolio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPathTab;
