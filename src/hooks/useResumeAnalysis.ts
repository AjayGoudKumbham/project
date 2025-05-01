
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { callGeminiApi, buildResumeAnalysisPrompt } from "@/utils/geminiApi";
import { AnalysisData } from "@/types/analysis";
import { parseResumeText } from "@/utils/resumeParser";

// More India-focused default analysis
const defaultAnalysis: AnalysisData = {
  matchingSkills: ["Communication", "Problem Solving", "Team Collaboration"],
  missingSkills: ["Technical Skills", "Industry Knowledge", "Data Analysis"],
  irrelevantSkills: ["Unrelated Experience"],
  resumeImprovements: [
    {
      section: "Summary",
      suggestions: [
        "Tailor your summary to the job role", 
        "Add measurable achievements",
        "Highlight your expertise relevant to Indian market"
      ]
    },
    {
      section: "Experience",
      suggestions: [
        "Quantify your achievements with metrics",
        "Use action verbs at the beginning of bullet points",
        "Include keywords from the job description"
      ]
    },
    {
      section: "Skills",
      suggestions: [
        "Organize skills by categories",
        "Prioritize technical skills relevant to the role",
        "Include both hard and soft skills"
      ]
    }
  ],
  learningPaths: [
    {
      skill: "Technical Skills",
      resources: [
        {
          title: "Full Stack Web Development",
          provider: "NIIT India",
          link: "https://www.niit.com",
          duration: "4 months"
        },
        {
          title: "Python for Data Science",
          provider: "upGrad",
          link: "https://www.upgrad.com",
          duration: "3 months"
        }
      ]
    },
    {
      skill: "Industry Knowledge",
      resources: [
        {
          title: "Digital Transformation Course",
          provider: "Great Learning",
          link: "https://www.greatlearning.in",
          duration: "6 weeks"
        }
      ]
    }
  ],
  loading: true
};

export const useResumeAnalysis = (resumeText: string, jobRole: string) => {
  const [analysis, setAnalysis] = useState<AnalysisData>(defaultAnalysis);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setAnalysis(prev => ({ ...prev, loading: true }));
        
        // Parse the resume to extract key information instead of sending full text
        const parsedResume = parseResumeText(resumeText);
        console.log("Parsed resume:", parsedResume);
        
        // Create a more concise prompt with the parsed information
        const prompt = buildResumeAnalysisPrompt(
          JSON.stringify(parsedResume, null, 2), 
          jobRole
        );
        
        const response = await callGeminiApi(prompt);
        
        try {
          // Find JSON in the response (in case the AI includes explanatory text)
          let jsonStr = response;
          
          // Look for JSON object in the response
          const jsonMatch = response.match(/(\{[\s\S]*\})/);
          if (jsonMatch) {
            jsonStr = jsonMatch[0];
          }
          
          const parsedResponse = JSON.parse(jsonStr);
          
          // Validate the parsed response has the expected structure
          const isValid = 
            Array.isArray(parsedResponse.matchingSkills) &&
            Array.isArray(parsedResponse.missingSkills) &&
            Array.isArray(parsedResponse.irrelevantSkills) &&
            Array.isArray(parsedResponse.resumeImprovements) &&
            Array.isArray(parsedResponse.learningPaths);
          
          if (!isValid) {
            throw new Error("Response is missing required fields");
          }
          
          setAnalysis({
            ...parsedResponse,
            loading: false
          });
          
          toast.success("Resume analysis completed successfully!");
        } catch (jsonError) {
          console.error("Error parsing Gemini API response:", jsonError);
          console.log("Raw response:", response);
          
          // If we haven't reached max retries, try again
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            toast.info("Retrying analysis...");
            // Will retry in the next useEffect cycle
          } else {
            toast.error("Error processing AI response. Using default analysis.");
            setAnalysis({
              ...defaultAnalysis,
              loading: false
            });
          }
        }
      } catch (error: any) {
        console.error("Error analyzing resume:", error);
        
        // Check if it's an API key error
        const isApiKeyError = error?.message?.includes("API key") || 
                             error?.message?.includes("credentials");
        
        if (isApiKeyError) {
          toast.error("API key error. Please add your Gemini API key in the config file.");
        } else {
          toast.error("Error analyzing resume. Using default analysis.");
        }
        
        setAnalysis({
          ...defaultAnalysis,
          loading: false
        });
      }
    };

    fetchAnalysis();
  }, [resumeText, jobRole, retryCount]);

  return analysis;
};
