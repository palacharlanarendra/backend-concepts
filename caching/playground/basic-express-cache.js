const express = require("express");
const app = express();
const PORT = 3000;

// This object acts as our in-memory cache store
const cache = {};

// Mock database function with simulated delay
const fetchUserFromDB = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                name: "Narendra",
                age: 31,
                role: "Senior Backend Developer",
                bio: "Loves caching, databases, and system design."
            });
        }, 1500); // 1.5 seconds simulated DB query delay
    });
};

app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const start = Date.now();

    console.log(`\n--- Request received for user ID: ${userId} ---`);

    // 1. Check if data is in the Cache
    if (cache[userId]) {
        console.log("🟢 CACHE HIT: Returning data from cache");
        const timeTaken = Date.now() - start;
        return res.json({
            source: "cache",
            timeTaken: `${timeTaken}ms`,
            data: cache[userId]
        });
    }

    // 2. Cache Miss -> Fetch from 'Database'
    console.log("🔴 CACHE MISS: Querying the database...");
    const userFromDB = await fetchUserFromDB(userId);

    // 3. Store the result in Cache for subsequent requests
    console.log("💾 Storing result in cache...");
    cache[userId] = userFromDB;

    const timeTaken = Date.now() - start;
    
    // Return the response
    res.json({
        source: "database",
        timeTaken: `${timeTaken}ms`,
        data: userFromDB
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`💡 Try hitting: http://localhost:${PORT}/user/1 multiple times to see caching in action!`);
});
