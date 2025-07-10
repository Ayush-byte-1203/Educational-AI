// Implemented by Gemini.
'use server';

/**
 * @fileOverview A multimodal AI assistant for answering student queries.
 *
 * - generateResponse - A function that handles the generation of responses to student queries.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  textQuery: z.string().optional().describe('The text query from the student.'),
  voiceDataUri: z.string().optional().describe(
    "The voice query from the student, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  imageDataUri: z.string().optional().describe(
    "The image query from the student, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The comprehensive response to the student query.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are a helpful AI assistant in a classroom setting.  A student has asked a question, and you should provide a comprehensive answer.

  Here is the information provided by the student:

  {{#if textQuery}}
  Text Query: {{{textQuery}}}
  {{/if}}

  {{#if voiceDataUri}}
  Voice Query (audio): {{media url=voiceDataUri}}
  {{/if}}

  {{#if imageDataUri}}
  Image Query (image): {{media url=imageDataUri}}
  {{/if}}

  Please provide a comprehensive and helpful response.`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
