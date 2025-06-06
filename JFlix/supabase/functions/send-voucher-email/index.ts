// supabase/functions/send-voucher-email/index.ts

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
// Import your preferred email sending library, e.g., Resend
// For Resend: import { Resend } from 'https://esm.sh/resend@3.2.0'; 

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize email client (e.g., Resend)
// const resendApiKey = Deno.env.get('RESEND_API_KEY'); // Store API key in Supabase secrets
// const resend = new Resend(resendApiKey);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { voucher_code, payer_email, validity_days } = await req.json();

    if (!voucher_code || !payer_email) {
      return new Response(JSON.stringify({ error: 'Missing voucher_code or payer_email' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const emailSubject = `Your JFlix Voucher Code!`;
    const emailHtmlBody = `
      <h1>Thank you for your purchase!</h1>
      <p>Here is your JFlix voucher code:</p>
      <h2>${voucher_code}</h2>
      <p>This voucher is valid for <strong>${validity_days || 'the specified duration'}</strong>.</p>
      <p>Enjoy your premium access!</p>
      <p>Thanks,<br>The JFlix Team</p>
    `;
    const emailTextBody = `
      Thank you for your purchase!
      Here is your JFlix voucher code: ${voucher_code}
      This voucher is valid for ${validity_days || 'the specified duration'}.
      Enjoy your premium access!
      Thanks,
      The JFlix Team
    `;

    console.log(`Attempting to send voucher email to: ${payer_email} with code: ${voucher_code}`);

    // --- !!! Placeholder for actual email sending logic !!! ---
    // Replace this with your chosen email service integration
    // Example with Resend (conceptual, requires Resend setup and API key):
    /*
    if (!resendApiKey) {
        console.error('RESEND_API_KEY is not set in environment variables.');
        throw new Error('Email service is not configured.');
    }
    const { data, error } = await resend.emails.send({
      from: 'JFlix <noreply@yourdomain.com>', // Replace with your sending email
      to: [payer_email],
      subject: emailSubject,
      html: emailHtmlBody,
      text: emailTextBody,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`);
    }
    console.log('Email sent successfully via Resend:', data);
    */
    
    // --- Mock success if no email service is integrated yet ---
    console.warn("Mocking email send: No actual email service integrated in this Edge Function yet.");
    const mockEmailSendData = { messageId: `mock_${Date.now()}` };
    // --- End Mock ---


    return new Response(JSON.stringify({ success: true, message: 'Email processed (mocked).', details: mockEmailSendData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-voucher-email function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
