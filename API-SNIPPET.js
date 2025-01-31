/**
 * SET Snippet Rule to: 
 * (http.request.full_uri wildcard "*sub.domain.com/rest/*")
 */

// Global Vars is user-defined. Modify them for your needs

const apiSecretEnabled = true;
const whitelistEnabled = true;

// Define a whitelist of allowed URL patterns
const whitelist = [
  /\/rest\/?$/,
  /\/rest\/endpoint1$/,
  /\/rest\/endpoint2$/,
  /\/rest\/.*/
];

export default {
  async fetch(request) {
    const startTime = Date.now(); // Start profiling

    const apiSecret = request.headers.get("CF-API-Secret");
    const URL = request.url;
    const isWhitelisted = whitelist.some(pattern => pattern.test(URL));

    if (whitelistEnabled && !isWhitelisted) {
      const endTime = Date.now(); // End profiling
      return new Response(JSON.stringify({ message: "Access Denied: URL not allowed" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Snip-Time": `${endTime - startTime}ms`
        }
      });
    }

    if (apiSecretEnabled && apiSecret !== "12345") {
      const endTime = Date.now(); // End profiling
      return new Response(JSON.stringify({ message: "API Access Denied: Missing CF-API-Secret" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "X-Snip-Time": `${endTime - startTime}ms`
        }
      });
    }

    const response = await fetch(request);
    const endTime = Date.now(); // End profiling

    // Modify Response Headers with Profiling Data
    const newResponse = new Response(response.body, response);
    newResponse.headers.append("X-Snip-Time", `${endTime - startTime}ms`);

    return newResponse;
  },
};
