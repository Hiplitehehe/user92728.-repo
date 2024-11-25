export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        // Parse the incoming JSON body
        const body = await request.json();
        if (!body.type) {
          return new Response(
            JSON.stringify({ error: "'type' field is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Store the 'type' in Cloudflare KV
        await TYPE_STORE.put("latest_type", body.type);  // Save the type in KV store

        return new Response(
          JSON.stringify({ message: "You sent this type:", type: body.type }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "Invalid JSON" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (request.method === "GET") {
      const url = new URL(request.url);
      const requestedType = url.searchParams.get("type");

      if (requestedType) {
        // Retrieve the latest 'type' value from KV based on the query parameter
        const latestType = await TYPE_STORE.get(requestedType);

        return new Response(
          JSON.stringify({ message: `Requested type: ${requestedType}`, type: latestType }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // If no query parameter is provided
      const latestType = await TYPE_STORE.get("latest_type");

      return new Response(
        JSON.stringify({ message: "Latest type value", type: latestType }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Only POST and GET requests are allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  },
};
