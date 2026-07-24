# 🩺 MedGuide AI – Clinical Guideline Assistant

> **An evidence-based, medical-grade AI assistant that answers clinical questions using Retrieval-Augmented Generation (RAG), Hybrid Retrieval, LangGraph Multi-Agent Architecture, and Automated Evidence Verification.**

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![License](https://img.shields.io/badge/License-MIT-success)

---

# 📖 Overview

MedGuide AI is a **medical-grade Retrieval-Augmented Generation (RAG)** system designed to answer clinical questions using evidence from trusted clinical guidelines instead of relying solely on LLM knowledge.

Unlike conventional AI chatbots, MedGuide AI retrieves relevant guideline sections, verifies whether the generated response is supported by evidence, cites the original sources, and automatically falls back to trusted medical web sources when the local knowledge base is insufficient.

The backend is built using a **LangGraph Multi-Agent Architecture**, making every response transparent, explainable, and evidence-grounded.

---

# ✨ Features

- 🔍 Hybrid Retrieval (Semantic Search + BM25)
- 🤖 Retrieval-Augmented Generation (RAG)
- 🧠 LangGraph Multi-Agent Workflow
- ✅ Evidence Verification Agent
- 📚 Automatic Clinical Citations
- 🌐 Web Search Fallback (Tavily API)
- 🦙 OpenRouter Integration with Ollama Fallback
- ⚡ FastAPI REST API
- 💻 React.js Frontend
- 📄 Clinical Guideline Processing Pipeline
- 🗂️ Chroma Vector Database
- 📑 BM25 Keyword Search
- 🩺 Medical-grade Prompt Engineering

---

# 🏗️ System Architecture

```text
                    User Query
                         │
                         ▼
              Hybrid Retrieval Agent
         (Semantic Search + BM25 Search)
                         │
                         ▼
               Relevant Guideline Chunks
                         │
                         ▼
                 Generation Agent (LLM)
          (OpenRouter → Ollama Fallback)
                         │
                         ▼
            Evidence Verification Agent
                         │
              Supported? ────────────────┐
                   │                     │
                  Yes                   No
                   │                     │
                   ▼                     ▼
          Citation Agent         Web Search Agent
              (Sources)             (Tavily API)
                   │                     │
                   └──────────────┬──────┘
                                  ▼
                      Final Clinical Answer
```

---

# 🛠 Tech Stack

## Backend

- Python
- FastAPI
- LangGraph
- LangChain

## LLM

- OpenRouter
- Ollama

## Retrieval

- ChromaDB
- BM25
- Sentence Transformers

## Frontend

- React.js
- JavaScript

## External Search

- Tavily API

---

# 🤖 Multi-Agent Workflow

## 1️⃣ Retrieval Agent

Retrieves the most relevant guideline chunks using:

- Semantic Vector Search
- BM25 Keyword Search

---

## 2️⃣ Generation Agent

Generates a grounded clinical response using only the retrieved evidence.

Supports:

- OpenRouter
- Ollama (Fallback)

---

## 3️⃣ Verification Agent

Validates whether the generated answer is supported by the retrieved evidence.

Returns:

- Supported / Not Supported
- Verification Reason

---

## 4️⃣ Citation Agent

Automatically extracts:

- Guideline Title
- Page Number
- Source Metadata

---

## 5️⃣ Web Search Agent

If sufficient evidence is unavailable locally, MedGuide AI automatically searches trusted medical sources.

Examples:

- WHO
- CDC
- NIH
- NICE

---

# 🔍 Retrieval Pipeline

```text
User Query
     │
     ▼

Semantic Search
     │

BM25 Search
     │

Merge Results
     │

Score Normalization
     │

Weighted Reranking
     │

Top Clinical Evidence
```

---

# 📂 Project Structure

```text
backend/

app/
│
├── agents/
│   ├── verification/
│   ├── citation/
│   └── websearch/
│
├── graph/
│   ├── state.py
│   ├── nodes.py
│   └── workflow.py
│
├── retrieval/
│   ├── retriever.py
│   ├── hybrid_retriever.py
│   ├── bm25_store.py
│   └── reranker.py
│
├── llm/
│   ├── generator.py
│   ├── openrouter_client.py
│   ├── ollama_client.py
│   └── prompt.py
│
├── ingest/
│
├── routes/
│
└── main.py

frontend/

src/
├── components/
├── pages/
├── services/
└── assets/
```

---

# ⚙️ API Flow

```text
POST /chat

        │

        ▼

Hybrid Retrieval

        │

        ▼

LLM Generation

        │

        ▼

Evidence Verification

        │

        ▼

Citation Generation

        │

(Optional)

Web Search Fallback

        │

        ▼

JSON Response
```

---

# 📌 Example Response

```json
{
  "answer": "Acute pain refers to pain lasting less than one month.",
  "sources": [
    {
      "title": "2022 CDC Clinical Practice Guideline",
      "page": 18
    }
  ],
  "verification": {
    "supported": true,
    "reason": "The answer is directly supported by the retrieved guideline."
  }
}
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/MedGuide-AI.git

cd MedGuide-AI
```

---

## Backend

Install dependencies

```bash
uv sync
```

Run the backend

```bash
uv run uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm start
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
OPENROUTER_API_KEY=YOUR_API_KEY

TAVILY_API_KEY=YOUR_API_KEY

OLLAMA_MODEL=llama3.1:8b
```

---

# 🎯 Current Capabilities

- ✅ Evidence-based clinical question answering
- ✅ Retrieval-Augmented Generation (RAG)
- ✅ Hybrid Retrieval (Semantic + BM25)
- ✅ LangGraph Multi-Agent Pipeline
- ✅ Evidence Verification
- ✅ Automatic Citations
- ✅ Web Search Fallback
- ✅ Source Attribution
- ✅ FastAPI Backend
- ✅ React Frontend

---

# 🚧 Future Improvements

- Docker Deployment
- User Authentication
- Conversation Memory
- PDF Upload & Analysis
- Medical Report Generation
- Drug Interaction Checker
- Clinical Decision Trees
- Multi-Guideline Support
- Streaming Responses
- Cloud Deployment (AWS / Azure / GCP)

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 🙏 Acknowledgements

- CDC Clinical Practice Guidelines
- WHO Clinical Guidelines
- LangChain
- LangGraph
- ChromaDB
- FastAPI
- React.js
- OpenRouter
- Ollama
- Tavily API

---

## ⭐ If you found this project useful, consider giving it a star on GitHub!