/**
 * Cache Stampede (Thundering Herd) Simulation
 * 
 * Shows what happens when multiple requests hit a cache miss at the exact same time.
 */

const cache = {};
// We'll use a Map to keep track of active promises for requests that are in-flight
const activeRequests = new Map();

// Simulate a slow database call
const fetchFromDB = async (key) => {
    console.log(`[DB] 🔴 Querying database for ${key}...`);
    return new Promise(resolve => {
        setTimeout(() => resolve(`Data for ${key}`), 1000);
    });
};

/**
 * ❌ Vulnerable to Cache Stampede
 * If 100 users request this at the same time and it's not in cache,
 * it will fire 100 simultaneous database queries.
 */
const getDataVulnerable = async (key) => {
    if (cache[key]) {
        console.log(`[Cache] 🟢 Hit for ${key}`);
        return cache[key];
    }
    
    // Multiple requests arriving here concurrently will ALL query the DB
    const data = await fetchFromDB(key);
    cache[key] = data;
    return data;
};

/**
 * ✅ Protected against Cache Stampede (Request Coalescing)
 * If 100 users request this at the same time, the first one locks it
 * and the other 99 wait for the first one's promise to resolve.
 */
const getDataProtected = async (key) => {
    if (cache[key]) {
        console.log(`[Cache] 🟢 Hit for ${key}`);
        return cache[key];
    }

    // If there's already a request fetching this key, wait for it instead of hitting DB again
    if (activeRequests.has(key)) {
        console.log(`[Lock] 🟡 Request already in flight for ${key}, waiting...`);
        return activeRequests.get(key); // Return the existing promise!
    }

    // Otherwise, start the request and store the promise so others can wait on it
    const promise = fetchFromDB(key).then(data => {
        cache[key] = data;            // 1. Cache the result
        activeRequests.delete(key);   // 2. Clean up the lock
        return data;
    });

    activeRequests.set(key, promise);
    return promise;
};

// --- Runner ---
const run = async () => {
    console.log("--- ❌ Running VULNERABLE version ---");
    cache['trending_tweet'] = null; // simulate cache miss
    
    // Fire 3 requests simultaneously (simulating 3 users clicking at the exact same time)
    await Promise.all([
        getDataVulnerable('trending_tweet'),
        getDataVulnerable('trending_tweet'),
        getDataVulnerable('trending_tweet')
    ]);

    console.log("\n--- ✅ Running PROTECTED version ---");
    cache['viral_video'] = null; // simulate cache miss
    
    // Fire 3 requests simultaneously
    await Promise.all([
        getDataProtected('viral_video'),
        getDataProtected('viral_video'),
        getDataProtected('viral_video')
    ]);
};

run();
