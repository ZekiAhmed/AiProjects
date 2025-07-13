# Chat Summary and Solutions

This document summarizes the debugging process of an AI chat feature in a Next.js application using Convex and Clerk.

## Initial Problem: 401 Unauthorized Error

- **Symptom:** When sending a message in the chat, the application returned a 401 Unauthorized error.
- **Analysis:** The error was traced to the `/api/chat` route in `convex/http.ts`. The backend was not correctly identifying the user from the request.
- **Solution:** The `convex/http.ts` file was modified to use `ctx.auth.getUserIdentity()` to properly authenticate the user.

### Code Comparison (`convex/http.ts`)

**Old Code:**
```typescript
// const userId = await ctx.auth.getUserIdentity();
const user = await ctx.runQuery(api.users.current, {});
if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```

**New Code:**
```typescript
const user = await ctx.auth.getUserIdentity();
// const user = await ctx.runQuery(api.users.current, {});
if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Second Problem: 500 Internal Server Error

- **Symptom:** After fixing the 401 error, the application started returning a 500 Internal Server Error.
- **Analysis:** The error was identified as a missing API key for the Google AI service. The `streamText` function was failing because it could not authenticate with the Google AI service.
- **Solution:** The user was instructed to add the `GOOGLE_API_KEY` as an environment variable to the Convex project.

## Third Problem: "Could not parse JWT payload" Error & Loader Stuck

- **Symptom:** The application threw a "Could not parse JWT payload" error, and the chat functionality was not appearing, with the loader being stuck.
- **Analysis:** This error was caused by the frontend sending the request before the authentication token had been loaded. The `useChat` hook was being initialized with an undefined token because of an incorrect hook (`useAuthToken`) being used.
- **Solution:** The `AIChatBox` component in `src/app/(main)/notes/ai-chat-button.tsx` was refactored to use the correct hooks (`useConvexAuth` and `useAuth` from `@clerk/nextjs`) to fetch the token and conditionally render the `ChatContent` component only after a valid token has been retrieved.

### Code Comparison (`src/app/(main)/notes/ai-chat-button.tsx`)

**Old Code:**
```typescript
function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [input, setInput] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const token = useAuthToken();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  if (!open) return null;

  return (
    // ... rest of the component
  );
}
```

**New Code:**
```typescript
function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getToken({ template: "convex" }).then(setToken);
    } else {
      setToken(null);
    }
  }, [isAuthenticated, getToken]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom-10 bg-card fixed right-4 bottom-4 z-50 flex flex-col rounded-lg border shadow-lg duration-300 2xl:right-16",
        isExpanded
          ? "h-[650px] max-h-[90vh] w-[550px]"
          : "h-[500px] max-h-[80vh] w-80 sm:w-96"
      )}
    >
      {/* ... rest of the component ... */}
      {isAuthenticated && token ? (
        <ChatContent token={token} />
      ) : (
        <div className="flex h-full items-center justify-center p-3">
          <Loader />
        </div>
      )}
    </div>
  );
}

function ChatContent({ token }: { token: string }) {
  // ... chat content component
}
```