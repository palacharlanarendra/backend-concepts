// redis-example.js
// Before running: npm install ioredis
// Note: You must have a Redis server running locally on port 6379, or use a cloud Redis URL.

const Redis = require('ioredis');

// Connect to Redis (defaults to localhost:6379)
const redis = new Redis();

async function runRedisDemo() {
    console.log("🚀 Starting Redis Demo...\n");

    const key = "user:123";

    // 1. SET and GET Data
    console.log("📝 1. Writing data to Redis...");
    await redis.set(key, JSON.stringify({ name: "Narendra", role: "Backend Developer" }));
    
    console.log("🔍 Reading data back...");
    const data = await redis.get(key);
    console.log(`🟢 Cache Hit: ${data}\n`);

    // 2. TTL (Time To Live) - Expiring Data
    console.log("⏳ 2. Setting a key with a 3-second expiration (TTL)...");
    const tempKey = "otp:998877";
    await redis.set(tempKey, "secret_code_xyz", "EX", 3); // EX = Seconds
    
    console.log("🔍 Immediately reading OTP:");
    console.log(await redis.get(tempKey));

    console.log("💤 Waiting 4 seconds for TTL to expire...");
    await new Promise(resolve => setTimeout(resolve, 4000));

    console.log("🔍 Reading OTP after 4 seconds:");
    const expiredData = await redis.get(tempKey);
    console.log(expiredData ? `🟢 Data: ${expiredData}` : `🔴 Cache Miss! Data expired.\n`);

    // 3. Simulating a Cache-Aside Pattern with Redis
    console.log("🔄 3. Cache-Aside Pattern Example:");
    const productId = "prod:99";
    
    let product = await redis.get(productId);
    if (product) {
        console.log("🟢 Cache Hit! Returning from Redis:", product);
    } else {
        console.log("🔴 Cache Miss! Fetching from Database...");
        // Simulating DB Call
        product = JSON.stringify({ id: 99, name: "Mechanical Keyboard", price: 150 });
        
        console.log("💾 Saving to Redis for next time...");
        await redis.set(productId, product, "EX", 10);
        console.log(`🟢 Data: ${product}`);
    }

    // 4. Advanced Data Structures
    console.log("\n📚 4. Advanced Data Structures (Hashes, Lists, Sets):");
    
    // 4a. Hashes (HSET / HGETALL) - Good for objects
    console.log("-> 🏗️ Hashes (Storing an object without JSON.stringify):");
    const userHashKey = "user:profile:999";
    await redis.hset(userHashKey, { name: "Alice", role: "Admin", active: "true" });
    const userHash = await redis.hgetall(userHashKey);
    console.log("   🟢 Retrieved Hash:", userHash);

    // 4b. Lists (LPUSH / LRANGE) - Good for queues or recent items
    console.log("-> 📋 Lists (Storing an array of recent tasks):");
    const listKey = "tasks:queue";
    await redis.lpush(listKey, "task_1", "task_2", "task_3");
    const tasks = await redis.lrange(listKey, 0, -1);
    console.log("   🟢 Retrieved List:", tasks);

    // 4c. Sets (SADD / SMEMBERS) - Good for unique items
    console.log("-> 🗃️ Sets (Storing unique tags):");
    const setKey = "tags:unique";
    await redis.sadd(setKey, "javascript", "nodejs", "redis", "redis"); // Duplicate 'redis' is ignored
    const tags = await redis.smembers(setKey);
    console.log("   🟢 Retrieved Set:", tags);

    // Clean up and disconnect
    await redis.del(key, productId, userHashKey, listKey, setKey);
    redis.quit();
    console.log("\n✅ Demo Complete!");
}

runRedisDemo().catch(err => {
    console.error("❌ Redis Connection Error! Ensure you have Redis installed and running locally on port 6379.");
    console.error(err.message);
    redis.quit();
});
