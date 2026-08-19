declare module "pdf-parse" {
  type PdfData = { text: string };
  export default function pdfParse(data: Buffer): Promise<PdfData>;
}
