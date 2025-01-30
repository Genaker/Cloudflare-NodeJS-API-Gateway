  /**
  * SET Snippet Rule to: 
  * (http.request.full_uri wildcard "*sub.domain.com/rest/*")
  */
export default {
  async fetch(request) {

    const apiSecret = request.headers.get("CF-API-Secret");

    if (apiSecret !== "12345") {
      return new Response(JSON.stringify({ message: "API Access Denied: Missing CF-API-Secret" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const response = await fetch(request);
    /*
    // Clone the response so that it's no longer immutable
    const newResponse = new Response(response.body, response);
 
    // Add a custom header with a value
    newResponse.headers.append(
      "x-snippets-hello",
      "Hello from Cloudflare Snippets"
    );
 
    // Delete headers
    newResponse.headers.delete("x-header-to-delete");
    newResponse.headers.delete("x-header2-to-delete");
 
    // Adjust the value for an existing header
    newResponse.headers.set("x-header-to-change", "NewValue");
    */
    return response;
    //return newResponse;
  },
};
