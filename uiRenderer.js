const UIRenderer = {

    render(state, interpretation) {

        // =========================
        // PATIENT LIST
        // =========================
        const list = document.getElementById("patientList");

        if (list) {
            list.innerHTML = state.patients.map(p => `
                <div 
                    onclick="selectPatient('${p.id}')"
                    style="
                        padding:10px;
                        margin-bottom:8px;
                        cursor:pointer;
                        border-radius:8px;
                        transition:0.2s;
                        background:${p.id === state.currentPatientId ? '#e0f2fe' : '#fff'};
                        border:1px solid #eee;
                    "
                >
                    <b>${p.name}</b><br/>
                    <small>${p.age} yrs • ${p.sex}</small>
                </div>
            `).join("");
        }

        // =========================
        // ROLE SWITCH UI
        // =========================
        const role = document.getElementById("roleBanner");

        if (role) {
            role.innerHTML = `
                <div style="display:flex; gap:10px; align-items:center;">
                    <span>Current View:</span>

                    <button onclick="setRole('lab')"
                        style="
                            padding:6px 10px;
                            border-radius:6px;
                            border:1px solid #ccc;
                            cursor:pointer;
                            background:${state.currentRole === 'lab' ? '#dbeafe' : '#fff'};
                        ">
                        Lab View
                    </button>

                    <button onclick="setRole('doctor')"
                        style="
                            padding:6px 10px;
                            border-radius:6px;
                            border:1px solid #ccc;
                            cursor:pointer;
                            background:${state.currentRole === 'doctor' ? '#dbeafe' : '#fff'};
                        ">
                        Doctor View
                    </button>
                </div>
            `;
        }

        // =========================
        // MAIN PANEL
        // =========================
        const results = document.getElementById("resultsCard");

        const patient = state.patients.find(
            p => p.id === state.currentPatientId
        );

        if (results && interpretation && patient) {

            // =========================
            // LAB VIEW
            // =========================
            if (state.currentRole === "lab") {

                results.innerHTML = `
                    <h2>${patient.name}</h2>

                    <h3>Lab Results</h3>

                    ${interpretation.evaluatedResults.map(r => `
                        <div style="margin-bottom:8px;">
                            <b>${r.test}</b>:
                            ${r.value} ${r.unit}

                            <span style="
                                padding:2px 8px;
                                border-radius:999px;
                                font-size:11px;
                                margin-left:6px;
                                color:white;
                                background:${this.getBadgeColor(r.severity)};
                            ">
                                ${r.severity.toUpperCase()}
                            </span>
                        </div>
                    `).join("")}
                `;
            }

            // =========================
            // DOCTOR VIEW (POLISHED)
            // =========================
            else {

                results.innerHTML = `
                    <h2>${patient.name}</h2>

                    <h3>
                        <span style="
                            display:inline-block;
                            padding:4px 10px;
                            border-radius:999px;
                            background:#f3f4f6;
                        ">
                            Clinical Summary
                        </span>
                    </h3>

                    <div style="margin-bottom:10px;">
                        <b>Risk Level:</b> ${interpretation.summary.riskLevel}
                    </div>

                    <div style="margin-bottom:10px;">
                        <b>Decision:</b> ${interpretation.clinicalSummary.decision}
                    </div>

                    <h3>Top Risks</h3>

                    ${
                        interpretation.clinicalSummary.topRisks.length
                        ? interpretation.clinicalSummary.topRisks.map(r => `
                            <div style="margin-bottom:6px;">
                                ⚠ ${r.test} - ${r.explanation}
                            </div>
                        `).join("")
                        : "No major risks detected"
                    }
                `;
            }
        }

        // =========================
        // INSIGHTS PANEL
        // =========================
        const insights = document.getElementById("insightsCard");

        if (insights) {
            insights.innerHTML = `
                <h3>Clinical Insights</h3>

                ${
                    interpretation.clinicalSummary.topRisks.length
                    ? interpretation.clinicalSummary.topRisks.map(r => `
                        <div>⚠ ${r.test}: ${r.explanation}</div>
                    `).join("")
                    : "No clinical alerts detected"
                }
            `;
        }

        // =========================
        // ACTIVITY FEED
        // =========================
        const audit = document.getElementById("auditTrail");

        if (audit) {
            audit.innerHTML = state.auditEntries
                .map(a => `<div style="font-size:12px;">${a}</div>`)
                .join("");
        }
    },

    // =========================
    // COLOR HELPERS
    // =========================
    getColor(severity) {
        switch (severity) {
            case "critical": return "#dc2626";
            case "high": return "#ea580c";
            case "moderate": return "#d97706";
            default: return "#16a34a";
        }
    },

    getBadgeColor(severity) {
        switch (severity) {
            case "critical": return "#dc2626";
            case "high": return "#ea580c";
            case "moderate": return "#d97706";
            default: return "#16a34a";
        }
    }
};