import { 
  scrapeInternshalaJobs, 
  scrapeTimesJobs, 
  scrapeIndeedJobs, 
  getIndiaSpecificMockJobs,
  Job as ScraperJob
} from "@/utils/jobScraperService";

export interface JobSearchParams {
  query?: string;
  location?: string;
  jobType?: string;
  datePosted?: string;
  experience?: string;
  sortBy?: string;
  page?: number;
}

// Re-export the Job interface
export type Job = ScraperJob;

export async function searchJobs(params: JobSearchParams): Promise<Job[]> {
  try {
    // Create an array to store all jobs from different sources
    let allJobs: Job[] = [];
    const errors: string[] = [];
    
    // Try to scrape from Indeed
    try {
      console.log("Attempting to scrape Indeed...");
      const indeedJobs = await scrapeIndeedJobs({
        query: params.query || "",
        location: params.location || "",
        page: params.page
      });
      
      if (indeedJobs.length > 0) {
        console.log(`Found ${indeedJobs.length} jobs from Indeed`);
        allJobs = [...allJobs, ...indeedJobs];
      }
    } catch (indeedError) {
      console.error("Indeed scraping error:", indeedError);
      errors.push("Indeed scraping failed");
    }
    
    // Try to scrape from Internshala
    try {
      console.log("Attempting to scrape Internshala...");
      const internshalaJobs = await scrapeInternshalaJobs({
        query: params.query || "",
        location: params.location || "",
        page: params.page
      });
      
      if (internshalaJobs.length > 0) {
        console.log(`Found ${internshalaJobs.length} jobs from Internshala`);
        allJobs = [...allJobs, ...internshalaJobs];
      }
    } catch (internshalaError) {
      console.error("Internshala scraping error:", internshalaError);
      errors.push("Internshala scraping failed");
    }
    
    // Try to scrape from TimesJobs
    try {
      console.log("Attempting to scrape TimesJobs...");
      const timesJobs = await scrapeTimesJobs({
        query: params.query || "",
        location: params.location || "",
        page: params.page
      });
      
      if (timesJobs.length > 0) {
        console.log(`Found ${timesJobs.length} jobs from TimesJobs`);
        allJobs = [...allJobs, ...timesJobs];
      }
    } catch (timesJobsError) {
      console.error("TimesJobs scraping error:", timesJobsError);
      errors.push("TimesJobs scraping failed");
    }
    
    // Apply filters if we got jobs
    if (allJobs.length > 0) {
      console.log(`Total jobs before filtering: ${allJobs.length}`);
      
      // Filter by job type
      if (params.jobType && params.jobType !== "any") {
        const jobTypeFilter = params.jobType.toLowerCase();
        allJobs = allJobs.filter(job => 
          job.type.toLowerCase().includes(jobTypeFilter)
        );
      }
      
      // Filter by date posted (approximate)
      if (params.datePosted && params.datePosted !== "any") {
        allJobs = allJobs.filter(job => {
          const posted = job.posted.toLowerCase();
          if (params.datePosted === "today") {
            return posted.includes("today") || posted.includes("just now") || posted.includes("1 hour");
          } else if (params.datePosted === "week") {
            return posted.includes("day") || posted.includes("today") || posted.includes("just now") || 
                   !posted.includes("month") && !posted.includes("year");
          } else if (params.datePosted === "month") {
            return !posted.includes("year");
          }
          return true;
        });
      }
      
      // Sort results
      if (params.sortBy) {
        if (params.sortBy === "recent") {
          allJobs.sort((a, b) => {
            if (a.posted.includes("Just now") || a.posted.includes("Today")) return -1;
            if (b.posted.includes("Just now") || b.posted.includes("Today")) return 1;
            if (a.posted.includes("day") && b.posted.includes("week")) return -1;
            if (a.posted.includes("week") && b.posted.includes("day")) return 1;
            if (a.posted.includes("day") && b.posted.includes("month")) return -1;
            if (a.posted.includes("month") && b.posted.includes("day")) return 1;
            return 0;
          });
        } else if (params.sortBy === "salary") {
          allJobs.sort((a, b) => {
            // Extract numbers from salary strings
            const aMatch = a.salary.match(/\d+/g);
            const bMatch = b.salary.match(/\d+/g);
            
            const aVal = aMatch ? parseInt(aMatch[0]) : 0;
            const bVal = bMatch ? parseInt(bMatch[0]) : 0;
            
            return bVal - aVal; // Sort descending
          });
        }
      }
      
      console.log(`Total jobs after filtering: ${allJobs.length}`);
      return allJobs;
    }
    
    // If all scraping methods failed, or no jobs were found, return mock data
    console.log("All scraping methods failed or returned no jobs. Using mock data.");
    if (errors.length > 0) {
      console.error("Scraping errors:", errors.join(", "));
    }
    return getIndiaSpecificMockJobs();
  } catch (error) {
    console.error("Error in job search:", error);
    return getIndiaSpecificMockJobs();
  }
}

// Helper to extract skills from job description
function extractSkills(description: string): string[] {
  const commonSkills = [
    // Technical skills
    "JavaScript", "React", "Angular", "Vue", "Node.js", "TypeScript", "HTML", "CSS",
    "Python", "Java", "C++", "C#", "PHP", "Ruby", "SQL", "NoSQL", "MongoDB",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "CI/CD", "Agile", "Scrum",
    // India specific common skills
    "SAP", "Oracle", "Salesforce", "Power BI", "Tableau", "JIRA", "ServiceNow",
    ".NET", "ASP.NET", "SharePoint", "MS Office", "Excel", "PowerPoint", "Tally",
    "GST", "Banking", "Finance", "Accounting", "BPO", "Customer Service",
    "Digital Marketing", "SEO", "Social Media", "Analytics", "Data Science",
    "Machine Learning", "AI", "RPA", "Automation", "Testing", "QA"
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.length ? foundSkills : ["Not specified"];
}
