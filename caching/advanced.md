# 🧠 Advanced Caching & System Design

This guide covers senior and staff-level caching patterns and distributed system concepts. These are critical for System Design interviews and designing highly scalable architectures.

---

## 🏗️ 1. Standard Caching Patterns

When integrating a cache with a database, there are four standard architectural patterns to choose from. 

<details open>
<summary><strong>🟢 Cache-Aside (Lazy Loading)</strong></summary>

The most common caching strategy. The application is responsible for reading from and writing to the cache.

**How it works:**
1. App checks Cache.
2. If miss, App queries Database.
3. App writes result to Cache.
4. App returns data.

* **Pros:** Cache only contains requested data (efficient memory use). Database failures don't instantly crash the cache.
* **Cons:** First request is always slow (cache miss penalty). Risk of stale data unless TTLs or invalidation are used.
</details>

<details>
<summary><strong>🔵 Read-Through Cache</strong></summary>

Unlike Cache-Aside, the application *only* interacts with the Cache. The Cache itself is responsible for fetching missing data from the Database.

**How it works:**
1. App requests data from Cache.
2. If miss, Cache queries Database synchronously.
3. Cache stores the data and returns it to the App.

* **Pros:** Simplifies application code (app treats cache as the main data store).
* **Cons:** Harder to implement as the cache provider needs a plugin/integration to talk to your specific database.
</details>

<details>
<summary><strong>🟡 Write-Through Cache</strong></summary>

Data is written to the Cache and the Database at the exact same time.

**How it works:**
1. App writes data to Cache.
2. Cache synchronously writes data to Database.
3. Once both are updated, success is returned.

* **Pros:** Data in cache is *never* stale. Read performance is always excellent.
* **Cons:** Write operations suffer higher latency because you have to wait for two network calls (Cache + DB) before returning success.
</details>

<details>
<summary><strong>🔴 Write-Back (Write-Behind) Cache</strong></summary>

Optimized for extremely heavy write workloads. 

**How it works:**
1. App writes data *only* to the Cache.
2. Cache immediately returns success to the App (ultra-fast).
3. Cache asynchronously syncs the data to the Database in the background (e.g., in batches every 5 seconds).

* **Pros:** Incredible write performance. Protects the DB from massive write spikes.
* **Cons:** **High risk of data loss.** If the Cache server crashes before syncing to the DB, the data is gone permanently.
</details>

---

## 🌍 2. Distributed Caching & Scaling

When your application scales to millions of users, a single Redis server won't have enough memory or network capacity. You must distribute the cache.

<details>
<summary><strong>What is Sharding / Partitioning?</strong></summary>

Splitting your cache data across multiple Redis servers. For example, User IDs 1-5000 go to Redis Node A, and 5001-10000 go to Redis Node B.
</details>

<details open>
<summary><strong>The Problem: Standard Hashing</strong></summary>

If you have 3 Redis nodes, you might use a standard modulo function: `hash(key) % 3` to determine which node stores the key.

* **The Disaster:** If Node 3 crashes, your total node count drops to 2. Now the formula is `hash(key) % 2`. *Every single key* now maps to a different node. The entire cache is effectively invalidated instantly, causing a massive database stampede.
</details>

<details>
<summary><strong>The Solution: Consistent Hashing</strong></summary>

**Consistent Hashing** is an algorithm that maps data to nodes on an abstract circle (a hash ring). 

* If a node crashes, only the keys belonging to that specific node are remapped to the next available node on the ring. 
* The rest of the keys (belonging to the healthy nodes) stay exactly where they are.
* **Interview takeaway:** Consistent hashing prevents massive cache invalidation when cache servers are added or removed.
</details>

---

## ⚡ 3. Edge Caching & CDNs

While Redis caches API JSON data, static assets need a different strategy.

<details>
<summary><strong>What is a CDN (Content Delivery Network)?</strong></summary>

A CDN (like Cloudflare, AWS CloudFront, or Fastly) is a globally distributed network of proxy servers. They cache static assets (HTML, CSS, JS, Images, Videos) as close to the user's geographical location as possible.
</details>

<details>
<summary><strong>How Edge Caching Works</strong></summary>

1. A user in Tokyo requests a heavy image from your server located in New York.
2. The Tokyo CDN Edge Node intercepts the request.
3. **Miss:** It fetches the image from NY, saves a copy in Tokyo, and sends it to the user.
4. **Hit:** The next 10,000 users in Tokyo get the image instantly from the Tokyo node. The NY server does zero work.

* **Interview tip:** Always separate dynamic API caching (Redis) from static asset caching (CDN) when designing a system.
</details>
