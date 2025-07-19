import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

http.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // check this chatGpt link: https://chatgpt.com/share/6872ff2d-c084-800b-81e3-f8b0586c0f76
    // const user = await ctx.auth.getUserIdentity();
    const user = await ctx.runQuery(api.users.current, {});
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages }: { messages: UIMessage[] } = await request.json();

    const lastMessage = messages.slice(-10);

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: `
      You are a helpful assistant that can search through the user's notes.
      Use the information from the notes to answer questions and provide insights.
      If the requested information is not available, respond with "Sorry, I can't find that information in your notes".
      You can use markdown formatting like links, bullet points, numbered lists, and bold text.
      Provide links to relevant notes using this relative URL structure (omit the base URL): '/notes?noteId=<note-id>'.
      Keep your responses concise and to the point.
      `,
      messages: convertToModelMessages(lastMessage),
      tools: {
        findRelevantNotes: tool({
          description:
            "Retrieve relevant notes from the database based on the user's query",
          parameters: z.object({
            query: z.string().describe("The user's query"),
          }),
          execute: async ({ query }) => {
            console.log("findRelevantNotes query:", query);

            const relevantNotes = await ctx.runAction(
              internal.notesActions.findRelevantNotes,
              {
                query,
                userId: user._id,
              }
            );

            return relevantNotes.map((note) => ({
              id: note._id,
              title: note.title,
              body: note.body,
              creationTime: note._creationTime,
            }));
          },
        }),
      },
      onError(error) {
        console.error("StreamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        Vary: "origin",
      }),
    });
  }),
});

http.route({
  path: "/api/chat",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Origin": "http://localhost:3000/*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
