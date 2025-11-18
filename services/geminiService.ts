
import { GoogleGenAI } from "@google/genai";
import { Athlete, LoadData, RehabEntry, SensorData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we will proceed, and the UI will show an error if API_KEY is missing.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAthleteSummary = async (
  athlete: Athlete,
  loadData: LoadData[],
  rehabData: RehabEntry[],
  sensorData: SensorData[]
): Promise<string> => {
  if (!API_KEY) {
    return Promise.reject(new Error("Gemini API key is not configured."));
  }

  const model = 'gemini-2.5-flash';
  
  const recentLoad = loadData.slice(-7).map(d => `Date: ${d.date}, Load: ${d.load}`).join('\n');
  const recentRehab = rehabData.slice(-3).map(d => `Date: ${d.date}, Status: ${d.status}, Notes: ${d.notes}`).join('\n') || 'No recent rehab entries.';
  const recentSensors = sensorData.slice(-7).map(d => `Date: ${d.date}, Recovery: ${d.recoveryScore}, Peak Power: ${d.peakPower}W, Jump Height: ${d.jumpHeight}cm`).join('\n');

  const prompt = `
    You are an expert sports performance analyst providing a concise summary for a busy coach.
    Analyze the following data for athlete ${athlete.name} (${athlete.position}) for the last 7 days.
    Provide a bulleted list of key insights, focusing on actionable information.
    Highlight trends, potential overload or under-recovery risks, and positive developments. Be direct and clear.

    **Training Load Data (last 7 days):**
    ${recentLoad}

    **Sensor Data (last 7 days):**
    ${recentSensors}

    **Rehab Status (latest entries):**
    ${recentRehab}

    **Analysis:**
  `;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate AI summary: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the AI summary."));
  }
};
