import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "请上传图片" }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.toLowerCase().split(".").pop();

      let image;
      if (ext === "png") {
        image = await pdfDoc.embedPng(buffer);
      } else {
        image = await pdfDoc.embedJpg(buffer);
      }

      const { width, height } = image.size();
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images.pdf"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "转换失败: " + (e as Error).message }, { status: 500 });
  }
}
