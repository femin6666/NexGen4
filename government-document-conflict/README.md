# GovVerify
### Government Document Conflict Detection & Evidence Verification System

> **Phase 1: Project Foundation**  
> An enterprise document intelligence web platform designed to analyze multiple official government documents, identify contradictory statements, and trace every conflict back to verified page numbers, sections, and source evidence.

---

## 1. Problem Statement

Government bodies, legal auditors, and administrative authorities frequently issue overlapping orders, policies, notifications, and circulars across fiscal years and departments. These documents often contain:
- Conflicting eligibility criteria (e.g., varying age cutoffs: 18 vs 21 years)
- Discrepant financial thresholds (e.g., income limits: ₹2,50,000 vs ₹3,00,000)
- Inconsistent compliance deadlines and conditional exceptions

Generic AI chatbots and LLMs typically smooth over these differences by generating a single synthesized answer, creating legal risk and hallucination. **GovVerify strictly rejects this black-box approach**: if two official documents contain contradictory information, the system explicitly exposes the disagreement and presents verbatim source evidence from both documents.

---

## 2. Objective

Provide an explainable, auditable verification pipeline that:
1. Ingests multiple government documents (Orders, Policies, Notifications, Circulars, Guidelines, Reports).
2. Extracts atomic claims, conditions, and numerical criteria into structured models.
3. Semantically matches related clauses across different documents.
4. Identifies and categorizes discrepancies (Direct Conflict, Numeric, Date, Conditional Difference, Policy Change).
5. Links every conflict directly to verified evidence (Document name, page number, clause heading, and verbatim text).

---

## 3. Core Workflow

```text
Upload Multiple Government Documents
                 ↓
      Extract Statement Claims
                 ↓
    Semantic Matching Across Docs
                 ↓
    Compare Meanings and Thresholds
                 ↓
         Detect Conflicts
                 ↓
     Show Both Conflicting Claims
                 ↓
  Show Exact Source Document + Page + Section
                 ↓
 Provide Explainable Verification Report
```

---

## 4. Current Phase: Phase 1 — Project Foundation

In accordance with the incremental development roadmap, **Phase 1 establishes the complete full-stack foundation**:
- ✅ Full-stack architecture with clean separation of concerns
- ✅ FastAPI backend with health check, CORS, and Pydantic schemas
- ✅ MongoDB database models (`users`, `documents`, `statements`, `conflicts`, `evidence`, `analyses`)
- ✅ Document upload API with MIME/extension validation and secure file storage in `uploads/`
- ✅ React + TypeScript + Vite + Tailwind CSS frontend
- ✅ Professional Document Intelligence UI (60% `#F8F9F7`, 30% `#17212B`/`#1F3347`, 10% `#0F766E`/`#D97706`)
- ✅ 8 Core Pages: Landing Page, Dashboard, Documents, Analysis Pipeline, Conflicts, Evidence Citations, Reports, and Settings
- ✅ Live system health monitoring (Backend & Database connection pills)
- ✅ Demo seed mechanism featuring a realistic scholarship policy conflict scenario

---

## 5. Technology Stack

### Frontend
- **Framework**: React.js 18 with TypeScript
- **Tooling**: Vite
- **Styling**: Tailwind CSS (Enterprise Document Intelligence Theme)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Typography**: Outfit & Inter (Google Fonts)

### Backend
- **Framework**: Python 3.12, FastAPI
- **Server**: Uvicorn (ASGI)
- **Data Validation & Settings**: Pydantic v2, Pydantic-Settings
- **Database Driver**: PyMongo (MongoDB Atlas compatible)
- **File Ingestion**: Python-Multipart

### Database
- **Engine**: MongoDB (Local or MongoDB Atlas compatible)
- **Collections**: `users`, `documents`, `statements`, `conflicts`, `evidence`, `analyses`

---

## 6. Project Architecture & Directory Structure

