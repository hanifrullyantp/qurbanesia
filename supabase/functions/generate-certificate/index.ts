import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';
import { createSupabaseAdminClient } from '../_shared/supabaseAdmin.ts';

type GeneratePayload = {
  tenantId: string;
  qurbanCaseId: string;
  shohibulName: string;
  animalCode?: string;
};

Deno.serve(async (req) => {
  try {
    const payload = (await req.json()) as GeneratePayload;
    const supabase = createSupabaseAdminClient();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font2 = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('SERTIFIKAT QURBAN', { x: 160, y: 760, size: 28, font, color: rgb(0.05, 0.4, 0.2) });
    page.drawText('Diberikan kepada:', { x: 60, y: 700, size: 14, font: font2, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(payload.shohibulName, { x: 60, y: 670, size: 22, font, color: rgb(0.05, 0.05, 0.05) });
    page.drawText(`Qurban Case: ${payload.qurbanCaseId}`, { x: 60, y: 630, size: 12, font: font2, color: rgb(0.3, 0.3, 0.3) });
    if (payload.animalCode) {
      page.drawText(`Hewan: ${payload.animalCode}`, { x: 60, y: 610, size: 12, font: font2, color: rgb(0.3, 0.3, 0.3) });
    }
    page.drawText(`Generated: ${new Date().toISOString()}`, { x: 60, y: 130, size: 10, font: font2, color: rgb(0.4, 0.4, 0.4) });

    const bytes = await pdfDoc.save();

    const bucket = 'certificates';
    const objectPath = `${payload.tenantId}/${payload.qurbanCaseId}.pdf`;

    const upload = await supabase.storage.from(bucket).upload(objectPath, bytes, {
      contentType: 'application/pdf',
      upsert: true,
    });
    if (upload.error) throw upload.error;

    await supabase.from('media_assets').insert({
      tenant_id: payload.tenantId,
      qurban_case_id: payload.qurbanCaseId,
      type: 'certificate',
      storage_bucket: bucket,
      storage_path: objectPath,
      stage: 'certificate',
    });

    return new Response(JSON.stringify({ ok: true, bucket, path: objectPath }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

