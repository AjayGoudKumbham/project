import * as cheerio from 'cheerio';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  posted: string;
  skills: string[];
  url: string;
  source: string;
  logo?: string;
}

export interface ScrapingResult {
  jobs: Job[];
  source: string;
}

export interface ScraperOptions {
  query: string;
  location?: string;
  page?: number;
}

const safeText = (element: cheerio.Cheerio<cheerio.Element>): string => 
  element.text().trim() || "";

const normalizeSkills = (skillsText: string): string[] => {
  if (!skillsText) return [];
  
  const skills = skillsText
    .split(/[,;•]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0 && skill.length < 30);
  
  return [...new Set(skills)];
};

export async function mockScrapeJobs(options: ScraperOptions): Promise<ScrapingResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { query, location = "Anywhere", page = 1 } = options;
  
  const jobs: Job[] = [];
  const numJobs = Math.min(10, Math.max(1, 10 - page));
  
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const companies = ["TechCorp India", "Global Services Ltd", "Innovative Solutions", "DataSphere Technologies", "NextGen Systems"];
  const locations = location === "Anywhere" ? 
    ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"] : 
    [location];
  const salaries = ["₹5L - ₹8L", "₹8L - ₹12L", "₹12L - ₹18L", "₹18L - ₹25L", "₹25L - ₹35L"];
  const postTimes = ["1d ago", "2d ago", "3d ago", "1w ago", "Just now"];
  
  const skillSets = {
    developer: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    designer: ["Figma", "UI/UX", "Adobe XD", "Sketch", "Illustrator", "Photoshop"],
    manager: ["Team Leadership", "Agile", "Scrum", "Project Management", "Stakeholder Management"],
    marketing: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Social Media"],
    analyst: ["Data Analysis", "SQL", "Python", "Tableau", "Power BI", "Excel"]
  };
  
  let relevantSkills = [];
  if (query.toLowerCase().includes("develop") || query.toLowerCase().includes("engineer")) {
    relevantSkills = skillSets.developer;
  } else if (query.toLowerCase().includes("design")) {
    relevantSkills = skillSets.designer;
  } else if (query.toLowerCase().includes("manage")) {
    relevantSkills = skillSets.manager;
  } else if (query.toLowerCase().includes("market")) {
    relevantSkills = skillSets.marketing;
  } else if (query.toLowerCase().includes("analy")) {
    relevantSkills = skillSets.analyst;
  } else {
    relevantSkills = [
      ...skillSets.developer.slice(0, 2),
      ...skillSets.manager.slice(0, 2),
      ...skillSets.analyst.slice(0, 2)
    ];
  }
  
  for (let i = 0; i < numJobs; i++) {
    const skills = [];
    const numSkills = 3 + Math.floor(Math.random() * 3);
    
    for (let j = 0; j < Math.min(numSkills - 1, relevantSkills.length); j++) {
      const skill = relevantSkills[Math.floor(Math.random() * relevantSkills.length)];
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }
    
    const otherCategories = Object.keys(skillSets).filter(key => {
      // @ts-ignore
      return skillSets[key] !== relevantSkills;
    });
    
    if (otherCategories.length > 0) {
      const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
      // @ts-ignore
      const randomSkill = skillSets[randomCategory][Math.floor(Math.random() * skillSets[randomCategory].length)];
      if (!skills.includes(randomSkill)) {
        skills.push(randomSkill);
      }
    }
    
    let title = query;
    if (!title) {
      const titles = ["Software Engineer", "Product Manager", "Data Analyst", "UX Designer", "Marketing Specialist"];
      title = titles[Math.floor(Math.random() * titles.length)];
    }
    
    if (Math.random() > 0.5) {
      const prefixes = ["Senior ", "Lead ", "Junior ", "Principal ", ""];
      title = prefixes[Math.floor(Math.random() * prefixes.length)] + title;
    }
    
    const company = companies[Math.floor(Math.random() * companies.length)];
    const jobLocation = locations[Math.floor(Math.random() * locations.length)];
    const salary = salaries[Math.floor(Math.random() * salaries.length)];
    const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const posted = postTimes[Math.floor(Math.random() * postTimes.length)];
    
    jobs.push({
      id: `mock-job-${page}-${i}`,
      title,
      company,
      location: jobLocation,
      description: `We are looking for a talented ${title} to join our team in ${jobLocation}. The ideal candidate will have experience with ${skills.join(", ")}.`,
      salary,
      type,
      posted,
      skills,
      url: "#mock-job-url",
      source: "Mock Data"
    });
  }
  
  return {
    jobs,
    source: "Mock Data"
  };
}

