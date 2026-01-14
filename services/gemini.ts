
import { GoogleGenAI, Type } from "@google/genai";
import { Badge, Domain, Difficulty, BadgeRequirement } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBadgeContent = async (topic: string, goal: string): Promise<Partial<Badge>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive and rigorous badge curriculum for the topic: "${topic}" with the goal: "${goal}". 
    The curriculum should be modeled after high-level achievement programs like the Boy Scout Merit Badges.
    
    Structure the response with:
    1. A dramatic, guild-inspired title.
    2. A brief, evocative description (max 50 words).
    3. Exactly 8-10 specific, progressive requirements.
    
    Assign a domain and a complexity rating from 1 to 5 stars.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          domain: { type: Type.STRING },
          difficulty: { type: Type.INTEGER },
          requirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "description", "domain", "difficulty", "requirements"]
      }
    }
  });

  const text = response.text || '{}';
  const data = JSON.parse(text);
  return {
    title: data.title,
    description: data.description,
    domain: data.domain as Domain,
    difficulty: data.difficulty as Difficulty,
    requirements: (data.requirements || []).map((req: string, idx: number) => ({
      id: `ai-req-${idx}`,
      description: req,
      isCompleted: false,
      requireAttachment: true,
      requireNote: true
    }))
  };
};

export const suggestSingleTask = async (title: string, description: string, existingTasks: string[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The badge is titled "${title}" and described as "${description}". 
    Existing tasks: [${existingTasks.join(' | ')}].
    Suggest ONE new, rigorous, and specific requirement for this badge. Return only the task text.`,
  });
  return response.text?.trim() || "Complete a significant project in this field.";
};

export const analyzeBadgeComplexity = async (title: string, description: string, requirements: BadgeRequirement[]): Promise<number> => {
  const tasksText = requirements.map(r => r.description).join('\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate the complexity of this badge curriculum:
    Title: ${title}
    Description: ${description}
    Tasks:
    ${tasksText}
    
    Assign a difficulty rating from 1 (Easy/Fast) to 5 (Extremely rigorous/Long-term).
    Return only the number.`,
  });
  const rating = parseInt(response.text?.trim() || "3");
  return isNaN(rating) ? 3 : Math.min(5, Math.max(1, rating));
};

export const getAIRecommendations = async (userBadges: Badge[], interests: string[]): Promise<string> => {
  const currentBadges = userBadges.map(b => b.title).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has mastered: [${currentBadges}]. They are interested in: [${interests.join(', ')}].
    Act as the Guild Oracle. Provide a CONCISE revelation with 3 paths.`,
  });
  return response.text || "The Oracle remains silent for now.";
};
