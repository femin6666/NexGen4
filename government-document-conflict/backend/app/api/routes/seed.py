from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter
from bson import ObjectId

from app.database.mongodb import db_manager
from app.services.document_service import _in_memory_docs

router = APIRouter(prefix="/api/seed", tags=["Demo Data Seed"])

# In-memory stores for demo entities if DB is offline
_in_memory_statements: Dict[str, Dict[str, Any]] = {}
_in_memory_conflicts: Dict[str, Dict[str, Any]] = {}
_in_memory_evidence: Dict[str, Dict[str, Any]] = {}
_in_memory_analyses: Dict[str, Dict[str, Any]] = {}


def get_demo_dataset():
    now_iso = datetime.utcnow().isoformat() + "Z"

    # 3 Documents (Scholarship Scenario)
    doc_1_id = "66f40001a1b2c3d4e5f60001"
    doc_2_id = "66f40001a1b2c3d4e5f60002"
    doc_3_id = "66f40001a1b2c3d4e5f60003"

    documents = [
        {
            "_id": doc_1_id,
            "title": "Government Order 2024 - Higher Education Scholarship Scheme",
            "fileName": "GO_2024_HigherEducation_Scholarship.pdf",
            "documentType": "Government Order",
            "department": "Department of Higher Education",
            "documentDate": "2024-06-15",
            "filePath": "uploads/demo_go_2024.pdf",
            "fileSize": 1048576,
            "pageCount": 12,
            "status": "analyzed",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": doc_2_id,
            "title": "Government Policy 2025 - National Post-Matric Grant Policy",
            "fileName": "Policy_2025_National_Grant.pdf",
            "documentType": "Government Policy",
            "department": "Ministry of Social Justice & Empowerment",
            "documentDate": "2025-01-10",
            "filePath": "uploads/demo_policy_2025.pdf",
            "fileSize": 2097152,
            "pageCount": 28,
            "status": "analyzed",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": doc_3_id,
            "title": "Government Circular 2025 - Clarification on Student Age Criteria",
            "fileName": "Circular_2025_Age_Clarification.pdf",
            "documentType": "Government Circular",
            "department": "State Scholarship Directorate",
            "documentDate": "2025-03-01",
            "filePath": "uploads/demo_circular_2025.pdf",
            "fileSize": 524288,
            "pageCount": 4,
            "status": "analyzed",
            "createdAt": now_iso,
            "isDemo": True
        }
    ]

    # Statements
    stmt_1_id = "66f40002a1b2c3d4e5f60001"
    stmt_2_id = "66f40002a1b2c3d4e5f60002"
    stmt_3_id = "66f40002a1b2c3d4e5f60003"
    stmt_4_id = "66f40002a1b2c3d4e5f60004"
    stmt_5_id = "66f40002a1b2c3d4e5f60005"

    statements = [
        {
            "_id": stmt_1_id,
            "documentId": doc_1_id,
            "pageNumber": 3,
            "section": "Clause 4.1: General Eligibility",
            "statementText": "Students must be 18 years or older at the commencement of the academic session.",
            "subject": "Student",
            "attribute": "Minimum Age",
            "value": 18,
            "condition": None,
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": stmt_2_id,
            "documentId": doc_2_id,
            "pageNumber": 7,
            "section": "Section 3.2: Age Thresholds",
            "statementText": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "subject": "Student",
            "attribute": "Minimum Age",
            "value": 21,
            "condition": "full tuition reimbursement",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": stmt_3_id,
            "documentId": doc_1_id,
            "pageNumber": 4,
            "section": "Clause 5.2: Means Test",
            "statementText": "Total gross family income must be below ₹2,50,000 per annum from all sources.",
            "subject": "Family",
            "attribute": "Annual Income Ceiling",
            "value": 250000,
            "condition": None,
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": stmt_4_id,
            "documentId": doc_2_id,
            "pageNumber": 9,
            "section": "Section 4.1: Financial Ceiling",
            "statementText": "Total parental/family income must be below ₹3,00,000 per annum to qualify for category aid.",
            "subject": "Family",
            "attribute": "Annual Income Ceiling",
            "value": 300000,
            "condition": "category aid",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": stmt_5_id,
            "documentId": doc_3_id,
            "pageNumber": 2,
            "section": "Paragraph 2: Special Exemptions",
            "statementText": "Students aged 18–20 may apply if studying in an approved government-affiliated college.",
            "subject": "Student",
            "attribute": "Conditional Age Exemption",
            "value": "18-20",
            "condition": "studying in approved college",
            "createdAt": now_iso,
            "isDemo": True
        }
    ]

    # Conflicts
    conflict_1_id = "66f40003a1b2c3d4e5f60001"
    conflict_2_id = "66f40003a1b2c3d4e5f60002"
    conflict_3_id = "66f40003a1b2c3d4e5f60003"

    conflicts = [
        {
            "_id": conflict_1_id,
            "statementAId": stmt_1_id,
            "statementBId": stmt_2_id,
            "conflictType": "NUMERIC_CONFLICT",
            "confidence": 0.96,
            "severity": "HIGH",
            "topic": "Minimum Age Requirement",
            "reason": "Direct numeric divergence regarding minimum applicant age: GO 2024 mandates 18 years, whereas Policy 2025 mandates 21 years.",
            "statementAText": "Students must be 18 years or older at the commencement of the academic session.",
            "statementBText": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "documentAName": "Government Order 2024 - Higher Education",
            "documentBName": "Government Policy 2025 - National Grant",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": conflict_2_id,
            "statementAId": stmt_3_id,
            "statementBId": stmt_4_id,
            "conflictType": "POLICY_CHANGE",
            "confidence": 0.89,
            "severity": "MEDIUM",
            "topic": "Family Income Ceiling",
            "reason": "Ceiling updated from Rs 2,50,000 in GO 2024 to Rs 3,00,000 in Policy 2025. Appears to be an intentional revision or departmental discrepancy.",
            "statementAText": "Total gross family income must be below Rs 2,50,000 per annum from all sources.",
            "statementBText": "Total parental/family income must be below Rs 3,00,000 per annum to qualify for category aid.",
            "documentAName": "Government Order 2024 - Higher Education",
            "documentBName": "Government Policy 2025 - National Grant",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": conflict_3_id,
            "statementAId": stmt_2_id,
            "statementBId": stmt_5_id,
            "conflictType": "CONDITIONAL_DIFFERENCE",
            "confidence": 0.84,
            "severity": "MEDIUM",
            "topic": "Age Exemption Criteria",
            "reason": "Policy 2025 sets strict threshold of 21 years, while Circular 2025 introduces a conditional exemption allowing ages 18-20 for approved institutions.",
            "statementAText": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "statementBText": "Students aged 18-20 may apply if studying in an approved government-affiliated college.",
            "documentAName": "Government Policy 2025 - National Grant",
            "documentBName": "Government Circular 2025 - Age Clarification",
            "createdAt": now_iso,
            "isDemo": True
        }
    ]

    # Evidence
    evidences = [
        {
            "_id": "66f40004a1b2c3d4e5f60001",
            "conflictId": conflict_1_id,
            "documentId": doc_1_id,
            "pageNumber": 3,
            "section": "Clause 4.1: General Eligibility",
            "sourceText": "Students must be 18 years or older at the commencement of the academic session.",
            "relatedStatement": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "documentName": "Government Order 2024 - Higher Education",
            "explanation": "Official gazette order defines legal age of qualification as 18 years.",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": "66f40004a1b2c3d4e5f60002",
            "conflictId": conflict_1_id,
            "documentId": doc_2_id,
            "pageNumber": 7,
            "section": "Section 3.2: Age Thresholds",
            "sourceText": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "relatedStatement": "Students must be 18 years or older at the commencement of the academic session.",
            "documentName": "Government Policy 2025 - National Grant",
            "explanation": "Central policy guideline raised age requirement to 21 years without repealing GO 2024 Clause 4.1.",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": "66f40004a1b2c3d4e5f60003",
            "conflictId": conflict_2_id,
            "documentId": doc_1_id,
            "pageNumber": 4,
            "section": "Clause 5.2: Means Test",
            "sourceText": "Total gross family income must be below Rs 2,50,000 per annum from all sources.",
            "relatedStatement": "Total parental/family income must be below Rs 3,00,000 per annum to qualify for category aid.",
            "documentName": "Government Order 2024 - Higher Education",
            "explanation": "State threshold benchmark for means-tested scholarship assistance.",
            "createdAt": now_iso,
            "isDemo": True
        },
        {
            "_id": "66f40004a1b2c3d4e5f60004",
            "conflictId": conflict_3_id,
            "documentId": doc_3_id,
            "pageNumber": 2,
            "section": "Paragraph 2: Special Exemptions",
            "sourceText": "Students aged 18-20 may apply if studying in an approved government-affiliated college.",
            "relatedStatement": "Students must be 21 years or older to qualify for the full tuition reimbursement grant.",
            "documentName": "Government Circular 2025 - Age Clarification",
            "explanation": "Clarification circular carving out an institutional exception for 18-20 year olds.",
            "createdAt": now_iso,
            "isDemo": True
        }
    ]

    # Analysis Record
    analysis = {
        "_id": "66f40005a1b2c3d4e5f60001",
        "title": "State vs Central Scholarship Policy Comparison",
        "documentIds": [doc_1_id, doc_2_id, doc_3_id],
        "status": "completed",
        "totalStatements": 5,
        "matchedStatements": 4,
        "conflictsFound": 2,
        "possibleConflicts": 1,
        "startedAt": now_iso,
        "completedAt": now_iso,
        "createdAt": now_iso,
        "isDemo": True
    }

    return documents, statements, conflicts, evidences, analysis


