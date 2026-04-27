const Components = {

    renderPatientCards(patients, currentId) {

        return `
            <div class="patient-cards">
                ${patients.map(p => `
                    <div class="patient-card ${p.id === currentId ? "active" : ""}"
                         onclick="selectPatient('${p.id}')">

                        <div class="patient-name">${p.name}</div>
                        <div class="patient-meta">${p.age} yrs • ${p.sex}</div>

                    </div>
                `).join('')}
            </div>
        `;
    },

    renderLabTable(results) {

        if (!results.length) return `<div>No results available</div>`;

        return `
            <table class="lab-table">
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Value</th>
                        <th>Range</th>
                        <th>Severity</th>
                    </tr>
                </thead>

                <tbody>
                    ${results.map(r => `
                        <tr>
                            <td>${r.test}</td>
                            <td>${r.value} ${r.unit}</td>
                            <td>${r.lowRef} - ${r.highRef}</td>
                            <td class="severity ${(r.severity || "normal").toLowerCase()}">
                                ${r.severity || "Normal"}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
};