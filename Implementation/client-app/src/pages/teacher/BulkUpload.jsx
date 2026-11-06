import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, Database, RefreshCw } from "lucide-react";
import { mlApi } from "../../api/mlApi";
import "./bulkUpload.css";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [columnMappings, setColumnMappings] = useState({});
  const [commitResult, setCommitResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg("");
    setCommitResult(null);
    setLoadingPreview(true);

    try {
      const data = await mlApi.previewUploadFile(selectedFile);
      setPreviewData(data);
      setColumnMappings(data.inferred_mappings || {});
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to parse file preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleMappingChange = (canonicalField, rawCol) => {
    setColumnMappings((prev) => ({
      ...prev,
      [canonicalField]: rawCol === "" ? null : rawCol,
    }));
  };

  const handleCommit = async () => {
    if (!file) return;
    setCommitting(true);
    setErrorMsg("");

    try {
      const result = await mlApi.commitBatchUpload(file, columnMappings);
      setCommitResult(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Batch import failed.");
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="bulk-upload-container">
      <div className="bulk-header">
        <h2>
          <UploadCloud size={28} color="#2563eb" />
          Upload Student Marks & Attendance Sheet
        </h2>
        <p>
          Upload your Excel or CSV register. The system automatically reads any column names (like "Reg No", "Test 1", "Attendance") and matches them for you.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <a
            href="/student_data_template.xlsx"
            download="student_data_template.xlsx"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              padding: "7px 14px",
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              textDecoration: "none"
            }}
          >
            <FileSpreadsheet size={15} /> Download Sample Excel (.xlsx)
          </a>
          <a
            href="/student_data_template.csv"
            download="student_data_template.csv"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              padding: "7px 14px",
              background: "#f8fafc",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              textDecoration: "none"
            }}
          >
            Download Sample CSV (.csv)
          </a>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#b91c1c", borderRadius: 8, marginBottom: 16 }}>
          <AlertTriangle size={18} style={{ display: "inline", marginRight: 8 }} />
          {errorMsg}
        </div>
      )}

      {/* Upload Dropzone */}
      <label className="upload-dropzone">
        <input
          type="file"
          accept=".csv,.xlsx,.xls,.tsv"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <FileSpreadsheet className="dropzone-icon" />
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
          {file ? file.name : "Click or Drag & Drop Student File Here"}
        </h3>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
          Supports internal marks registers, LMS export sheets, or attendance rosters.
        </p>
        <span className="supported-badge">CSV, Excel (.xlsx/.xls), TSV</span>
      </label>

      {loadingPreview && (
        <div style={{ textAlign: "center", padding: 30, color: "#3b82f6" }}>
          <RefreshCw className="animate-spin" style={{ display: "inline", marginRight: 8 }} />
          Analyzing file structure and auto-detecting column mappings...
        </div>
      )}

      {/* Auto-Mapping & Preview Section */}
      {previewData && !loadingPreview && (
        <div className="mapping-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
                Auto-Detected Schema Mappings
              </h3>
              <p style={{ fontSize: 13, color: "#64748b" }}>
                Found {previewData.total_rows} student records. Verify or customize the detected fields.
              </p>
            </div>
            <span style={{ fontSize: 12, background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: 20 }}>
              Fuzzy Matcher Active
            </span>
          </div>

          <div className="mapping-grid">
            {previewData.column_details?.map((detail) => {
              const currentMapped = columnMappings[detail.canonical_field] || "";
              const isMatched = !!currentMapped;

              return (
                <div
                  key={detail.canonical_field}
                  className={`field-mapping-row ${isMatched ? "matched" : detail.required ? "unmatched" : ""}`}
                >
                  <div className="canonical-name">
                    <span>
                      {detail.canonical_field} {detail.required && <b style={{ color: "#ef4444" }}>*</b>}
                    </span>
                    {isMatched ? (
                      <span style={{ fontSize: 11, color: "#059669", display: "flex", alignItems: "center", gap: 3 }}>
                        <CheckCircle size={12} /> Auto-Mapped
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Optional</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{detail.description}</div>

                  <select
                    className="mapping-select"
                    value={currentMapped}
                    onChange={(e) => handleMappingChange(detail.canonical_field, e.target.value)}
                  >
                    <option value="">-- Do not map --</option>
                    {previewData.detected_raw_columns?.map((col) => (
                      <option key={col} value={col}>
                        Header: "{col}"
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* First 5 rows Preview */}
          <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 24, color: "#334155" }}>
            Data Sample Preview (First 5 Rows)
          </h4>
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  {previewData.detected_raw_columns?.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.preview_data?.map((row, idx) => (
                  <tr key={idx}>
                    {previewData.detected_raw_columns?.map((col) => (
                      <td key={col}>{row[col] !== undefined ? String(row[col]) : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Commit button */}
          <button className="btn-commit" onClick={handleCommit} disabled={committing}>
            {committing ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Ingesting & Running Ridge / RF Models...
              </>
            ) : (
              <>
                <Database size={18} /> Confirm Mappings & Batch Ingest Students
              </>
            )}
          </button>
        </div>
      )}

      {/* Success Summary */}
      {commitResult && (
        <div className="summary-card">
          <h3 style={{ color: "#166534", display: "flex", alignItems: "center", gap: 8, fontSize: 18 }}>
            <CheckCircle size={22} /> Batch Ingestion Complete!
          </h3>
          <p style={{ color: "#15803d", marginTop: 4 }}>
            Successfully processed {commitResult.processed_records} students from <b>{commitResult.filename}</b>.
            Student academic records and semester GPA projections have been successfully updated.
          </p>

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {commitResult.summary?.slice(0, 10).map((st) => (
              <div
                key={st.student_id}
                style={{
                  background: "#ffffff",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #bbf7d0",
                  fontSize: 12,
                }}
              >
                <b>{st.student_name}</b> ({st.student_id}):
                <span
                  style={{
                    marginLeft: 6,
                    fontWeight: 700,
                    color: st.predicted_risk === "High" ? "#dc2626" : st.predicted_risk === "Medium" ? "#d97706" : "#16a34a",
                  }}
                >
                  {st.predicted_risk} Risk
                </span>{" "}
                | CGPA: {st.projected_cgpa}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