@router.post("/demo")
async def seed_demo_data():
    """Seeds the demonstration scholarship scenario into MongoDB / in-memory store."""
    docs, stmts, confs, evids, anal = get_demo_dataset()

    # Populate in-memory stores
    for d in docs:
        _in_memory_docs[d["_id"]] = d
    for s in stmts:
        _in_memory_statements[s["_id"]] = s
    for c in confs:
        _in_memory_conflicts[c["_id"]] = c
    for e in evids:
        _in_memory_evidence[e["_id"]] = e
    _in_memory_analyses[anal["_id"]] = anal

    # Insert into MongoDB if connected
    mongo_saved = False
    if db_manager.is_connected and db_manager.db is not None:
        try:
            # Delete previous demo data
            db_manager.documents_collection.delete_many({"isDemo": True})
            db_manager.statements_collection.delete_many({"isDemo": True})
            db_manager.conflicts_collection.delete_many({"isDemo": True})
            db_manager.evidence_collection.delete_many({"isDemo": True})
            db_manager.analyses_collection.delete_many({"isDemo": True})

            # Insert demo docs
            db_manager.documents_collection.insert_many(docs)
            db_manager.statements_collection.insert_many(stmts)
            db_manager.conflicts_collection.insert_many(confs)
            db_manager.evidence_collection.insert_many(evids)
            db_manager.analyses_collection.insert_one(anal)
            mongo_saved = True
        except Exception as err:
            mongo_saved = False

    return {
        "message": "Demo data seeded successfully",
        "documentsCount": len(docs),
        "statementsCount": len(stmts),
        "conflictsCount": len(confs),
        "evidenceCount": len(evids),
        "mongoSaved": mongo_saved,
        "tag": "DEMO DATA"
    }


