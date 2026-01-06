
import { GoogleGenAI, Type } from "@google/genai";
import { Badge, Domain, Difficulty } from "../types";

// Always initialize with process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBadgeContent = async (topic: string, goal: string): Promise<Partial<Badge>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a comprehensive and rigorous badge curriculum for the topic: "${topic}" with the goal: "${goal}". 
    The curriculum should be modeled after high-level achievement programs like the Boy Scout Merit Badges.
    
    Structure the response with:
    1. A dramatic, guild-inspired title.
    2. A brief, evocative description (max 50 words).
    3. Exactly 8-10 specific, progressive requirements that include:
       - Safety and preparation protocols.
       - Core theoretical knowledge/definitions.
       - A significant practical field project or experiment.
       - A community-focused application or mentorship task.
    
    Assign a domain and a complexity rating from 1 to 5 stars (1 = shortest time/least complex, 5 = longest time/most complex).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          domain: { type: Type.STRING },
          difficulty: { 
            type: Type.INTEGER,
            description: "Complexity rating from 1 to 5 stars" 
          },
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
      isCompleted: false
    }))
  };
};

export const getAIRecommendations = async (userBadges: Badge[], interests: string[]): Promise<string> => {
  const currentBadges = userBadges.map(b => b.title).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has mastered: [${currentBadges}]. They are interested in: [${interests.join(', ')}].
    Act as the Guild Oracle. Provide a CONCISE revelation.
    Structure:
    1. One short mystical greeting (max 15 words).
    2. Exactly three recommended mastery paths (Title: 1-sentence description).
    3. One closing sentence (max 15 words).
    TOTAL LIMIT: 100 words. Be sharp, evocative, and brief.`,
  });

  return response.text || "The Oracle remains silent for now.";
};
