"use client";

import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
} from "@/components/ai-elements/attachments";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
    PromptInputProvider,
    PromptInput,
    PromptInputBody,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    // PromptInputToolbar,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Spinner } from "@/components/ui/spinner"

export default function RAGChatBot() {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status } = useChat();

    const handleSubmit = (message: PromptInputMessage) => {
        if (!message.text) {
            return;
        }
        sendMessage({
            text: message.text,
        });
        setInput("");
    };

    return <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
            <Conversation className="h-full">
                <ConversationContent>
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.parts.map((part, i) => {
                                switch (part.type) {
                                    case "text":
                                        return (
                                            <Fragment key={`${message.id}-${i}`}>
                                                <Message from={message.role}>
                                                    <MessageContent>
                                                        <MessageResponse>{part.text}</MessageResponse>
                                                    </MessageContent>
                                                </Message>
                                            </Fragment>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    ))}
                    {(status === "submitted" || status === "streaming") && <Spinner />}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>

            <PromptInputProvider>
                <PromptInput onSubmit={handleSubmit} className="mt-4">
                    <PromptInputBody>
                        <PromptInputTextarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="p-5"
                        />
                        {/* <PromptInputToolbar> */}
                        {/* <PromptInputTools> */}
                        {/* Model selector, web search, etc. */}
                        {/* </PromptInputTools> */}
                        <PromptInputSubmit className="m-2" />
                        {/* </PromptInputToolbar> */}
                    </PromptInputBody>
                </PromptInput>
            </PromptInputProvider>
        </div>
    </div>
}