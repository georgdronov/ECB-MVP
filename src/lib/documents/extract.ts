import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const supportedExtensions = ["pdf", "docx", "txt", "md"] as const;
export type SupportedExtension = (typeof supportedExtensions)[number];

export function getExtension(filename: string): SupportedExtension | null {
  const extension = filename.toLowerCase().split(".").pop();
  return supportedExtensions.includes(extension as SupportedExtension) ? extension as SupportedExtension : null;
}

export async function extractText(buffer: Buffer, extension: SupportedExtension) {
  if (extension === "pdf") return (await pdfParse(buffer)).text;
  if (extension === "docx") return (await mammoth.extractRawText({ buffer })).value;
  return buffer.toString("utf8");
}

export function cleanText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function chunkText(text: string, chunkSize = 1200, overlap = 180) {
  const paragraphs = text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }
    if ((current + "\n\n" + paragraph).length <= chunkSize) {
      current += `\n\n${paragraph}`;
    } else {
      chunks.push(current);
      const tail = current.slice(-overlap);
      current = `${tail}\n\n${paragraph}`.trim();
    }
  }
  if (current) chunks.push(current);

  return chunks.length ? chunks : text.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
}
