/**
 * LRU Cache Implementation
 * 
 * A common interview question is to implement an LRU (Least Recently Used) cache.
 * In JavaScript, the Map object maintains insertion order, making it perfect for this!
 */

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        
        // Move to the end to show it was most recently used
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        // If it exists, remove it so we can update it and push it to the end
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        
        this.cache.set(key, value);
        
        // Evict if over capacity
        if (this.cache.size > this.capacity) {
            // map.keys().next().value gets the FIRST inserted key (Least Recently Used)
            const oldestKey = this.cache.keys().next().value;
            console.log(`[Evicting] Key '${oldestKey}' because cache reached capacity of ${this.capacity}`);
            this.cache.delete(oldestKey);
        }
    }
}

// --- Test the LRU Cache ---
console.log("--- Initializing LRU Cache (Capacity: 2) ---");
const cache = new LRUCache(2); 

console.log("\nAdding 1=A");
cache.put(1, "A"); 

console.log("Adding 2=B");
cache.put(2, "B"); 

console.log("Getting 1: ", cache.get(1)); // returns "A", 1 is now most recently used

console.log("\nAdding 3=C (Should evict 2 since 1 was just accessed)");
cache.put(3, "C"); // evicts key 2

console.log("Getting 2: ", cache.get(2)); // returns -1 (not found)
console.log("Getting 3: ", cache.get(3)); // returns "C"
