export default {
    async fetch(request) {
        if (request.method === "POST") {
            try {
                const contentType = request.headers.get("Content-Type") || "";

                // Ensure the content type is JSON
                if (!contentType.includes("application/json")) {
                    return new Response(
                        JSON.stringify({ error: "Content-Type must be application/json" }),
                        { status: 400, headers: { "Content-Type": "application/json" } }
                    );
                }

                // Parse the request body
                const body = await request.json();

                // Check if 'type' is in the body
                if (!body.type) {
                    return new Response(
                        JSON.stringify({ error: "'type' field is required" }),
                        { status: 400, headers: { "Content-Type": "application/json" } }
                    );
                }

                // Respond with the 'type'
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

        // Handle non-POST requests
        return new Response(
            JSON.stringify({ error: "Only POST requests are allowed" }),
            { status: 405, headers: { "Content-Type": "application/json" } }
        );
    },
};
