
import { Loader2 } from "lucide-react";

interface AnalysisLoaderProps {
  jobRole: string;
}

const AnalysisLoader = ({ jobRole }: AnalysisLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <div className="text-center">
        <h3 className="text-lg font-medium">Analyzing your resume</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Our AI is comparing your resume to the {jobRole} role requirements
        </p>
      </div>
      <div className="w-full max-w-md mt-4">
        <div className="progress-bar">
          <div className="progress-bar-fill animate-pulse-subtle" style={{ width: "80%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;
