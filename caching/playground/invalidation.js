/**
 * Cache Invalidation Strategies
 */

// Simulated "Database"
const db = { user1: { name: "Alice", balance: 100 } };

// Simulated "Cache"
const cache = {};

// Simulate DB update
const updateDB = async (key, data) => {
    console.log(`[DB] 💾 Updating database for ${key}...`);
    db[key] = data;
};

/**
 * Strategy 1: Write-Through
 * Update both the database and the cache simultaneously.
 */
const writeThroughUpdate = async (key, data) => {
    await updateDB(key, data);
    
    // Update cache immediately
    cache[key] = data; 
    console.log(`[Cache] ✍️  Write-through: manually updated cache for ${key}`);
};

/**
 * Strategy 2: Invalidate on Write
 * Update the database, and DELETE the cache. The next read will fetch fresh data.
 */
const invalidateOnWriteUpdate = async (key, data) => {
    await updateDB(key, data);
    
    // Delete cache immediately
    delete cache[key]; 
    console.log(`[Cache] 🗑️  Invalidated: deleted cache for ${key}`);
};

// Application Read Function
const readUser = (key) => {
    if (cache[key]) {
        return `[Hit 🟢] ${JSON.stringify(cache[key])}`;
    }
    
    // Simulate DB read
    cache[key] = db[key];
    return `[Miss 🔴 (Fetched from DB)] ${JSON.stringify(db[key])}`;
};

// --- Runner ---
const run = async () => {
    console.log("--- Initial State ---");
    console.log("Read 1:", readUser('user1')); // Miss
    console.log("Read 2:", readUser('user1')); // Hit

    console.log("\n--- Strategy 1: Write-Through ---");
    await writeThroughUpdate('user1', { name: "Alice", balance: 200 });
    // Because we wrote to cache, the very next read is a HIT
    console.log("Read after Write-Through:", readUser('user1')); 

    console.log("\n--- Strategy 2: Invalidate on Write ---");
    await invalidateOnWriteUpdate('user1', { name: "Alice", balance: 50 });
    // Because we deleted the cache, the next read is a MISS, fetching fresh data from DB
    console.log("Read after Invalidate:", readUser('user1')); 
    // And now it's back in the cache
    console.log("Next read:", readUser('user1')); 
};

run();
