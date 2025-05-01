
import { GEMINI_API_KEY } from "@/config/api";

interface GeminiRequestOptions {
  model: string;
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export async function callGeminiApi(prompt: string, systemPrompt: string = ""): Promise<string> {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
      throw new Error("Please set your Gemini API key in src/config/api.ts");
    }
    
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
    
    const requestOptions: GeminiRequestOptions = {
      model: "gemini-1.5-pro",
      contents: []
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      requestOptions.contents.push({
        role: "system",
        parts: [{ text: systemPrompt }]
      });
    }
    
    // Add user prompt
    requestOptions.contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
    
    // Add generation config - lower temperature for more precise responses
    requestOptions.generationConfig = {
      temperature: 0.2,  // Lower temperature for more deterministic outputs
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096
    };
    
    console.log("Calling Gemini API with:", {
      model: requestOptions.model,
      systemPrompt: systemPrompt ? "Yes" : "No",
      promptLength: prompt.length
    });
    
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestOptions)
    });
    
    if (!response.ok) {
      let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error("Gemini API error response:", errorData);
        errorMessage = `Gemini API error: ${errorData.error?.message || response.statusText}`;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Unexpected response format from Gemini API");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Resume analysis prompt builder with parsed resume
export function buildResumeAnalysisPrompt(parsedResumeData: string, jobRole: string): string {
  return `
You are an expert AI career assistant specialized in the Indian job market. Your task is to analyze a parsed resume and provide tailored career advice.

PARSED RESUME DATA:
${parsedResumeData}

JOB ROLE: ${jobRole}

Please analyze this resume data for an Indian job seeker and provide a comprehensive assessment in JSON format with the following structure:
{
  "matchingSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "irrelevantSkills": ["skill1", "skill2", ...],
  "resumeImprovements": [
    {
      "section": "Summary",
      "suggestions": ["suggestion1", "suggestion2", ...]
    },
    {
      "section": "Experience",
      "suggestions": ["suggestion1", "suggestion2", ...]
    },
    {
      "section": "Skills",
      "suggestions": ["suggestion1", "suggestion2", ...]
    }
  ],
  "learningPaths": [
    {
      "skill": "skill1",
      "resources": [
        {
          "title": "Resource Title",
          "provider": "Provider Name (an Indian training provider)",
          "link": "resource_url",
          "duration": "X weeks/months"
        }
      ]
    }
  ]
}

Focus on providing actionable, specific recommendations for the Indian job market, tailored to the ${jobRole} role. Include relevant certifications and training programs available in India, and consider the specific requirements of Indian employers.

Return ONLY the JSON object and no other text.
`;
}

// Resume optimization prompt builder
export function buildResumeOptimizationPrompt(resumeText: string, jobRole: string, section: string): string {
  return `
You are an expert resume writer with extensive knowledge of ATS (Applicant Tracking Systems) and the Indian job market.

RESUME SECTION (${section}):
${resumeText}

JOB ROLE: ${jobRole}

Please rewrite this ${section.toLowerCase()} section to be more effective for the ${jobRole} role in India. Optimize it for ATS systems by:
1. Including relevant keywords for the ${jobRole} position in the Indian context
2. Highlighting measurable achievements and metrics when possible
3. Using strong action verbs and industry-specific language
4. Making it concise and impactful
5. Adding relevant Indian qualifications, certifications, or skills if applicable

Return only the improved text without any additional explanations.
`;
}

// Chat prompt builder for the career assistant chatbot
export function buildChatPrompt(userQuery: string, jobRole: string = "", resumeContext: string = ""): string {
  let context = "You are a helpful career advisor specialized in the Indian job market.";
  
  if (jobRole) {
    context += ` The user is interested in ${jobRole} positions.`;
  }
  
  if (resumeContext) {
    context += ` I have context about their resume: ${resumeContext}`;
  }
  
  return `
${context}

Provide concise, practical career advice relevant to job seekers in India. Include specific resources, training options, or strategies available in India when appropriate.

User query: ${userQuery}

Respond in a helpful, conversational tone, and prioritize actionable advice. Keep your response under 300 words unless more detail is explicitly requested.
`;
}
