import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const templateFileMap: Record<string, string> = {
  "template-1": "简历模版（一）(1).pdf",
  "template-2": "简历模板（二）(1).pdf",
  "template-3": "ZW-00065简约风求职简历模板.pdf",
};

type RouteContext = {
  params: Promise<{ templateId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { templateId } = await context.params;
  const fileName = templateFileMap[templateId];

  if (!fileName) {
    return NextResponse.json({ error: "模板不存在" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "example", fileName);

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "模板文件读取失败" }, { status: 500 });
  }
}
