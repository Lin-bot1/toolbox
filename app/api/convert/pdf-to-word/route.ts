import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "请上传 PDF 文件" }, { status: 400 });
    }

    const uint8 = new Uint8Array(await file.arrayBuffer());

    const { extractText } = await import("unpdf");
    const { text } = await extractText(uint8, { mergePages: true });
    const lines = text.split("\n").filter((l: string) => l.trim().length > 0);

    const paragraphs = lines.map(
      (line: string) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 120 },
        })
    );

    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "(PDF 中未提取到文本内容，可能是扫描件或图片型 PDF)", size: 24 })],
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: file.name.replace(/\.pdf$/i, ""),
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 240 },
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    const docBuffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(docBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name.replace(/\.pdf$/i, ".docx"))}"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "转换失败: " + (e as Error).message }, { status: 500 });
  }
}
