# **Cloudflare 2 API Gateway Worker**

A **Cloudflare Worker** to secure and optimize API requests to a **Magento 2 store**. This worker:
- ✅ **Blocks unauthorized API requests** (requires `CF-API-Secret` header).
- ✅ **Implements rate limiting** to prevent abuse.
- ✅ **Restricts access** to whitelisted API endpoints.
- ✅ **Forwards allowed requests** to the Magento API.

---

## ** Supported Platforms**
 - Magento 1-2 and forks
 - WordPress
 - Shopify
 - ORO Commerce
 - Word Press
 - Shopware 6
 - Sylius
 - ODO
 - other platforms
   
---


## **🚀 Features**
| Feature | Status |
|---------|--------|
| **Blocks unauthorized API requests** | ✅ Implemented |
| **Requires `CF-API-Secret` header** | ✅ Implemented |
| **Enforces rate limiting per IP** | ✅ Implemented |
| **Whitelists specific API endpoints** | ✅ Implemented |
| **Prevents Magento API abuse** | ✅ Implemented |

---

## **📌 How It Works**
1. **Intercepts API requests** before they reach Magento.
2. **Checks the `CF-API-Secret` header** for authentication.
3. **Validates API paths** to prevent unauthorized access.
4. **Implements rate limiting** per IP.
5. **Forwards valid requests** to Magento's API.

---

## **📁 Deployment Guide**
### **1️⃣ Deploy the Worker in Cloudflare**
1. **Go to Cloudflare Dashboard** → **Workers & Pages**.
2. Click **Create Application** → **Create Worker**.
3. Replace the default script with the worker (below).

---

### **2️⃣ Configure Environment Variables**
| **Variable**       | **Default Value** | **Description** |
|-------------------|----------------|----------------|
| `MAGENTO_API_URL` | `"https://default-magento-store.com/rest/V1/"` | Magento API base URL. |
| `MAGENTO_API_KEY` | `"default-api-key"` | Magento API authentication key. |
| `WORKER_SECRET` | `"12345"` | Required `CF-API-Secret` header value. |
| `IP_LIMIT` | `10` | Max API requests per IP per time window. |
| `IP_WINDOW` | `60` | Time window (seconds) for rate limiting. |
| `ALLOWED_PATHS` | `["carts/mine","customers/me","products","orders","categories","payment-information"]` | Whitelisted API endpoints. |

---

## **📝 Worker Code**
Create a file named **`worker.js`** and paste the  code from this repo 
---

## **📌 Testing the Worker**
### **❌ Unauthorized Request (Blocked)**
```sh
curl -X GET "https://your-worker.cloudflare.com/rest/V1/orders"
```
🔴 **Response:**
```json
{
    "message": "403 Forbidden: API access denied"
}
```

---

### **✅ Authorized Request (Allowed)**
```sh
curl -X GET "https://your-worker.cloudflare.com/rest/V1/orders" -H "CF-API-Secret: 12345"
```
🟢 **Response:**  
- **Forwards request** to Magento API.
- **Returns Magento API response**.

---

## **🚀 Deployment & Activation**
1️⃣ **Deploy the Worker**
```sh
wrangler deploy
```

2️⃣ **Set Up Environment Variables in Cloudflare**
- **Go to Cloudflare Dashboard** → **Workers & Pages**.
- **Click Settings** → **Add Environment Variables**.
- Add:
  ```
  MAGENTO_API_URL = "https://your-magento-store.com/rest/V1/"
  MAGENTO_API_KEY = "your-secure-api-key"
  WORKER_SECRET = "super-secret-key"
  ```

3️⃣ **Activate Worker on Your Domain**
- **Go to Cloudflare Dashboard** → **Workers & Pages**.
- **Set Worker Route:**  
  ```
  https://your-worker.cloudflare.com/rest/*
  ```

---

## **🛡️ Security Recommendations**
- **Change the `WORKER_SECRET` regularly**.
- **Limit API paths to prevent excessive exposure**.
- **Enable rate limiting to prevent API abuse**.

---

# **Magento 2 API Access Control Using Cloudflare Snippet**

## **🚀 Overview**
This repository contains a **Cloudflare Snippet** that **secures Magento 2 API access** by enforcing authentication through a custom **`CF-API-Secret`** header. It ensures that only authorized requests can access **Magento REST API endpoints**.

## **🔒 Security Features**
- ✅ **Blocks unauthorized API requests** unless they include the correct `CF-API-Secret` header.
- ✅ **Works at the Cloudflare edge**, preventing unauthorized access before reaching the Magento server.
- ✅ **Lightweight and efficient**, with no impact on Magento’s backend.
- ✅ **Can be combined with additional security headers**.

---

## **📁 Installation & Deployment**
### **1️⃣ Create a Cloudflare Snippet**
1. **Go to Cloudflare Dashboard** → Select your domain.
2. Click **Rules** → **Snippets**.
3. Click **Create Snippet**.
4. Name the snippet: **Magento API Security**.
5. Paste the code from [`snippet.js`](#-snippetjs) below.
6. **Set the snippet rule** to apply to:
   ```
   (http.request.full_uri wildcard "*sub.domain.com/rest/*")
   ```
7. **Save & Deploy**.

