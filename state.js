// Centralized State Management
// Single source of truth for entire CDSS app

const AppState = {
    currentPatientId: null,
    currentRole: 'lab',

    patients: [],
    clinicalRules: null,

    systemVersion: '2.0.0',
    dataSource: 'patients.json',
    lastDataLoad: null,

    auditEntries: [],

    isLoading: false,
    error: null,

    currentPatient: null,
    currentInterpretation: null,
    severitySummary: null,
    actionPlan: null
};

// State listeners
let stateChangeCallbacks = [];

function setState(updates) {
    Object.assign(AppState, updates);
    stateChangeCallbacks.forEach(cb => cb(AppState));
}

function subscribeToState(callback) {
    stateChangeCallbacks.push(callback);
    return () => {
        stateChangeCallbacks = stateChangeCallbacks.filter(cb => cb !== callback);
    };
}

// Audit logging helper
function addAuditEntry(action, details) {
    const entry = {
        timestamp: new Date().toISOString(),
        action,
        details,
        role: AppState.currentRole,
        patientId: AppState.currentPatientId
    };

    AppState.auditEntries.unshift(entry);

    if (AppState.auditEntries.length > 50) {
        AppState.auditEntries.pop();
    }
}