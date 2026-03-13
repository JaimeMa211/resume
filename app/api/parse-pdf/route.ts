import { NextResponse } from "next/server";
import { createRequire } from "node:module";

export const runtime = "nodejs";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (dataBuffer: Buffer) => Promise<{ text?: string }>;

function isPdfBuffer(buffer: Buffer) {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString("utf8") === "%PDF";
}

async function parseWithPdfParse(buffer: Buffer) {
  const parsed = await pdfParse(buffer);
  return (parsed.text ?? "").trim();
}

async function parseWithPdfJs(buffer: Buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const doc = await loadingTask.promise;

  try {
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => {
          if ("str" in item && typeof item.str === "string") {
            return item.str;
          }
          return "";
        })
        .join(" ")
        .trim();

      if (text) {
        pageTexts.push(text);
      }
    }

    return pageTexts.join("\n\n").trim();
  } finally {
    await doc.destroy();
  }
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing PDF file in form field 'file'." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isPdfBuffer(buffer)) {
      return NextResponse.json({ error: "文件不是有效 PDF（缺少 %PDF 文件头）。" }, { status: 400 });
    }

    let text = "";
    let primaryError: unknown = null;

    try {
      text = await parseWithPdfParse(buffer);
    } catch (error) {
      primaryError = error;
    }

    if (!text) {
      try {
        text = await parseWithPdfJs(buffer);
      } catch (fallbackError) {
        const first = primaryError ? toErrorMessage(primaryError) : "unknown";
        const second = toErrorMessage(fallbackError);

        return NextResponse.json(
          {
            error:
              `PDF 解析失败。可能原因：文件损坏/加密，或该 PDF 为扫描件图片无可提取文本。` +
              ` primary=${first}; fallback=${second}`,
          },
          { status: 422 }
        );
      }
    }

    if (!text.trim()) {
      return NextResponse.json(
        {
          error: "未从 PDF 中提取到文本。该文件可能是扫描件图片版，建议先用 OCR 后再上传。",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
