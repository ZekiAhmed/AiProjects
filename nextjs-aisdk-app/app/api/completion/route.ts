import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return Response.json({ text });
  } catch (error) {
    console.error("Error generating text:", error);
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}



//====================================================================

// Gemini doc :- https://ai.google.dev/gemini-api/docs/embeddings


// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// export async function POST(req: Request) {
//     try {
//         const { prompt } = await req.json();

//         const { text } = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//         });

//         return Response.json({ text })
//     } catch (error) {
//         console.error("Error generating text:", error);
//         return Response.json({ error: "Failed to generate text" }, { status: 500 });
//     };

// }

//===============================================================================

// Ollama doc :- https://docs.ollama.com/api/introduction


// import ollama from 'ollama'

// export async function POST(req: Request) {
//     try {
//         const { prompt } = await req.json();

//         const response = await ollama.chat({
//             model: "gemma3:4b",
//              messages: [{ role: 'user', content: prompt }],
//         });

//         return Response.json(response.message.content)
//     } catch (error) {
//         console.error("Error generating text:", error);
//         return Response.json({ error: "Failed to generate text" }, { status: 500 });
//     };

// }







