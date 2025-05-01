
// Resume parser utility
export interface ParsedResume {
  summary: string;
  keySkills: string[];
  experience: string;
  education: string;
}

export function parseResumeText(resumeText: string): ParsedResume {
  const lines = resumeText.split(/\n+/).filter(line => line.trim().length > 0);
  const normalizedText = resumeText.toLowerCase();
  const result: ParsedResume = {
    summary: "",
    keySkills: [],
    experience: "",
    education: ""
  };

  // Extract summary - typically the first paragraph or section marked "summary/profile"
  const summaryIndex = findSectionIndex(normalizedText, ["summary", "profile", "objective", "about"]);
  if (summaryIndex !== -1) {
    const endIndex = findNextSectionIndex(lines, summaryIndex);
    result.summary = lines.slice(summaryIndex + 1, endIndex).join(" ").trim();
  } else if (lines.length > 0) {
    // Just use the first paragraph if no summary section found
    result.summary = lines.slice(0, Math.min(5, lines.length)).join(" ").trim();
  }

  // Extract skills - look for skills section
  const skillsIndex = findSectionIndex(normalizedText, ["skills", "technical skills", "core competencies", "technologies"]);
  if (skillsIndex !== -1) {
    const endIndex = findNextSectionIndex(lines, skillsIndex);
    const skillsText = lines.slice(skillsIndex + 1, endIndex).join(" ");
    
    // Extract skills from comma/bullet-separated lists
    result.keySkills = extractSkills(skillsText);
  }

  // Extract experience
  const experienceIndex = findSectionIndex(normalizedText, ["experience", "work experience", "employment", "work history"]);
  if (experienceIndex !== -1) {
    const endIndex = findNextSectionIndex(lines, experienceIndex);
    result.experience = lines.slice(experienceIndex + 1, endIndex).join(" ").trim();
  }

  // Extract education
  const educationIndex = findSectionIndex(normalizedText, ["education", "academic", "qualification"]);
  if (educationIndex !== -1) {
    const endIndex = findNextSectionIndex(lines, educationIndex);
    result.education = lines.slice(educationIndex + 1, endIndex).join(" ").trim();
  }

  // If we couldn't extract structured data, fallback to intelligent sampling
  if (!result.keySkills.length) {
    // Try to extract skills based on common skill keywords
    result.keySkills = findCommonSkills(resumeText);
  }

  return result;
}

function findSectionIndex(text: string, possibleHeaders: string[]): number {
  const lines = text.split(/\n+/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    // Check if this line contains any of the headers
    if (possibleHeaders.some(header => 
      line === header || 
      line.startsWith(header + ":") || 
      line.startsWith(header + " ") ||
      line.endsWith(" " + header))) {
      return i;
    }
  }
  
  return -1;
}

function findNextSectionIndex(lines: string[], currentSectionIndex: number): number {
  // Common section headers in resumes
  const sectionIndicators = [
    "summary", "profile", "objective", "experience", "work", "employment",
    "education", "academic", "skills", "competencies", "projects", 
    "certifications", "awards", "languages", "interests", "references"
  ];
  
  for (let i = currentSectionIndex + 1; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();
    
    // If line is short, all caps or ends with colon, and contains a section indicator, it's likely a section header
    if (line.length < 50 && 
       (line === line.toUpperCase() || line.endsWith(":")) && 
        sectionIndicators.some(header => 
          line === header || 
          line.startsWith(header + ":") || 
          line.startsWith(header + " ") ||
          line.endsWith(" " + header))) {
      return i;
    }
  }
  
  return lines.length;
}

function extractSkills(skillsText: string): string[] {
  // Try to extract skills from various formats
  // 1. Comma separated: "Java, Python, React"
  // 2. Bullet points: "• Java • Python"
  // 3. Line breaks: "Java\nPython"
  
  let skills: string[] = [];
  
  // Try comma separation first
  if (skillsText.includes(",")) {
    skills = skillsText.split(",").map(s => s.trim());
  } 
  // Try bullet points
  else if (skillsText.includes("•")) {
    skills = skillsText.split("•").map(s => s.trim()).filter(s => s.length > 0);
  }
  // Try line breaks
  else if (skillsText.includes("\n")) {
    skills = skillsText.split("\n").map(s => s.trim()).filter(s => s.length > 0);
  }
  // Default - just take whole text and limit to reasonable length
  else {
    skills = [skillsText.trim()];
  }
  
  // Filter out items that are likely not skills (too long or too short)
  return skills
    .filter(skill => skill.length > 1 && skill.length < 50)
    .filter(skill => !skill.includes(".")) // Probably not a skill if it ends with period
    .map(skill => skill.replace(/^[-•*]\s*/, "")) // Remove bullet markers
    .slice(0, 20); // Limit to 20 skills
}

function findCommonSkills(text: string): string[] {
  const normalizedText = text.toLowerCase();
  const commonSkills = [
    // Programming languages
    "javascript", "java", "python", "c++", "c#", "php", "ruby", "go", "swift", "typescript",
    // Frameworks & Libraries
    "react", "angular", "vue", "node.js", "express", "django", "flask", "spring", ".net", "laravel",
    // Databases
    "sql", "mysql", "postgresql", "mongodb", "oracle", "sqlite", "redis", "cassandra",
    // Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd", "terraform",
    // Tools & Technologies
    "git", "github", "gitlab", "jira", "confluence", "figma", "sketch", "adobe",
    // Data Science
    "machine learning", "deep learning", "ai", "tensorflow", "pytorch", "pandas", "numpy",
    // Mobile
    "android", "ios", "react native", "flutter", "swift", "kotlin",
    // India Specific Skills
    "tally", "gst", "sap", "erp", "bpo", "ites",
    // Common soft skills
    "communication", "teamwork", "leadership", "problem-solving", "time management"
  ];
  
  return commonSkills.filter(skill => 
    normalizedText.includes(skill.toLowerCase())
  ).slice(0, 15); // Limit to 15 skills
}
