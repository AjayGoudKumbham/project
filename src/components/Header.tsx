
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CareerBoost</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/resume-analysis">
            <Button variant="ghost">Resume Analysis</Button>
          </Link>
          <Link to="/job-search">
            <Button variant="ghost">Job Search</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