```text
government-document-conflict/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Logo.tsx             # Document/Shield/Check brand mark
│   │   │   ├── Navbar.tsx           # Landing page top navigation
│   │   │   ├── Footer.tsx           # Enterprise legal footer
│   │   │   ├── ConflictCard.tsx     # Reusable conflict card with badges
│   │   │   └── UploadModal.tsx      # Drag & drop upload modal with validation
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Public landing page with hero & workflow
│   │   │   ├── DashboardPage.tsx    # Stats cards & live health monitoring
│   │   │   ├── DocumentsPage.tsx    # Document repository table & upload
│   │   │   ├── AnalysisPage.tsx     # 7-Step pipeline visualizer
│   │   │   ├── ConflictsPage.tsx    # Conflict explorer with taxonomy filters
│   │   │   ├── EvidencePage.tsx     # Citation & verbatim quote viewer
│   │   │   ├── ReportsPage.tsx      # Audit report generator placeholder
│   │   │   └── SettingsPage.tsx     # Application & sensitivity preferences
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx  # Responsive sidebar & status bar layout
│   │   ├── services/
│   │   │   └── api.ts               # Centralized Axios API service
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces for data models
│   │   ├── App.tsx                  # Client router
│   │   ├── main.tsx                 # React entrypoint
│   │   └── index.css                # Design tokens and custom styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── health.py        # / and /api/health endpoints
│   │   │   │   ├── documents.py     # Document upload, list, get, delete
│   │   │   │   ├── seed.py          # Demo scholarship scenario seed
│   │   │   │   ├── conflicts.py     # Conflict listing endpoints
│   │   │   │   ├── evidence.py      # Citation listing endpoints
│   │   │   │   ├── statements.py    # Statement listing endpoints
│   │   │   │   ├── analysis.py      # Analysis history endpoints
│   │   │   │   └── reports.py       # Reports placeholder
│   │   │   └── router.py            # Aggregated API router
│   │   ├── database/
│   │   │   └── mongodb.py           # PyMongo client & health ping check
│   │   ├── schemas/
│   │   │   ├── document.py          # Document schema
│   │   │   ├── statement.py         # Statement claim schema
│   │   │   ├── conflict.py          # Conflict schema
│   │   │   ├── evidence.py          # Evidence citation schema
│   │   │   └── analysis.py          # Analysis pipeline schema
│   │   ├── services/
│   │   │   └── document_service.py  # File validation, disk save & DB persist
│   │   ├── config.py                # Pydantic configuration & env validation
│   │   └── main.py                  # FastAPI app, CORS & lifecycle
│   ├── requirements.txt
│   └── .env.example
│
├── uploads/
│   └── .gitkeep                     # Safe physical file storage
│
├── .gitignore
├── README.md
└── .env.example
```

---

## 7. MongoDB Setup

### 1. Connecting to MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write access.
3. Under **Network Access**, whitelist your IP address (or `0.0.0.0/0` for development).
4. Copy your connection string and add it to `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   DATABASE_NAME=govverify
   ```

### 2. Graceful Fallback
If MongoDB is not running locally or the Atlas connection string is pending, the backend automatically reports `database: "disconnected"` on the `/api/health` check without crashing, allowing full UI exploration and document testing.

---

## 8. Environment Variables

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=govverify
FRONTEND_URL=http://localhost:5173
SECRET_KEY=govverify-dev-secret-key-phase-1
MAX_FILE_SIZE_MB=25
UPLOAD_DIR=../../uploads
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 9. Installation and Running

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API
```bash
cd government-document-conflict/backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API will be live at `http://127.0.0.1:8000`  
Interactive Swagger Docs at `http://127.0.0.1:8000/docs`

### 2. Start the Frontend Application
```bash
cd government-document-conflict/frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Frontend will be live at `http://127.0.0.1:5173`

---

## 10. API Endpoints Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Operational check |
| `GET` | `/api/health` | Live backend and MongoDB ping status |
| `POST` | `/api/documents/upload` | Upload PDF, DOCX, or TXT file & save metadata |
| `GET` | `/api/documents` | List all documents in repository |
| `GET` | `/api/documents/{id}` | Retrieve document metadata by ID |
| `DELETE` | `/api/documents/{id}` | Delete document record and disk file |
| `GET` | `/api/conflicts` | List detected conflicts (filter by type) |
| `GET` | `/api/evidence` | List citations and verbatim extracts |
| `GET` | `/api/statements` | List extracted structured claims |
| `GET` | `/api/analysis` | Retrieve comparison run history |
| `POST` | `/api/seed/demo` | Seed scholarship scenario demo dataset |
| `POST` | `/api/seed/clear` | Clear demo dataset |

---

## 11. Sample Demonstration Scenario

GovVerify includes a built-in demonstration dataset based on a **Higher Education Scholarship Discrepancy**:
1. **Government Order 2024**: Clause 4.1 sets minimum student age at **18 years**, income ceiling below **₹2,50,000**.
2. **Government Policy 2025**: Section 3.2 raises minimum age to **21 years** for tuition grants, income ceiling to **₹3,00,000**.
3. **Government Circular 2025**: Paragraph 2 creates a conditional exception for students aged **18–20** in affiliated colleges.

To load this scenario at any time, click **"Load Scholarship Demo"** in the sidebar or send a `POST` to `/api/seed/demo`. All sample records are labeled **DEMO DATA**.

---

## 12. Future Development Phases

The project is structured to seamlessly support upcoming phases without redesigning the foundation:

```text
Phase 2: Document Processing & Statement Extraction
  ├── PDF & DOCX text extraction
  ├── OCR for scanned gazettes
  └── Structured claim parsing (Subject, Attribute, Value, Condition)

Phase 3: Semantic Matching & Conflict Detection Engine
  ├── Sentence Transformers & vector embeddings
  ├── Cosine similarity matching
  ├── Natural Language Inference (NLI) classification
  └── Deterministic numerical & temporal comparison rules

Phase 4: Evidence Verification & Explainable Reporting
  ├── Exact citation locator
  ├── LLM-assisted claim explanations (with source constraints)
  └── PDF audit report export
```
