# 🎯 Final Caching Interview Questions

This is a complete revision sheet covering everything from fundamentals to advanced caching concepts.

---

## 🌱 Fundamentals

<details open>
<summary><strong>1. What is caching?</strong></summary>

**Answer:**
Caching is storing frequently accessed data in faster, intermediate storage (like RAM) so future requests can be served quickly without repeatedly hitting the database or recomputing expensive results.

*Example:* Storing user session data in Redis so that the application doesn't have to query the SQL database on every page load.
</details>

<details>
<summary><strong>2. Why do we use caching?</strong></summary>

**Answer:**
* ⚡ **Reduce latency:** Data is fetched from memory instead of disk.
* 📉 **Reduce database load:** Fewer queries hit the primary database.
* 📈 **Improve scalability:** The system can handle more concurrent users.
* 💰 **Lower infrastructure cost:** Cache servers are often cheaper to scale than relational databases.
</details>

<details>
<summary><strong>3. What is a cache hit and cache miss?</strong></summary>

**Answer:**
* 🎯 **Cache Hit:** Data requested by the application is successfully found in the cache.
* ❌ **Cache Miss:** Data is not found in the cache, requiring the application to fetch it from the primary database (and usually store it in the cache for next time).
</details>

<details>
<summary><strong>4. Is caching a data structure?</strong></summary>

**Answer:**
No. Caching is a *performance optimization strategy*. It is implemented *using* data structures like hash maps or key-value stores.
</details>

<details>
<summary><strong>5. Is cache single-threaded?</strong></summary>

**Answer:**
It depends on the implementation. The concept of a cache isn't single-threaded, but specific tools might be.

*Example:* Redis is famously single-threaded for command execution, which prevents race conditions without complex locking mechanisms. Memcached, on the other hand, is multi-threaded.
</details>

---

## 🛠️ Practical Backend Questions

<details>
<summary><strong>6. Which endpoint would you cache in a URL shortener?</strong></summary>

**Answer:**
The **redirect/read endpoint** (e.g., `GET /xyz123`), because it is heavily read-intensive and accessed thousands of times.
</details>

<details>
<summary><strong>7. Why not cache the create/shorten endpoint?</strong></summary>

**Answer:**
Because the shorten endpoint (e.g., `POST /shorten`) is **write-heavy**. Users typically generate a short URL once. Caching a write operation that isn't repeatedly read immediately provides no benefit.
</details>

<details>
<summary><strong>8. When should you cache data?</strong></summary>

**Answer:**
Typically on the **first read** (lazy caching or cache-aside strategy). When a user requests data, check the cache. If it's a miss, read from the DB, save it to the cache, and return it.
</details>

<details>
<summary><strong>9. Why not cache everything?</strong></summary>

**Answer:**
Because memory (RAM) is expensive and limited. Also, not all data is frequently accessed. Caching everything leads to high eviction rates and wasted resources on data that is never read again.
</details>

<details>
<summary><strong>10. What kind of data is ideal for caching?</strong></summary>

**Answer:**
* 📖 **Frequently read** (e.g., top 10 daily news articles)
* 🐢 **Rarely updated** (e.g., country lists, configuration settings)
* 🧮 **Expensive to compute/fetch** (e.g., complex monthly sales analytics reports)
</details>

---

## 🔄 Cache Invalidation / Consistency

<details>
<summary><strong>11. What is cache invalidation?</strong></summary>

**Answer:**
Removing or updating stale cache entries when the original source data changes in the database.
</details>

<details>
<summary><strong>12. Why is cache invalidation hard?</strong></summary>

**Answer:**
Because maintaining consistency between two separate systems (Cache and DB) is challenging, especially in distributed systems where network failures can happen between updating the DB and updating the cache.
</details>

<details>
<summary><strong>13. How do you update cache when DB changes?</strong></summary>

**Answer:**
* **Write-Through:** Update the cache simultaneously with the DB. (e.g., `cache[key] = updatedValue`)
* **Invalidate on Write:** Delete the cache entry when the DB updates, forcing a cache miss on the next read. (e.g., `delete cache[key]`)
</details>

<details>
<summary><strong>14. What happens if you don’t invalidate cache?</strong></summary>

**Answer:**
Users will receive **stale/incorrect data**.

*Example:* A user updates their profile picture, but without invalidation, they continue to see their old picture because the app keeps serving it from the cache.
</details>

---

## 🏗️ System Design / Scaling

<details>
<summary><strong>15. Why is in-memory cache (like a JS object) not enough in production?</strong></summary>

**Answer:**
* 🔄 **Lost on restart:** If the Node.js server crashes, all cached data is wiped.
* 🌐 **Not shared across servers:** If you have 5 load-balanced servers, they each have their own isolated cache.
* 📉 **Limited memory:** The cache competes with the application for RAM.
</details>

<details>
<summary><strong>16. Why use Redis instead of JS object cache?</strong></summary>

**Answer:**
Redis is a dedicated, production-grade caching server.
* **Distributed & Shared:** All app servers connect to the same Redis instance.
* **Persistent:** Can save data to disk so it survives restarts.
* **TTL support:** Built-in expiration times for keys.
</details>

