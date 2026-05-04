# 🛠️ Caching Playground

This playground provides hands-on scripts to practice core caching concepts commonly asked about in interviews. You can run these independently to see how caching mechanisms work under the hood!

## 🏃‍♂️ How to Run

Navigate to this directory and run the scripts using Node.js:

### 1. Basic In-Memory Express Cache (`basic-express-cache.js`)
A minimal Express server demonstrating a simple Cache-Aside pattern using an in-memory JavaScript object.
```bash
node basic-express-cache.js
```

### 2. LRU Cache Data Structure (`lru-cache.js`)
An essential data structure interview question. Implements a Least Recently Used (LRU) cache using JavaScript's `Map`.
```bash
node lru-cache.js
```

### 2. Cache Stampede & Coalescing (`cache-stampede.js`)
Simulates what happens when multiple concurrent requests hit a cache miss at the exact same time, and shows how to fix it using Request Coalescing (storing Promises in the cache).
```bash
node cache-stampede.js
```

### 3. Cache Invalidation Strategies (`invalidation.js`)
Demonstrates the difference between "Write-Through" caching (updating the cache immediately) and "Invalidate on Write" (deleting the cache so the next read fetches fresh data).
```bash
node invalidation.js
```
