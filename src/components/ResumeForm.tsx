// app/profile/ResumeForm.tsx
"use client";

import { useState } from "react";

export default function ResumeForm({ resume }: { resume: string }) {
  const [content, setContent] = useState(resume);
  const [status, setStatus] = useState("");

  async function handleSave() {
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setStatus(res.ok ? "Saved!" : "Error saving");
  }

  async function handleDelete() {
    const res = await fetch("/api/resume", { method: "DELETE" });
    setStatus(res.ok ? "Deleted!" : "Error deleting");
    if (res.ok) setContent("");
  }

  return (
    <div>
      <textarea
        rows={8}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave} style={{ marginTop: 10 }}>
        Save Resume
      </button>
      <button onClick={handleDelete} style={{ marginLeft: 10 }}>
        Delete Resume
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
