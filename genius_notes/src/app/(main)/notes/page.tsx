import { Metadata } from "next";
import { NotesPage } from "./notes-page";
import { Authenticated } from "convex/react";

export const metadata: Metadata = {
  title: "Your Notes",
};

export default function Page() {
  return (
    // <Authenticated>
    <NotesPage />
    // </Authenticated>
  );
}
