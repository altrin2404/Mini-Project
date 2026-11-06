import io
import re
import pandas as pd
from typing import Dict, Any, List, Tuple

# Target standard canonical fields expected by the Digital Twin
CANONICAL_FIELDS = {
    "student_id": {
        "required": True,
        "description": "Student Unique ID or Registration / Roll Number",
        "patterns": [
            r"^(reg|register|registration|roll|student_id|stud_id|id|admission|admn|enrollment|usn)[\s_\-\.\#]*([a-z0-9]*)?$",
            r".*(reg|register|roll|student|stud)[\s_\-\.]*(no|num|number|id).*",
            r".*(register|roll|student_id|stud_id).*"
        ]
    },
    "student_name": {
        "required": False,
        "description": "Student Full Name",
        "patterns": [
            r"^(name|student_name|stud_name|full_name|candidate_name|candidate_full_name)$",
            r".*(student|candidate|full)[\s_\-\.]*name.*",
            r".*name.*"
        ]
    },
    "attendance_percentage": {
        "required": True,
        "description": "Cumulative Attendance Percentage (0-100)",
        "patterns": [
            r"^(att|attendance|attend|present|presence|attnd)[\s_\-\.\%]*([a-z0-9]*)?$",
            r".*(attendance|present|presence)[\s_\-\.]*(\%|pct|percentage)?.*"
        ]
    },
    "iat1_score": {
        "required": True,
        "description": "Internal Assessment Test 1 (0-100)",
        "patterns": [
            r"^(iat1|iat_1|internal1|internal_1|cia1|cia_1|test1|test_1|midterm1|mid1)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(iat|internal|cia|test|exam)[\s_\-\.]*(1|i|one).*"
        ]
    },
    "iat2_score": {
        "required": False,
        "description": "Internal Assessment Test 2 (0-100)",
        "patterns": [
            r"^(iat2|iat_2|internal2|internal_2|cia2|cia_2|test2|test_2|midterm2|mid2)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(iat|internal|cia|test|exam)[\s_\-\.]*(2|ii|two).*"
        ]
    },
    "assignment_avg": {
        "required": False,
        "description": "Assignment / Homework Average Marks",
        "patterns": [
            r"^(assignment|assign|homework|hw|tutorial|quiz|assess)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(assignment|homework|tutorial)[\s_\-\.]*(avg|score|marks)?.*"
        ]
    },
    "lab_performance": {
        "required": False,
        "description": "Laboratory Practical Score",
        "patterns": [
            r"^(lab|practical|lab_score|lab_marks|experiment)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(lab|practical)[\s_\-\.]*(score|marks)?.*"
        ]
    },
    "behavior_score": {
        "required": False,
        "description": "Discipline / Conduct Score (0-100)",
        "patterns": [
            r"^(behavior|conduct|discipline|behavior_score|conduct_score)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(behavior|conduct|discipline).*"
        ]
    },
    "prev_sem_gpa": {
        "required": False,
        "description": "Previous Single Semester GPA (SGPA, 0-10.0)",
        "patterns": [
            r"^(sgpa|sem_gpa|semester_gpa|prev_gpa|previous_gpa|last_sem_gpa)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(sgpa|sem[\s_\-\.]*gpa|previous[\s_\-\.]*sem).*"
        ]
    },
    "past_cgpa": {
        "required": False,
        "description": "Historical Cumulative CGPA (Overall, 0-10.0)",
        "patterns": [
            r"^(cgpa|past_cgpa|cumulative_gpa|overall_gpa|total_gpa|overall_cgpa)[\s_\-\.]*([a-z0-9]*)?$",
            r".*(cgpa|cumulative|overall[\s_\-\.]*gpa).*"
        ]
    }
}