export async function scrapeInternshalaJobs(options: ScraperOptions): Promise<Job[]> {
  try {
    console.log("Scraping Internshala jobs...");
    const result = await mockScrapeJobs(options);
    
    return result.jobs.map(job => ({
      ...job,
      type: "Internship",
      source: "Internshala",
      company: job.company + " (Internship Program)",
      salary: job.salary || "₹10K - ₹25K /month"
    }));
  } catch (error) {
    console.error("Error scraping Internshala:", error);
    return [];
  }
}

export async function scrapeTimesJobs(options: ScraperOptions): Promise<Job[]> {
  try {
    console.log("Scraping TimesJobs...");
    const result = await mockScrapeJobs(options);
    
    return result.jobs.map(job => ({
      ...job,
      source: "TimesJobs",
      company: job.company + " via TimesJobs",
      posted: job.posted || "Posted recently"
    }));
  } catch (error) {
    console.error("Error scraping TimesJobs:", error);
    return [];
  }
}

export async function scrapeIndeedJobs(options: ScraperOptions): Promise<Job[]> {
  try {
    console.log("Scraping Indeed jobs...");
    const result = await mockScrapeJobs(options);
    
    return result.jobs.map(job => ({
      ...job,
      source: "Indeed",
      company: job.company + " via Indeed",
      posted: "Posted " + Math.floor(Math.random() * 14 + 1) + " days ago"
    }));
  } catch (error) {
    console.error("Error scraping Indeed:", error);
    return [];
  }
}

export function getIndiaSpecificMockJobs(): Job[] {
  const indianTechCompanies = [
    "TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", 
    "Cognizant", "Accenture India", "IBM India", "Capgemini India",
    "Mindtree", "L&T Infotech", "Mphasis", "Oracle India", "Amazon India",
    "Google India", "Microsoft India", "Flipkart", "Ola", "Swiggy", "Zomato"
  ];
  
  const indianLocations = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", 
    "Gurgaon", "Noida", "Kolkata", "Ahmedabad", "Jaipur", "Kochi"
  ];
  
  const jobRoles = [
    "Software Engineer", "Data Scientist", "Product Manager", "UI/UX Designer",
    "DevOps Engineer", "Full Stack Developer", "Android Developer", "iOS Developer",
    "Frontend Developer", "Backend Developer", "QA Engineer", "Business Analyst",
    "Project Manager", "Technical Support", "Sales Executive", "Digital Marketing"
  ];
  
  const skills = [
    ["Java", "Spring Boot", "Microservices", "AWS", "Docker"],
    ["Python", "Pandas", "NumPy", "TensorFlow", "Data Analysis"],
    ["Product Management", "Agile", "JIRA", "Roadmapping", "User Stories"],
    ["Figma", "Adobe XD", "UI Design", "User Research", "Wireframing"],
    ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    ["Node.js", "Express", "MongoDB", "RESTful APIs", "GraphQL"]
  ];
  
  const mockJobs: Job[] = [];
  
  for (let i = 0; i < 15; i++) {
    const companyIndex = Math.floor(Math.random() * indianTechCompanies.length);
    const locationIndex = Math.floor(Math.random() * indianLocations.length);
    const roleIndex = Math.floor(Math.random() * jobRoles.length);
    const skillsetIndex = Math.floor(Math.random() * skills.length);
    
    const experienceLevels = ["Junior ", "Senior ", "Lead ", "", "Principal "];
    const expIndex = Math.floor(Math.random() * experienceLevels.length);
    const jobTitle = experienceLevels[expIndex] + jobRoles[roleIndex];
    
    let salary = "";
    if (expIndex === 0) salary = "₹3L - ₹7L";
    else if (expIndex === 1) salary = "₹10L - ₹18L";
    else if (expIndex === 2) salary = "₹18L - ₹25L";
    else if (expIndex === 3) salary = "₹6L - ₹12L";
    else salary = "₹25L - ₹40L";
    
    mockJobs.push({
      id: `india-mock-${i}`,
      title: jobTitle,
      company: indianTechCompanies[companyIndex],
      location: indianLocations[locationIndex],
      description: `We are looking for a talented ${jobTitle} to join our team in ${indianLocations[locationIndex]}. The ideal candidate will have experience with ${skills[skillsetIndex].join(", ")}.`,
      salary: salary,
      type: Math.random() > 0.2 ? "Full-time" : "Contract",
      posted: ["Today", "1 day ago", "3 days ago", "1 week ago", "2 weeks ago"][Math.floor(Math.random() * 5)],
      skills: skills[skillsetIndex],
      url: "#mock-job-url",
      source: "Mock India Data"
    });
  }
  
  return mockJobs;
}

