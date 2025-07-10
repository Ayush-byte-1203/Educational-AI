'use server';

/**
 * @fileOverview Detects student engagement based on facial expressions.
 *
 * - detectEngagement - A function that analyzes facial expressions to detect engagement.
 * - DetectEngagementInput - The input type for the detectEngagement function.
 * - DetectEngagementOutput - The return type for the detectEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEngagementInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a student's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectEngagementInput = z.infer<typeof DetectEngagementInputSchema>;

const DetectEngagementOutputSchema = z.object({
  engagementLevel: z
    .string()
    .describe(
      'The detected engagement level (e.g., engaged, neutral, disengaged, confused).' // Example values
    ),
  suggestedIntervention: z
    .string()
    .describe(
      'A suggestion for intervention based on the engagement level (e.g., ask a question, provide a hint, offer an alternative explanation).'
    ),
});
export type DetectEngagementOutput = z.infer<typeof DetectEngagementOutputSchema>;

export async function detectEngagement(input: DetectEngagementInput): Promise<DetectEngagementOutput> {
  return detectEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEngagementPrompt',
  input: {schema: DetectEngagementInputSchema},
  output: {schema: DetectEngagementOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing student engagement based on their facial expressions.

You will receive a photo of a student's face and analyze their facial expressions to determine their engagement level.  Engagement levels can be one of the following values: engaged, neutral, disengaged, confused.  Return only one of those values.

Based on the engagement level, you will also suggest an appropriate intervention to help the student re-engage with the material.

Photo: {{media url=photoDataUri}}

Engagement Level: // REQUIRED, MUST be one of the specified engagement level values.
Suggested Intervention: // REQUIRED.`, 
});

const detectEngagementFlow = ai.defineFlow(
  {
    name: 'detectEngagementFlow',
    inputSchema: DetectEngagementInputSchema,
    outputSchema: DetectEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
