import { createSupabaseAdminClient } from '../_shared/supabaseAdmin.ts';

type SendEmailPayload = {
  tenantId: string;
  to: string;
  subject: string;
  html: string;
};

Deno.serve(async (req) => {
  try {
    const payload = (await req.json()) as SendEmailPayload;

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('RESEND_FROM') ?? 'Qurbanesia <no-reply@qurbanesia.id>';
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    const body = await res.json().catch(() => ({}));

    const supabase = createSupabaseAdminClient();
    await supabase.from('notification_logs').insert({
      tenant_id: payload.tenantId,
      recipient: payload.to,
      channel: 'email',
      status: res.ok ? 'sent' : 'failed',
      message: payload.subject,
      meta: { resend: body },
    });

    return new Response(JSON.stringify({ ok: res.ok, resend: body }), {
      status: res.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

