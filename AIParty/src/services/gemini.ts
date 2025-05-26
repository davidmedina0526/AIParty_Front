// src/services/gemini.ts

import Constants from 'expo-constants';
import OpenAI from 'openai';

// Lee la clave desde expo-constants
const apiKey = (Constants.manifest as any).extra.GEMINI_API_KEY as string;

const client = new OpenAI({ apiKey });

export async function generateChallenge(prompt: string): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });
  return response.output_text;
}