@router.post("/clear")
async def clear_demo_data():
    """Clears all demo data from MongoDB and memory."""
    # Remove from memory
    to_delete = [k for k, v in _in_memory_docs.items() if v.get("isDemo")]
    for k in to_delete:
        _in_memory_docs.pop(k, None)

    _in_memory_statements.clear()
    _in_memory_conflicts.clear()
    _in_memory_evidence.clear()
    _in_memory_analyses.clear()

    if db_manager.is_connected and db_manager.db is not None:
        try:
            db_manager.documents_collection.delete_many({"isDemo": True})
            db_manager.statements_collection.delete_many({"isDemo": True})
            db_manager.conflicts_collection.delete_many({"isDemo": True})
            db_manager.evidence_collection.delete_many({"isDemo": True})
            db_manager.analyses_collection.delete_many({"isDemo": True})
        except Exception:
            pass

    return {"message": "Demo data cleared"}


@router.get("/status")
async def get_seed_status():
    """Returns the current counts of documents, conflicts, etc."""
    if db_manager.is_connected and db_manager.db is not None:
        try:
            return {
                "documents": db_manager.documents_collection.count_documents({}),
                "statements": db_manager.statements_collection.count_documents({}),
                "conflicts": db_manager.conflicts_collection.count_documents({}),
                "evidence": db_manager.evidence_collection.count_documents({}),
                "analyses": db_manager.analyses_collection.count_documents({})
            }
        except Exception:
            pass

    docs = [d for d in _in_memory_docs.values()]
    confs = [c for c in _in_memory_conflicts.values()]
    stmts = [s for s in _in_memory_statements.values()]

    return {
        "documents": len(docs),
        "statements": len(stmts),
        "conflicts": len(confs),
        "evidence": len(_in_memory_evidence),
        "analyses": len(_in_memory_analyses)
    }
