
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JobRoleInputProps {
  onJobRoleSubmit: (jobRole: string) => void;
  disabled?: boolean;
}

const JobRoleInput = ({ onJobRoleSubmit, disabled = false }: JobRoleInputProps) => {
  const [jobRole, setJobRole] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobRole.trim()) {
      onJobRoleSubmit(jobRole.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="job-role" className="block text-sm font-medium mb-1">
          Desired Job Role
        </label>
        <div className="relative">
          <Input
            id="job-role"
            placeholder="e.g. Frontend Developer, Data Analyst, Project Manager"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter the job role you're targeting to get personalized recommendations
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={!jobRole.trim() || disabled}>
        Analyze for This Role
      </Button>
    </form>
  );
};

export default JobRoleInput;
