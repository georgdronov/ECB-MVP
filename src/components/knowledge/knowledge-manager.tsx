"use client";

import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Document = { id: string; title: string; source_type: string; file_size: number; status: string; error_message?: string | null; created_at: string };

function formatSize(size: number) { return size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${Math.round(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`; }

export function KnowledgeManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const [showText, setShowText] = useState(false); const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); const [limitMessage, setLimitMessage] = useState(""); const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  async function loadDocuments() {
    const response = await fetch("/api/documents"); const result = await response.json().catch(() => ({}));
    if (response.ok) setDocuments(result.documents || []); else setError(result.error || "Could not load knowledge sources.");
  }

  useEffect(() => { let active = true; fetch("/api/documents").then(async (response) => ({ response, result: await response.json().catch(() => ({})) })).then(({ response, result }) => { if (!active) return; if (response.ok) setDocuments(result.documents || []); else setError(result.error || "Could not load knowledge sources."); }); return () => { active = false; }; }, []);

  async function upload(file?: File) {
    setError(""); setLoading(true); const data = new FormData();
    if (file) data.set("file", file); else { data.set("title", title); data.set("content", content); }
    const response = await fetch("/api/documents", { method: "POST", body: data }); const result = await response.json().catch(() => ({})); setLoading(false);
    if (!response.ok) { if (response.status === 403) setLimitMessage(result.error || "Your plan limit has been reached."); else setError(result.error || "Upload failed."); return; }
    setTitle(""); setContent(""); setShowText(false); await loadDocuments();
  }

  async function remove(document: Document) {
    const response = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    if (!response.ok) setError("Could not delete this knowledge source.");
    setDeleteTarget(null);
    await loadDocuments();
  }

  const onDrop = (acceptedFiles: File[], rejectedFiles: Array<{ file: File }>) => { if (rejectedFiles.length) { setError("Unsupported file. Please use PDF, DOCX, TXT, or MD."); return; } if (acceptedFiles[0]) void upload(acceptedFiles[0]); };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, maxSize: 15 * 1024 * 1024, accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "text/plain": [".txt"], "text/markdown": [".md"] } });

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-muted">Teach your assistant what to know</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Knowledge</h1></div><Button variant="secondary" onClick={() => setShowText(!showText)}>+ Add text</Button></div>
    {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{error}</p> : null}
    <div {...getRootProps()} className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent hover:bg-accent-soft/40"}`}><input {...getInputProps()} /><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent-soft text-xl text-accent">↑</div><p className="mt-4 text-sm font-bold">{isDragActive ? "Drop your file here" : "Drag and drop a file here"}</p><p className="mt-1 text-sm text-muted">or click to browse · PDF, DOCX, TXT, MD · up to 15 MB</p>{loading ? <p className="mt-3 text-xs font-semibold text-accent">Processing your knowledge…</p> : null}</div>
    {showText ? <Card><CardContent className="space-y-4 pt-5"><input className="min-h-11 w-full rounded-xl bg-surface px-3.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-accent focus:outline-none" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title, e.g. Shipping FAQ" /><textarea className="min-h-36 w-full resize-y rounded-xl bg-surface px-3.5 py-3 text-sm ring-1 ring-border focus:ring-2 focus:ring-accent focus:outline-none" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Paste your company knowledge here..." /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setShowText(false)}>Cancel</Button><Button onClick={() => void upload()} loading={loading}>Save knowledge</Button></div></CardContent></Card> : null}
    {limitMessage ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="upgrade-title"><div className="relative w-full max-w-md rounded-3xl bg-surface p-7 text-center shadow-2xl ring-1 ring-border"><button className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-lg leading-none text-muted transition-all duration-200 hover:bg-surface-muted hover:text-foreground active:scale-95" onClick={() => setLimitMessage("")} aria-label="Close upgrade dialog">×</button><h2 id="upgrade-title" className="text-xl font-bold">You&apos;ve reached your plan limit</h2><p className="mt-2 text-sm leading-6 text-muted">{limitMessage}</p><p className="mt-2 text-sm text-muted">Upgrade your plan to keep adding company knowledge.</p><div className="mt-6 flex flex-col gap-2"><Link href="/app/billing" className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 ease-out hover:bg-accent-hover hover:shadow-md active:shadow-sm">View plans <span className="ml-2">→</span></Link><button className="h-10 rounded-xl text-sm font-semibold text-muted transition-all duration-200 hover:bg-surface-muted hover:text-foreground active:scale-[0.98]" onClick={() => setLimitMessage("")}>Maybe later</button></div></div></div> : null}
    {deleteTarget ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="relative w-full max-w-md rounded-3xl bg-surface p-7 shadow-2xl ring-1 ring-border"><button className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-lg leading-none text-muted transition-all duration-200 hover:bg-surface-muted hover:text-foreground active:scale-95" onClick={() => setDeleteTarget(null)} aria-label="Close delete dialog">×</button><h2 id="delete-title" className="text-xl font-bold">Delete knowledge source?</h2><p className="mt-2 text-sm leading-6 text-muted">&quot;{deleteTarget.title}&quot; and its indexed content will be permanently removed.</p><div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end"><button className="order-1 h-11 rounded-xl bg-danger px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md active:scale-[0.98]" onClick={() => void remove(deleteTarget)}>Delete source</button><button className="order-2 h-11 rounded-xl px-4 text-sm font-semibold text-muted transition-all duration-200 hover:bg-surface-muted hover:text-foreground hover:shadow-sm active:scale-[0.98]" onClick={() => setDeleteTarget(null)}>Cancel</button></div></div></div> : null}
    <Card><CardContent className="p-0">{documents.length ? <div className="divide-y divide-border">{documents.map((document) => { const tone = document.status === "ready" ? "success" : document.status === "failed" ? "danger" : "warning"; return <div key={document.id} className="flex items-center gap-4 px-5 py-4 sm:px-6"><span className={`grid size-10 shrink-0 place-items-center rounded-xl text-xs font-bold uppercase ${tone === "success" ? "bg-emerald-50 text-success" : tone === "danger" ? "bg-red-50 text-danger" : "bg-amber-50 text-warning"}`}>{document.source_type === "text" ? "Aa" : document.source_type}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{document.title}</p>{document.status === "failed" && document.error_message ? <p className="mt-1 text-xs text-danger">{document.error_message}</p> : <p className="mt-1 text-xs text-muted">{formatSize(document.file_size)} <span className="mx-1">•</span> Added {new Date(document.created_at).toLocaleDateString()}</p>}</div><Badge tone={tone}>{document.status}</Badge><button onClick={() => setDeleteTarget(document)} className="grid size-9 place-items-center rounded-full text-lg leading-none text-muted transition hover:bg-red-50 hover:text-danger" aria-label={`Delete ${document.title}`}>×</button></div>; })}</div> : <div className="px-6 py-16 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-2xl text-accent">✦</div><h2 className="mt-5 font-bold">Your knowledge base is empty</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">Upload your first document or paste your FAQs. Your assistant will use them to answer questions.</p></div>}</CardContent></Card>
  </div>;
}
