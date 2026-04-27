class ClinicalEngine {

    evaluateResult(result) {
        let severity = 'normal';
        let explanation = result.interpretation || 'Normal range';

        const value = result.value;

        // Glucose
        if (result.test === 'Fasting Glucose') {
            if (value > 11.0) {
                severity = 'critical';
                explanation = 'Severe hyperglycemia risk';
            } else if (value > 7.0) {
                severity = 'high';
                explanation = 'Diabetes range glucose level';
            }
        }

        // Potassium
        if (result.test === 'Potassium') {
            if (value < 2.8 || value > 6.0) {
                severity = 'critical';
                explanation = 'Dangerous potassium imbalance';
            } else if (value < 3.5) {
                severity = 'moderate';
                explanation = 'Mild hypokalemia';
            }
        }

        // LDL
        if (result.test === 'LDL') {
            if (value > 4.9) {
                severity = 'critical';
                explanation = 'Severe LDL elevation';
            } else if (value > 3.4) {
                severity = 'high';
                explanation = 'Elevated LDL cholesterol';
            }
        }

        return {
            test: result.test,
            value: result.value,
            unit: result.unit,
            range: `${result.lowRef} - ${result.highRef}`,
            severity,
            explanation,
            recommendation:
                severity === 'critical'
                    ? 'URGENT CLINICAL REVIEW REQUIRED'
                    : severity === 'high'
                    ? 'Clinical follow-up recommended'
                    : severity === 'moderate'
                    ? 'Monitor and adjust lifestyle'
                    : 'No action required'
        };
    }

    evaluatePatient(patient) {

        const evaluated = patient.results.map(r => this.evaluateResult(r));

        const critical = evaluated.filter(r => r.severity === 'critical').length;
        const high = evaluated.filter(r => r.severity === 'high').length;
        const moderate = evaluated.filter(r => r.severity === 'moderate').length;

        let riskLevel = 'Low';

        if (critical > 0) riskLevel = 'Critical';
        else if (high > 2) riskLevel = 'High';
        else if (high > 0 || moderate > 2) riskLevel = 'Moderate';

        const topRisks = evaluated
            .filter(r => r.severity === 'critical' || r.severity === 'high')
            .slice(0, 3);

        let decision = 'LOW RISK: Routine care';

        if (critical > 0) {
            decision = 'URGENT: Immediate clinical review required';
        } else if (high > 2) {
            decision = 'HIGH RISK: Schedule medical evaluation';
        } else if (high > 0 || moderate > 2) {
            decision = 'MODERATE RISK: Monitor and follow-up';
        }

        // 🔥 FIX: INSIGHTS ADDED (THIS WAS YOUR BUG)
        const insights = evaluated.map(r => r.explanation);

        return {
            patientId: patient.id,
            patientName: patient.name,
            evaluatedResults: evaluated,

            // 🔥 NOW UI WILL STOP SHOWING "NO INSIGHTS"
            insights,

            summary: {
                critical,
                high,
                moderate,
                riskLevel
            },

            clinicalSummary: {
                topRisks,
                decision
            }
        };
    }
}