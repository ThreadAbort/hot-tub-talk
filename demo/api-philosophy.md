# **Cheet API Structure and Philosophy Guide**

## **Core Philosophy**
The **Cheet API** is the backbone of Cheet.is, enabling seamless navigation, unbiased information delivery, and dynamic interaction with users. Its design is grounded in:

1. **Simplicity**: Clear, concise endpoints and minimal configuration.
2. **Efficiency**: Hierarchical tagging, relevance scoring, and content relationships.
3. **User Empowerment**: A focus on intuitive navigation and objective content.

---

## **Key Components**

### **1. `42.md`**
- **Purpose**: Acts as the foundational document for the platform, loaded during the Qdrant Initialization process.
- **Content**:
  - Philosophical underpinnings of Cheet.is.
  - Taxonomy of categories (e.g., Computers, Music, Entertainment, etc.).
  - Relationships and initial tags with relevance levels (e.g., `[1]` most relevant, `[50+]` less relevant).
- **Loading**:
  - Script: `scripts/load_42.py`.
  - Ensures the Qdrant vector database is initialized with `42.md` to set the tone and structure.

---

### **2. Navigation**
- **No Search**:
  - The Cheet at the bottom of the screen guides users intuitively.
  - Users can click links or rely on the Cheet’s suggestions for exploration.
- **Dynamic Content Delivery**:
  - Content relationships are dynamically computed based on tags, importance, and proximity.

---

### **3. Unbiased News**
- **Goal**: Provide objective, fact-driven summaries of current events.
- **Functionality**:
  - Pulls from verified sources.
  - Processes headlines into concise, unbiased summaries.
  - Available via `/news/unbiased` endpoint.

---

### **4. Tagging System**
- **Structure**:
  - Tags use numerical importance levels in brackets `[num]`, ranging from:
    - **`[1]`**: Most relevant.
    - **`[50+]`**: Peripheral relevance.
- **Purpose**:
  - Enables hierarchical relationships between Cheets.
  - Facilitates personalized recommendations.

---

## **API Overview**

### **Endpoints**
| **Endpoint**            | **Method** | **Description**                           |
|--------------------------|------------|-------------------------------------------|
| `/cheets`               | `GET`     | Retrieve all Cheets.                      |
| `/cheets/{id}`          | `GET`     | Retrieve a specific Cheet by ID.          |
| `/tags`                 | `GET`     | Retrieve all available tags.              |
| `/related/{id}`         | `GET`     | Get related Cheets for a given Cheet ID.  |
| `/news/unbiased`        | `GET`     | Fetch the latest unbiased news summaries. |

---

## **Initialization Workflow**
1. **Set Up Environment**:
   - Python 3.12+
   - Qdrant vector database running.
2. **Load `42.md`**:
   - Use `scripts/load_42.py` to initialize the database.
3. **Run the API**:
   - Command: `uvicorn main:app --reload`.

---

## **Guiding Principles for Maintenance**
1. **Consistency**:
   - Always structure new Cheets with YAML front matter.
   - Use hierarchical tags with relevance levels for scalability.
2. **Modularity**:
   - Maintain separation of concerns (e.g., news handling vs. Cheet content).
3. **Unbiased Information**:
   - News summaries should remain factual and objective.

---

## **Example Front Matter**
```yaml
---
title: Docker Cheat Sheet
description: A quick reference for Docker commands and NVIDIA CUDA setup.
category: Technology
tags:
  - docker [1]
  - nvidia [2]
  - cuda [3]
  - troubleshooting [10]
related:
  - devcontainer [5]
  - ubuntu [10]
---
```

---

## **Philosophy: Why `42`?**
Inspired by *The Hitchhiker’s Guide to the Galaxy*, `42.md` symbolizes curiosity, creativity, and connection. The number **42** reminds us to focus on the right questions rather than just chasing answers.

Every feature of this API reflects that ethos:
- Simplify complexity.
- Empower discovery.
- Foster harmony between humans and AI.

---

## **Questions for Claude**
If adding new features or maintaining the structure:
1. Are new tags appropriately prioritized and structured?
2. Does the feature align with the simplicity and efficiency philosophy?
3. Are unbiased principles upheld in news-related functionality?
