import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url).searchParams.get('url');
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL requerida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Proxying request to: ${url}`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await page.content();
    await browser.close();

    return new Response(
      content,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Error en el proxy:', error);
    return new Response(
      JSON.stringify({ error: 'Error al obtener la URL', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});