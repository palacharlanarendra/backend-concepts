# ⚡ Caching in Node.js / Express

<details open>
<summary><strong>📖 What is Caching?</strong></summary>

Caching is the process of temporarily storing frequently accessed data in fast-access storage so future requests can be served faster without repeatedly hitting the database or performing expensive computation.

> 💡 **Interview Definition:**  
> Caching improves performance by storing reusable data closer to the application/user for faster retrieval.

</details>

<details>
<summary><strong>🤔 Why Use Caching?</strong></summary>

### 🐌 Without Cache
```text
Request → Server → Database → Response
```

### 🚀 With Cache
```text
Request → Server → Cache → Response
                ↓ (Miss)
             Database
```

### ✨ Benefits
* ⚡ **Faster API response times**
* 📉 **Reduced database load**
* 📈 **Better scalability**
* 💰 **Lower infrastructure cost**

</details>

<details>
<summary><strong>🌍 Real World Example</strong></summary>

For a URL shortener: `short.ly/abc123`

Every redirect request may hit DB:
```sql
SELECT original_url FROM urls WHERE short_code='abc123';
```

If accessed **10,000 times/day**:
* 🔴 **Without Cache:** 10,000 DB queries
* 🟢 **With Cache:** 1 DB query + 9,999 cache hits

</details>

<details>
<summary><strong>🗂️ Types of Caching</strong></summary>

### 1️⃣ Client-Side Caching
Stored in browser/app.  
*Example:*
```js
res.set("Cache-Control", "public, max-age=3600");
```

### 2️⃣ Server-Side Caching
Stored in memory / Redis / Memcached.  
*Examples:*
* 🧠 In-Memory JS Object
* 🔴 Redis

</details>

<details>
<summary><strong>💻 Basic In-Memory Cache Implementation</strong></summary>

```js
const express = require("express");
const app = express();

const cache = {};

app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;

    // 1️⃣ Check Cache
    if (cache[userId]) {
        console.log("🟢 CACHE HIT");
        return res.json(cache[userId]);
    }

    // 2️⃣ Simulate DB Call (Cache Miss)
    console.log("🔴 CACHE MISS → DB HIT");

    const userFromDB = {
        id: userId,
        name: "Narendra",
        age: 31
    };

    // 3️⃣ Store in Cache
    cache[userId] = userFromDB;

    res.json(userFromDB);
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

#### 🔄 Request Flow

**First Request** (`GET /user/1`)
* Cache Empty ❌
* DB Queried 🔍
* Response Stored in Cache 💾

**Second Request** (`GET /user/1`)
* Cache Hit 🎯
* Returned Instantly ⚡
* No DB Call 🚫

> 🗣️ **Interview Explanation:**
> We first check whether the requested data exists in cache. If yes, return cached response. If not, fetch from database, store it in cache, and return the response.

</details>

<details>
<summary><strong>⚠️ Limitations of In-Memory Cache</strong></summary>

1. **Lost on Server Restart** 🔄
   `Server Restart → Cache Cleared`
2. **Not Shared Across Multiple Servers** 🌐
   `Server A Cache ≠ Server B Cache`
3. **Memory Can Grow Unbounded** 📈
   *Needs an eviction strategy.*

</details>

<details>
<summary><strong>🏭 Production Solution: Redis</strong></summary>

Instead of `const cache = {};`, use **Redis** because it provides:
* 💾 **Persistent cache**
* 🌍 **Shared across servers**
* ⏱️ **TTL (Time To Live) support**
* 🗑️ **Eviction policies**
* 🚀 **Better scalability**

</details>

<details>
<summary><strong>🧹 Cache Invalidation & Eviction</strong></summary>

### 🛑 The Problem
If DB data changes, cache may become stale.

### 🔄 Invalidation Strategies
1. **Write Through:** Update DB and Cache Together
   ```js
   db.update(...)
   cache[key] = updatedValue
   ```
2. **Invalidate on Write:** Delete Cache on Update
   ```js
   db.update(...)
   delete cache[key]
   ```

### 🗑️ Cache Eviction Policies
* **LRU (Least Recently Used):** Remove least recently accessed item.
* **LFU (Least Frequently Used):** Remove least frequently accessed item.
* **FIFO (First In First Out):** Remove oldest inserted item.

</details>

<details>
<summary><strong>🔥 Common Interview Questions</strong></summary>

* **Q: Why Cache Redirect Endpoint Instead of Shorten Endpoint?**
  * A: Because redirect endpoint is **read-heavy** and frequently accessed. Shorten endpoint is usually **write-once**.
* **Q: Should We Cache Missing Data?**
  * A: Yes, sometimes. This is called **Negative Caching**. (e.g., Cache 404 result briefly to prevent repeated DB hits for invalid requests).
* **Q: Why Redis Over In-Memory Object?**
  * A: Survives app restarts, works across multiple servers, supports TTL/eviction, and is production-grade.

</details>

---

## 📝 Quick Revision Cheat Sheet

```text
🎯 Cache Hit  = Data Found in Cache
❌ Cache Miss = Data Not Found in Cache

🔄 Flow:
Request → Cache → DB (if miss)

✅ Best For:
- Read-heavy endpoints
- Frequently accessed data
- Expensive computations
```

> 🌟 **Final Interview Summary:**
> Caching is a performance optimization technique where frequently accessed data is stored in faster storage like memory or Redis to reduce latency and database load.
