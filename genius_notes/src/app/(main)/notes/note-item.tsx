"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { NotePreviewDialog } from "./note-preview-dialog";

interface NoteItemProps {
  note: Doc<"notes">;
}

export function NoteItem({ note }: NoteItemProps) {
  // Using Router.push (from next/navigation or next/router) is generally more optimized in Next.js apps.
  // It updates the URL and triggers client-side navigation without a full reload,
  // and integrates with Next.js routing and prefetching.
  // Example using next/navigation (Next.js 13+ app directory):
  const router = useRouter();

  function handleOpenNote() {
    window.history.pushState(null, "", `?noteId=${note._id}`);
    // router.push(`?noteId=${note._id}`);
  }
  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleOpenNote}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="line-clamp-3 text-sm text-muted-foreground whitespace-pre-line">
            {note.body}
          </div>
        </CardContent>
      </Card>
      <NotePreviewDialog note={note} />
    </>
  );
}