<details>
<summary><strong>17. What happens if Redis goes down?</strong></summary>

**Answer:**
The system should gracefully fallback to the Database. The cache should **never be the source of truth**. Latency will spike, but the application will remain functional.
</details>

<details>
<summary><strong>18. How do multiple app servers share cache?</strong></summary>

**Answer:**
By using a **centralized/distributed cache cluster** (like Redis or Memcached) deployed on separate instances that all application servers connect to over the network.
</details>

---

## 🚀 Advanced Topics

<details>
<summary><strong>19. What is negative caching?</strong></summary>

**Answer:**
Caching failed lookups, missing data, or `404 Not Found` responses temporarily.

*Example:* If an attacker repeatedly requests a non-existent URL (`/user/999999`), caching the 404 response prevents them from overwhelming the database with invalid queries.
</details>

<details>
<summary><strong>20. What is cache stampede (Thundering Herd)?</strong></summary>

**Answer:**
When a highly popular cache key expires or is deleted, and suddenly hundreds of concurrent requests all experience a cache miss at the exact same millisecond. They all query the database simultaneously, potentially causing it to crash.
</details>

<details>
<summary><strong>21. How do you prevent cache stampede?</strong></summary>

**Answer:**
* 🔒 **Locking / Request Coalescing:** The first request acquires a lock, queries the DB, and repopulates the cache. Other requests wait for the lock to release.
* 🔄 **Background refresh:** A background worker updates the cache *before* the TTL expires.
* 🎲 **Randomized TTLs:** Adding jitter to expiration times so keys don't all expire at the exact same moment.
</details>

<details>
<summary><strong>22. What is cache warming / prewarming?</strong></summary>

**Answer:**
Proactively loading popular data into the cache *before* user traffic arrives.

*Example:* Before launching a massive Black Friday sale, a script preloads all the discounted product details into Redis.
</details>

<details>
<summary><strong>23. What is a hot key problem?</strong></summary>

**Answer:**
When a single cache key gets a disproportionate, massive amount of traffic, overwhelming the specific Redis node that holds that key.

*Example:* A celebrity posts a viral tweet. Millions of people request that specific tweet ID simultaneously.
</details>

<details>
<summary><strong>24. How do you solve hot key issues?</strong></summary>

**Answer:**
* 🖥️ **Local cache layer:** Cache the hot key directly in the application's memory (e.g., JS object) for a few seconds to absorb the traffic.
* 🌍 **CDN:** Serve the content from edge nodes.
* ✂️ **Replication:** Add more read replicas to the caching layer to distribute the read load.
</details>

---

## 🧹 Eviction / Memory Management

<details>
<summary><strong>25. What happens when cache is full?</strong></summary>

**Answer:**
The cache engine triggers an **eviction policy** to remove existing entries to make room for new data.
</details>

<details>
<summary><strong>26. What is LRU?</strong></summary>

**Answer:**
**Least Recently Used:** Removes the item that hasn't been accessed for the longest time.
</details>

<details>
<summary><strong>27. What is LFU?</strong></summary>

**Answer:**
**Least Frequently Used:** Removes the item that has the lowest total access count.
</details>

<details>
<summary><strong>28. Why is LRU popular?</strong></summary>

**Answer:**
Because of the principle of **temporal locality**: data that was recently accessed is highly likely to be accessed again soon.
</details>

---

## 📊 Metrics / Monitoring

<details>
<summary><strong>29. How do you measure cache performance?</strong></summary>

**Answer:**
By tracking the **Cache Hit Ratio**:
`Cache Hit Ratio = Hits / (Hits + Misses)`
</details>

<details>
<summary><strong>30. What is a good cache hit ratio?</strong></summary>

**Answer:**
It heavily depends on the use case, but generally, a ratio of **80% or higher** is considered strong for most web applications.
</details>

---

## 🧠 Senior-Level Thinking Questions

<details>
<summary><strong>31. Can caching hurt performance?</strong></summary>

**Answer:**
Yes, if:
* 📉 **Hit ratio is low:** You pay the latency penalty of checking the cache first, only to hit the DB anyway.
* 🔄 **Frequent invalidation:** Constantly updating the cache takes processing power.
* 📦 **Serialization overhead:** Converting massive JSON objects to strings and back takes CPU time.
* 🌐 **Network latency:** If the Redis server is in a different data center, the network trip might be slower than a fast DB query.
</details>

<details>
<summary><strong>32. Would you cache user-specific sensitive data?</strong></summary>

**Answer:**
Only very carefully. It must have proper scoping (using the `userId` in the cache key), isolation, and short TTLs to prevent accidental data leakage (e.g., User A seeing User B's bank balance).
</details>

<details>
<summary><strong>33. What should never be the source of truth?</strong></summary>

**Answer:**
**The Cache.** The underlying Database remains the absolute source of truth. The cache is merely a fast, disposable snapshot.
</details>

---

> 🏆 **Golden Interview Statement:**
> *"Caching improves read performance significantly, but introduces complexity around invalidation, consistency, and memory management."*

---

💡 *Next logical topic:* **Rate Limiting interview questions** *(pairs naturally with caching in backend/system design interviews).*
