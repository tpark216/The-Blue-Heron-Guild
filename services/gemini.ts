
import { GoogleGenAI, Type } from "@google/genai";
import { Badge, Domain, Difficulty, BadgeRequirement } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBadgeContent = async (topic: string, goal: string): Promise<Partial<Badge>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a mentor in the Blue Heron Guild, design a learning pathway for: "${topic}" with the objective: "${goal}". 
    The curriculum should be encouraging, community-focused, and provide clear milestones for mastery.
    
    Structure the response with:
    1. A clear, aspirational title.
    2. A brief description (max 50 words) that captures the value of this skill for the individual and their colony.
    3. Exactly 8-10 meaningful milestones that demonstrate real-world competence.
    
    Assign a relevant primary domain and suggest 1-2 secondary domains that highlight the interdisciplinary nature of this topic.
    Also assign a difficulty level from 1 (Entry) to 5 (Mastery).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          domain: { type: Type.STRING },
          secondaryDomains: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    secondaryDomains: (data.secondaryDomains || []) as Domain[],
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

export const getLearningSuggestions = async (badgeTitle: string, description: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The learner is pursuing the badge "${badgeTitle}": "${description}".
    As a balanced Guild Mentor, provide specific learning directions and resource types (e.g., "Look for local arboriculture workshops" or "Research soil chemistry basics").
    Avoid flowery roleplay. Be practical, supportive, and point towards high-quality, real-world knowledge sources. Keep it concise (under 150 words).`,
  });
  return response.text || "Continue exploring community projects and seeking peer feedback for further growth.";
};

export const suggestSingleTask = async (title: string, description: string, existingTasks: string[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Regarding the learning path "${title}" (${description}). 
    Current milestones: [${existingTasks.join(' | ')}].
    As a guild mentor, suggest ONE additional milestone that would deepen the learner's understanding or service to others. Use clear, encouraging language.`,
  });
  return response.text?.trim() || "Collaborate with a fellow member on a practical application of this skill.";
};

export const analyzeBadgeComplexity = async (title: string, description: string, requirements: BadgeRequirement[]): Promise<number> => {
  const tasksText = requirements.map(r => r.description).join('\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate the depth of this learning pathway:
    Title: ${title}
    Milestones:
    ${tasksText}
    
    Rate the level of commitment and skill required from 1 (Beginner) to 5 (Expert). Return only the digit.`,
  });
  const rating = parseInt(response.text?.trim() || "3");
  return isNaN(rating) ? 3 : Math.min(5, Math.max(1, rating));
};

export const getAIRecommendations = async (userBadges: Badge[], interests: string[]): Promise<string> => {
  const currentBadges = userBadges.map(b => b.title).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Review these completed milestones: [${currentBadges}] and these interests: [${interests.join(', ')}]. 
    As a Guild Advisor, suggest three pathways for further growth. Keep the advice supportive, grounded, and focused on community contribution.`,
  });
  return response.text || "Continue exploring the Archive for new inspiration.";
};
