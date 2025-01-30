// Global configuration object
const config = {
  magentoAPIUrl: false, // Magento Proxied API URL
  magentoKey: null,
  ipLimit: 10,
  ipTimeWindow: 60,
  allowedPaths: [], // Define allowed endpoints to prevent abuse,
  env: []
};

const ipLimits = new Map(); // In-memory rate limit tracking

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log(url);
    const apiPath = url.pathname;

    processConfig(env);

    // Check rate limiting
    if (env.IP_LIMITH || false) {
      const rateLimitResponse = checkRateLimit(request, config.ipLimit, config.ipTimeWindow);
      if (rateLimitResponse) return rateLimitResponse;
    }

    if (!config.allowedPaths.some(regex => regex.test(apiPath))) {
      console.log("Denied: " + apiPath);
      return new Response("403 Forbidden: API access denied", { status: 403 });
    }

    // Construct the new Magento API request URL
    let proxyUrl = `${config.magentoAPIUrl}${apiPath}${url.search}`;
    //proxyUrl = proxyUrl.replace("//", "/");
    console.log("Proxy URL: " + proxyUrl);
    // Fix HTTPS and remove all extra slashes
    proxyUrl = "https://" + proxyUrl.replace("https:/", "").split("//").join("/");

    // Fetch the data from Magento API
    const response = await fetch(proxyUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" ? await request.text() : null
    });

    // Return the Magento API response
    return response;
  }
};

/**
 * Rate limiting function
 * @param {Request} request - Incoming request object
 * @param {number} limit - Maximum allowed requests per time window
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Response|null} - Returns 429 response if rate limit exceeded, otherwise null
 */
function checkRateLimit(request, limit = 10, timeWindow = 60000) {
  const ip = request.headers.get("CF-Connecting-IP") || "Unknown";

  if (!ipLimits.has(ip)) ipLimits.set(ip, []);

  const timestamps = ipLimits.get(ip);
  const now = Date.now();

  // Remove old timestamps outside the time window
  while (timestamps.length && timestamps[0] <= now - timeWindow) {
    timestamps.shift();
  }

  // If limit is exceeded, return a 429 Too Many Requests response
  if (timestamps.length >= limit) {
    return new Response("429 Too Many Requests", { status: 429 });
  }

  // Store new request timestamp
  timestamps.push(now);

  return null;
}

async function processConfig(env) {
  // Initialize config only once (on the first request in an execution context)
  if (!config.magentoAPIUrl) {
    config.env = env,
      config.magentoAPIUrl = env.MAGENTO_API_URL || "https://default-magento-store.com/rest/V1/";
    config.magentoKey = env.MAGENTO_API_KEY || "default-api-key";
    config.ipLimit = env.IP_LIMIT || config.ipLimit;
    config.ipTimeWindow = env.IP_WINDOW || config.ipTimeWindow;

    if (typeof env.ALLOWED_PATHS !== "object") {
      console.log("env.ALLOWED_PATHS !== object");
      console.log(env.ALLOWED_PATHS);
      config.allowedPaths = JSON.parse("['carts/mine','customers/me','products','orders','categories','payment-information']");
    } else {
      config.allowedPaths = env.ALLOWED_PATHS;
    }
    // Convert strings to RegExp (if necessary)
    config.allowedPaths = config.allowedPaths.map(pattern => {
      return pattern.includes("*") ? new RegExp(`${pattern.replace(/\*/g, ".*")}`) : new RegExp(`${pattern}`);
    });
  }
  console.log(config);
}

/**
 * Check if the requested API path matches any allowed RegExp pattern
 * @param {string} apiPath - Requested API path
 * @returns {boolean} - True if the path matches an allowed pattern
 */
function isAllowedPath(apiPath) {
  return config.allowedPaths.some((pattern) => pattern.test(apiPath));
}