class DynamicDataParser:
    """
    Intelligent Schema-Agnostic Parser for student records.
    Supports CSV, Excel (XLSX, XLS), TSV.
    Performs fuzzy regex matching across arbitrary user headers.
    """

    @staticmethod
    def load_dataframe_from_bytes(file_bytes: bytes, filename: str) -> pd.DataFrame:
        fn_lower = filename.lower()
        if fn_lower.endswith(".csv"):
            return pd.read_csv(io.BytesIO(file_bytes))
        elif fn_lower.endswith((".xlsx", ".xls")):
            return pd.read_excel(io.BytesIO(file_bytes))
        elif fn_lower.endswith(".tsv"):
            return pd.read_csv(io.BytesIO(file_bytes), sep="\t")
        else:
            # Fallback attempt CSV
            return pd.read_csv(io.BytesIO(file_bytes))

    @staticmethod
    def infer_column_mappings(df_columns: List[str]) -> Tuple[Dict[str, str], List[Dict[str, Any]]]:
        """
        Maps raw DataFrame column names to canonical target fields.
        Returns:
            mappings: { canonical_field_name: raw_column_name }
            column_details: list of identified candidate details with confidence
        """
        mappings = {}
        column_details = []
        assigned_raw = set()

        for canonical_key, meta in CANONICAL_FIELDS.items():
            best_match = None
            best_confidence = 0.0

            for col in df_columns:
                if col in assigned_raw:
                    continue
                col_clean = str(col).strip().lower()

                # Exact canonical name match
                if col_clean == canonical_key:
                    best_match = col
                    best_confidence = 1.0
                    break

                # Match patterns
                for pattern in meta["patterns"]:
                    if re.match(pattern, col_clean):
                        best_match = col
                        best_confidence = 0.95
                        break
                    elif re.search(pattern, col_clean):
                        if best_confidence < 0.8:
                            best_match = col
                            best_confidence = 0.8

            if best_match:
                mappings[canonical_key] = best_match
                assigned_raw.add(best_match)
                column_details.append({
                    "canonical_field": canonical_key,
                    "matched_raw_header": best_match,
                    "confidence": best_confidence,
                    "required": meta["required"],
                    "description": meta["description"]
                })
            else:
                column_details.append({
                    "canonical_field": canonical_key,
                    "matched_raw_header": None,
                    "confidence": 0.0,
                    "required": meta["required"],
                    "description": meta["description"]
                })

        return mappings, column_details

    @staticmethod
    def parse_and_preview(file_bytes: bytes, filename: str, preview_rows: int = 5) -> Dict[str, Any]:
        df = DynamicDataParser.load_dataframe_from_bytes(file_bytes, filename)
        raw_columns = [str(c) for c in df.columns]
        mappings, column_details = DynamicDataParser.infer_column_mappings(raw_columns)

        # Validate required fields
        missing_required = []
        for det in column_details:
            if det["required"] and not det["matched_raw_header"]:
                missing_required.append(det["canonical_field"])

        preview_records = df.head(preview_rows).fillna("").to_dict(orient="records")

        return {
            "filename": filename,
            "total_rows": int(len(df)),
            "detected_raw_columns": raw_columns,
            "inferred_mappings": mappings,
            "column_details": column_details,
            "missing_required": missing_required,
            "is_valid": len(missing_required) == 0,
            "preview_data": preview_records
        }

    @staticmethod
    def extract_standardized_records(
        file_bytes: bytes,
        filename: str,
        confirmed_mappings: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        """
        Extracts and converts arbitrary input dataset rows into standardized student dictionaries.
        """
        df = DynamicDataParser.load_dataframe_from_bytes(file_bytes, filename)
        standardized = []

        for _, row in df.iterrows():
            item = {}
            for canonical, raw_col in confirmed_mappings.items():
                if raw_col and raw_col in df.columns:
                    val = row[raw_col]
                    # Handle NaN
                    if pd.isna(val):
                        val = None
                    else:
                        # Clean numeric fields
                        if canonical in ["attendance_percentage", "iat1_score", "iat2_score", "assignment_avg", "lab_performance", "behavior_score", "past_gpa"]:
                            try:
                                # Strip % signs or spaces
                                val = float(str(val).replace("%", "").strip())
                            except Exception:
                                val = 0.0
                        else:
                            val = str(val).strip()
                    item[canonical] = val

            # Set reasonable fallbacks for missing optional fields
            if "iat2_score" not in item or item["iat2_score"] is None:
                item["iat2_score"] = item.get("iat1_score", 50.0)
            if "assignment_avg" not in item or item["assignment_avg"] is None:
                item["assignment_avg"] = 70.0
            if "lab_performance" not in item or item["lab_performance"] is None:
                item["lab_performance"] = 70.0
            if "behavior_score" not in item or item["behavior_score"] is None:
                item["behavior_score"] = 85.0
            if "past_gpa" not in item or item["past_gpa"] is None:
                item["past_gpa"] = 7.0

            if item.get("student_id"):
                standardized.append(item)

        return standardized