export async function scrapeFakeLinkedIn(options: ScraperOptions): Promise<ScrapingResult> {
  try {
    const html = `
      <div class="job-listing">
        <div class="job-title">Senior Software Engineer</div>
        <div class="company">TCS</div>
        <div class="location">Bangalore, India</div>
        <div class="description">Looking for experienced software engineers...</div>
        <div class="salary">₹20L - ₹30L</div>
        <div class="type">Full-time</div>
        <div class="posted">2d ago</div>
        <div class="skills">JavaScript, React, Node.js</div>
      </div>
      <div class="job-listing">
        <div class="job-title">UI/UX Designer</div>
        <div class="company">Infosys</div>
        <div class="location">Hyderabad, India</div>
        <div class="description">Join our design team to create amazing user experiences...</div>
        <div class="salary">₹15L - ₹25L</div>
        <div class="type">Full-time</div>
        <div class="posted">1w ago</div>
        <div class="skills">Figma, Adobe XD, UI Design</div>
      </div>
    `;
    
    const $ = cheerio.load(html);
    const jobs: Job[] = [];
    
    $('.job-listing').each((index, element) => {
      const jobElement = $(element);
      const title = safeText(jobElement.find('.job-title'));
      const company = safeText(jobElement.find('.company'));
      const location = safeText(jobElement.find('.location'));
      const description = safeText(jobElement.find('.description'));
      const salary = safeText(jobElement.find('.salary'));
      const type = safeText(jobElement.find('.type'));
      const posted = safeText(jobElement.find('.posted'));
      const skillsText = safeText(jobElement.find('.skills'));
      const skills = normalizeSkills(skillsText);
      
      jobs.push({
        id: `linkedin-${index}`,
        title,
        company,
        location,
        description,
        salary,
        type,
        posted,
        skills,
        url: "#linkedin-job-url",
        source: "LinkedIn"
      });
    });
    
    return {
      jobs,
      source: "LinkedIn"
    };
  } catch (error) {
    console.error("Error scraping LinkedIn:", error);
    return {
      jobs: [],
      source: "LinkedIn (Error)"
    };
  }
}

export async function scrapeFakeNaukri(options: ScraperOptions): Promise<ScrapingResult> {
  try {
    const html = `
      <div class="naukri-job">
        <h2 class="n-jobtitle">Product Manager</h2>
        <div class="n-company">Wipro</div>
        <div class="n-location">Mumbai, India</div>
        <div class="n-description">Leading product development initiatives...</div>
        <div class="n-salary">₹18L - ₹25L</div>
        <div class="n-type">Full-time</div>
        <div class="n-posted">3d ago</div>
        <div class="n-skills">Product Management, Agile, Roadmapping</div>
      </div>
      <div class="naukri-job">
        <h2 class="n-jobtitle">Data Scientist</h2>
        <div class="n-company">HCL</div>
        <div class="n-location">Pune, India</div>
        <div class="n-description">Analyze large datasets and build ML models...</div>
        <div class="n-salary">₹12L - ₹20L</div>
        <div class="n-type">Contract</div>
        <div class="n-posted">Just now</div>
        <div class="n-skills">Python, Machine Learning, SQL</div>
      </div>
    `;
    
    const $ = cheerio.load(html);
    const jobs: Job[] = [];
    
    $('.naukri-job').each((index, element) => {
      const jobElement = $(element);
      const title = safeText(jobElement.find('.n-jobtitle'));
      const company = safeText(jobElement.find('.n-company'));
      const location = safeText(jobElement.find('.n-location'));
      const description = safeText(jobElement.find('.n-description'));
      const salary = safeText(jobElement.find('.n-salary'));
      const type = safeText(jobElement.find('.n-type'));
      const posted = safeText(jobElement.find('.n-posted'));
      const skillsText = safeText(jobElement.find('.n-skills'));
      const skills = normalizeSkills(skillsText);
      
      jobs.push({
        id: `naukri-${index}`,
        title,
        company,
        location,
        description,
        salary,
        type,
        posted,
        skills,
        url: "#naukri-job-url",
        source: "Naukri"
      });
    });
    
    return {
      jobs,
      source: "Naukri"
    };
  } catch (error) {
    console.error("Error scraping Naukri:", error);
    return {
      jobs: [],
      source: "Naukri (Error)"
    };
  }
}
