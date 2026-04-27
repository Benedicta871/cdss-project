// =========================
// DATA SERVICE (SIMULATED API)
// =========================
// Responsible for loading patient data safely and consistently

class DataService {

    constructor() {
        this.cache = null;
    }

    async loadPatients() {
        try {
            console.log("🔄 Loading patients...");

            const response = await fetch("data/patients.json");

            if (!response.ok) {
                throw new Error("Failed to load patients.json");
            }

            const data = await response.json();

            // 🔥 DEBUG: show exactly what file contains
            console.log("🔥 RAW DATA LOADED:", data);

            // Validate structure
            if (!data || !Array.isArray(data.patients)) {
                console.warn("⚠️ Invalid patient structure detected.");
                return { patients: [] };
            }

            console.log(`📊 Number of patients found: ${data.patients.length}`);

            // Normalize safely (prevents undefined issues later)
            const normalized = this.normalizePatients(data);

            this.cache = normalized;

            console.log("✅ NORMALIZED DATA READY:", normalized);

            return normalized;

        } catch (error) {
            console.error("❌ DataService error:", error);

            return this.getFallbackData();
        }
    }

    // =========================
    // NORMALIZATION (CRITICAL FIX)
    // Ensures consistent structure across all patients/results
    // =========================
    normalizePatients(data) {

        return {
            ...data,
            patients: data.patients.map(patient => ({
                ...patient,
                results: (patient.results || []).map(r => {

                    // Safe range handling (NO undefined EVER)
                    let range = "-";

                    if (typeof r.range === "string" && r.range.trim() && r.range !== "undefined") {
                        range = r.range;
                    }
                    else if (r.lowRef != null && r.highRef != null) {
                        range = `${r.lowRef} - ${r.highRef}`;
                    }

                    return {
                        ...r,
                        range
                    };
                })
            }))
        };
    }

    // =========================
    // FALLBACK DATA (SAFE MODE)
    // Only used if file fails to load
    // =========================
    getFallbackData() {

        console.warn("⚠️ Using fallback patient data");

        return {
            version: "1.0",
            patients: [
                {
                    id: "P001",
                    name: "John D.",
                    age: 58,
                    sex: "Male",
                    results: [
                        {
                            test: "Fasting Glucose",
                            value: 5.2,
                            unit: "mmol/L",
                            lowRef: 3.9,
                            highRef: 5.6,
                            range: "3.9 - 5.6"
                        },
                        {
                            test: "LDL",
                            value: 4.2,
                            unit: "mmol/L",
                            lowRef: 1.5,
                            highRef: 3.4,
                            range: "1.5 - 3.4"
                        },
                        {
                            test: "Potassium",
                            value: 3.2,
                            unit: "mmol/L",
                            lowRef: 3.5,
                            highRef: 5.0,
                            range: "3.5 - 5.0"
                        }
                    ]
                }
            ]
        };
    }

    // Optional cache access
    getCachedData() {
        return this.cache;
    }
}