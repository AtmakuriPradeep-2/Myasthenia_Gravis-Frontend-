import dayjs from "dayjs";
import type { Prediction } from "../types/prediction";
import type { Patient } from "../types/patient";

/**
 * Exports all predictions to a structured CSV file download.
 */
export function exportPredictionsToCSV(predictions: Prediction[], patients: Patient[]) {
  const patientMap = new Map<number, Patient>();
  patients.forEach((p) => patientMap.set(p.id, p));

  const headers = [
    "Inference ID",
    "Date & Time",
    "Patient Code",
    "Patient Age",
    "Patient Sex",
    "MGFA Class",
    "Risk Level",
    "Exacerbation Probability (%)",
    "Worsening Predicted",
    "ML Model",
    "Model Version",
  ];

  const rows = predictions.map((pred) => {
    const patient = patientMap.get(pred.patient_id);
    const probPct = ((pred.probability ?? 0) * 100).toFixed(2);
    const dateFormatted = dayjs(pred.created_at).format("YYYY-MM-DD HH:mm:ss");

    return [
      `PRED-${pred.id}`,
      `"${dateFormatted}"`,
      `"${patient?.patient_code || `Patient #${pred.patient_id}`}"`,
      patient?.age ?? "N/A",
      `"${patient?.sex ?? "N/A"}"`,
      `"${patient?.mgfa_class ?? "N/A"}"`,
      `"${(pred.risk_category || "Low").toUpperCase()}"`,
      probPct,
      pred.predicted_event ? "Yes" : "No",
      `"${pred.model_name || "Gradient Boosting"}"`,
      `"${pred.model_version || "development_v0.1"}"`,
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MG_AI_Predictions_Export_${dayjs().format("YYYYMMDD_HHmmss")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and triggers download of a single Prediction Report (JSON telemetry).
 */
export function exportPredictionJSON(pred: any, patient?: Patient) {
  const reportData = {
    export_timestamp: new Date().toISOString(),
    prediction_details: pred,
    patient_demographics: patient
      ? {
          id: patient.id,
          code: patient.patient_code,
          age: patient.age,
          sex: patient.sex,
          mgfa_class: patient.mgfa_class,
        }
      : null,
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `MG_AI_Report_${patient?.patient_code || `Pred_${pred.id || "latest"}`}_${dayjs().format("YYYYMMDD_HHmm")}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a clean, beautifully formatted Clinical ML Risk Assessment Report in a printable print window or HTML file download.
 */
export function exportPredictionPrintableReport(pred: any, patient?: Patient) {
  const code = pred.patient_code || patient?.patient_code || `Patient #${pred.patient_id}`;
  const prob = pred.risk_probability !== undefined ? pred.risk_probability : (pred.probability ?? 0);
  const probPct = (prob * 100).toFixed(1);
  const category = (pred.risk_category || (prob >= 0.20 ? "HIGH" : prob >= 0.10 ? "MODERATE" : "LOW")).toUpperCase();
  const timestamp = pred.created_at ? dayjs(pred.created_at).format("MMMM D, YYYY · HH:mm:ss") : dayjs().format("MMMM D, YYYY · HH:mm:ss");

  const riskColor = category === "HIGH" ? "#EF4444" : category === "MODERATE" ? "#D97706" : "#10B981";
  const riskBg = category === "HIGH" ? "#FEF2F2" : category === "MODERATE" ? "#FFFBEB" : "#ECFDF5";

  const topFeaturesHTML = pred.top_features && pred.top_features.length > 0
    ? pred.top_features.map((f: any) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px 12px; font-weight: 600; color: #1E293B;">${f.feature}</td>
          <td style="padding: 10px 12px; font-weight: 600; color: #475569;">${f.value}</td>
          <td style="padding: 10px 12px; font-weight: 700; color: ${f.impact === "Increase Risk" ? "#EF4444" : "#10B981"}; text-align: right;">
            ${f.impact === "Increase Risk" ? "+" : ""}${(f.shap_value * 100).toFixed(1)}% (${f.impact})
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="3" style="padding: 12px; color: #64748B; font-style: italic;">Standard model features evaluated.</td></tr>`;

  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MG AI Clinical Risk Report — ${code}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #F8FAFC; color: #0F172A; margin: 0; padding: 40px; }
        .card { max-width: 760px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F1F5F9; padding-bottom: 24px; margin-bottom: 28px; }
        .logo { font-size: 22px; font-weight: 800; color: #2563EB; }
        .badge { padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 13px; text-transform: uppercase; background: ${riskBg}; color: ${riskColor}; border: 1px solid ${riskColor}44; }
        .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px; }
        .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; }
        .meta-label { font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.05em; }
        .meta-val { font-size: 16px; font-weight: 700; color: #0F172A; margin-top: 4px; }
        .gauge-container { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 28px; }
        .score-val { font-size: 48px; font-weight: 900; color: ${riskColor}; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { text-align: left; padding: 10px 12px; background: #F1F5F9; color: #475569; font-size: 11px; text-transform: uppercase; font-weight: 700; }
        .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; display: flex; justify-content: space-between; }
        @media print { body { background: none; padding: 0; } .card { border: none; boxShadow: none; } }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="logo">🏥 MG AI Remote Monitoring Platform</div>
            <div style="font-size: 13px; color: #64748B; margin-top: 4px;">Clinical Exacerbation Intelligence & Risk Report</div>
          </div>
          <div class="badge">${category} RISK</div>
        </div>

        <div class="meta-grid">
          <div class="meta-box">
            <div class="meta-label">Patient Code</div>
            <div class="meta-val">${code}</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
              ${patient ? `Age: ${patient.age} | Sex: ${patient.sex} | MGFA Class ${patient.mgfa_class}` : "Patient Demographics On File"}
            </div>
          </div>
          <div class="meta-box">
            <div class="meta-label">Inference Execution Timestamp</div>
            <div class="meta-val" style="font-size: 14px;">${timestamp}</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Model: Calibrated Gradient Boosting v0.1</div>
          </div>
        </div>

        <div class="gauge-container">
          <div class="meta-label">Predicted Exacerbation Risk Probability</div>
          <div class="score-val">${probPct}%</div>
          <div style="font-size: 13px; font-weight: 600; color: #475569;">
            ${category === "HIGH" ? "⚠️ High Risk Threshold Exceeded (≥20%). Immediate clinical review recommended." : "✅ Risk score within normal baseline monitoring limits."}
          </div>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #334155; margin-bottom: 8px;">
          SHAP Explainable AI — Key Risk Drivers
        </h3>
        <table>
          <thead>
            <tr>
              <th>Clinical Feature</th>
              <th>Observed Score</th>
              <th style="text-align: right;">Model Risk Influence</th>
            </tr>
          </thead>
          <tbody>
            ${topFeaturesHTML}
          </tbody>
        </table>

        <div class="footer">
          <div>Report generated automatically by MG AI Machine Learning Engine</div>
          <div>Confidential Medical Record</div>
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  }
}
