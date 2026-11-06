import api from "./axios";

export const mlApi = {
  // Random Forest Risk classification with dynamic XAI
  predictRisk: async (features) => {
    const res = await api.post("/api/ml/predict-risk", features);
    return res.data;
  },

  // Ridge Regression Continuous Projected CGPA
  predictCgpa: async (features) => {
    const res = await api.post("/api/ml/predict-cgpa", features);
    return res.data;
  },

  // Interactive What-If Simulation Sandbox
  simulateWhatIf: async (baseline, adjustments) => {
    const res = await api.post("/api/ml/what-if-simulate", { baseline, adjustments });
    return res.data;
  },

  // Comparative ML model benchmarks (Ridge vs RF vs Baselines)
  getModelMetrics: async () => {
    const res = await api.get("/api/ml/model-metrics");
    return res.data;
  },

  // Dynamic schema-agnostic file preview & auto-mapping
  previewUploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/upload/preview", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Commit batch student ingestion with confirmed mappings
  commitBatchUpload: async (file, mappings) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mappings_json", JSON.stringify(mappings));
    const res = await api.post("/api/upload/commit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
