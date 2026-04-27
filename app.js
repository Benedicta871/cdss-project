let dataService;
let clinicalEngine;

const AppState = {
    patients: [],
    currentPatientId: null,
    currentRole: "lab",
    auditEntries: []
};

// =========================
// ACTIVITY SYSTEM
// =========================
function addActivity(message) {

    const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    AppState.auditEntries = [
        ...(AppState.auditEntries || []),
        `[${time}] ${message}`
    ].slice(-10);
}

// =========================
// MAIN RENDER PIPELINE
// =========================
function triggerRender() {

    if (!AppState.patients || AppState.patients.length === 0) return;

    const patient = AppState.patients.find(
        p => p.id === AppState.currentPatientId
    );

    if (!patient) {
        console.warn("No matching patient for ID:", AppState.currentPatientId);
        return;
    }

    let interpretation = null;

    try {
        interpretation = clinicalEngine.evaluatePatient(patient);
    } catch (err) {
        console.error("Clinical engine error:", err);
    }

    // SINGLE UI CONTROL POINT
    if (UIRenderer && typeof UIRenderer.render === "function") {
        UIRenderer.render(AppState, interpretation);
    } else {
        console.error("UIRenderer missing or not loaded");
    }
}

// =========================
// INITIALIZE APP
// =========================
async function initApp() {

    try {

        dataService = new DataService();
        clinicalEngine = new ClinicalEngine();

        const data = await dataService.loadPatients();

        AppState.patients = data?.patients || [];

        console.log("Patients loaded:", AppState.patients);

        if (AppState.patients.length === 0) {
            console.error("No patients found");
            return;
        }

        // DEFAULT FIRST PATIENT
        AppState.currentPatientId = AppState.patients[0].id;

        addActivity("System initialized");

        triggerRender();

    } catch (err) {
        console.error("App failed to initialize:", err);
    }
}

// =========================
// FIX 2 — PATIENT SWITCH BUG (FULL FIXED VERSION)
// =========================
function selectPatient(id) {

    console.log("Clicked patient ID:", id);

    const patient = AppState.patients.find(p => p.id === id);

    if (!patient) {
        console.warn("Patient not found:", id);
        return;
    }

    AppState.currentPatientId = id;

    addActivity(`Viewed patient: ${patient.name}`);

    triggerRender();
}

// =========================
// ROLE SWITCH (LAB / DOCTOR)
// =========================
function setRole(role) {

    if (!role) return;

    AppState.currentRole = role;

    addActivity(`Switched to ${role} view`);

    triggerRender();
}

// =========================
// START APP
// =========================
document.addEventListener("DOMContentLoaded", initApp);