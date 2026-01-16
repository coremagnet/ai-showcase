import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { roomImageUrl, sofaImageUrl } = await req.json();

    if (!roomImageUrl || !sofaImageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required images" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const FAL_AI_API_KEY = Deno.env.get("FAL_AI_API_KEY");

    const response = await fetch("https://fal.run/fal-ai/nano-banana-pro/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "show this sofa in my room. Replace my sofa if needed just place it anywhere if there are no sofa visible. Make sure the sizes match",
        image_urls: [roomImageUrl, sofaImageUrl],
        num_images: 1,
        output_format: "png",
        resolution: "2K",
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});