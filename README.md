# 🚀 Backend Concepts

A comprehensive, hands-on repository for mastering core backend engineering and system design concepts. 

## 📂 Generalized Learning Pattern

To ensure consistency and make studying easy, every backend concept in this repository will follow a strict, 4-tier structure. When adding a new concept (like `rate-limiting`, `message-queues`, or `database-sharding`), it will follow this exact layout:

```text
/concept-name/
│
├── {concept}.md     # 📖 Tier 1: The Core Theory
│                    # -> What it is, why we use it, real-world examples, and basic mechanics.
│
├── interview.md     # 🎯 Tier 2: Q&A Flashcards
│                    # -> Direct, concise answers to the most common interview questions (Junior to Mid-level).
│
├── advanced.md      # 🧠 Tier 3: System Design & Scaling
│                    # -> Senior/Staff level topics, architectural trade-offs, and distributed systems behavior.
│
└── /playground/     # 🛠️ Tier 4: The Hands-On Code
                     # -> Runnable Node.js scripts proving the concepts work.
                     ├── README.md (Explaining how to run the scripts)
                     ├── basic-example.js
                     └── edge-case-simulation.js
```

### Why this pattern works:
* **Progressive Overload**: You start with easy concepts and end with system design.
* **Separation of Concerns**: Pure theory is kept separate from actual codebase clutter.
* **Interview Ready**: You have dedicated cheat sheets (`interview.md` and `advanced.md`) for rapid revision right before an interview.

---

## 📚 Concepts Index

* [⚡ Caching](./caching) - In-memory, Redis, Cache-Aside, LRU, Cache Stampedes, Consistent Hashing, Edge Caching.
* *(More to come...)*
