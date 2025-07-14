"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, Expand, Minimize, Send, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import Markdown from "@/components/markdown";
import { set } from "zod";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  /.cloud$/,
  ".site"
);

export function AIChatButton() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setChatOpen(true)} variant="outline">
        <Bot />
        <span>Ask AI</span>
      </Button>
      <AIChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const initialMessages: UIMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I'm your notes assistant. I can find and summarize any information that you saved.",
      },
    ],
  },
];

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
    <ChatContent
      token={token || ""}
      isExpanded={isExpanded}
      onClose={onClose}
      setIsExpanded={setIsExpanded}
      isAuthenticated={isAuthenticated}
      open={open}
    />
  );
}

function ChatContent({
  token,
  isExpanded,
  setIsExpanded,
  isAuthenticated,
  open,
  onClose,
}: {
  token: string;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  isAuthenticated: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    messages: initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isProcessing = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage({ text: input });
      setInput("");
    }
  }

  const handlekeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  const lastMessageUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom-10 bg-card fixed right-4 bottom-4 z-50 flex flex-col rounded-lg border shadow-lg duration-300 2xl:right-16",
        isExpanded
          ? "h-[650px] max-h-[90vh] w-[550px]"
          : "h-[500px] max-h-[80vh] w-80 sm:w-96"
      )}
    >
      <div className="bg-primary text-primary-foreground flex items-center justify-between rounded-t-lg border-b p-3">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-medium">Notes Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize /> : <Expand />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages(initialMessages)}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
            title="Clear chat"
          >
            <Trash />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary/90 h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {isAuthenticated && token ? (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto p-3">
            {messages.map((message) => (
              // <p key={message.id}>{JSON.stringify(message)}</p>
              <ChatMessage key={message.id} message={message} />
            ))}
            {lastMessageUser && isProcessing && <Loader />}
            {status === "error" && <ErrorMessage />}
            <div ref={messagesEndRef} />
          </div>

          <form className="flex gap-2 border-t p-3" onSubmit={onSubmit}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handlekeyDown}
              placeholder="Type your message..."
              className="max-h-[120px] min-h-[40px] resize-none overflow-y-auto"
              maxLength={1000}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isProcessing}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </>
      ) : (
        <div className="flex h-full items-center justify-center p-3">
          <Loader />
        </div>
      )}
    </div>
  );
}

interface ChatMessagProps {
  message: UIMessage;
}

function ChatMessage({ message }: ChatMessagProps) {
  const currentStep = message.parts[message.parts.length - 1];

  return (
    <div
      className={cn(
        "mb-2 flex max-w-[80%] flex-col prose dark:prose-invert",
        message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "prose dark:prose-invert rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted first:prose-p:mt-0"
        )}
      >
        {message.role === "assistant" && (
          <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
            <Bot className="text-primary size-3" />
            AI Assistant
          </div>
        )}
        {currentStep?.type === "text" && (
          <Markdown>{currentStep.text}</Markdown>
        )}
        {currentStep.type === "tool-invocation" && (
          <div className="italic animate-pulse">Searching notes...</div>
        )}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="ml-2 flex items-center gap-1 py-2">
      <div className="bg-primary size-1.5 animate-pulse rounded-full" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-150" />
      <div className="bg-primary size-1.5 animate-pulse rounded-full delay-300" />
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="text-red-500 text-sm">
      <p>Something went wrong. Please try again.</p>
    </div>
  );
}
