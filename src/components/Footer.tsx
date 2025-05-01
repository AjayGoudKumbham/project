
import { Briefcase, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">CareerBoost</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your AI-powered career assistant to help you land your dream job.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-base">Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Resume Analysis</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Job Search</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-base">Social</h3>
            <div className="mt-2 flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CareerBoost. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
