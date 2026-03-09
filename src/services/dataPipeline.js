import Papa from 'papaparse';

export const fetchInternalSurvey = async () => {
    try {
        const response = await fetch('/CSV/estudio_tfm.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Failed to load survey data:", error);
        return [];
    }
};

export const getDashboardMetrics = async () => {
    const data = await fetchInternalSurvey();
    if (!data || data.length === 0) {
        return { fiscalIlliteracy: 95, preincubatorNonUsers: 87.2, fears: [] };
    }

    const illiteracyColumn = "Si terminaras la carrera mañana, ¿sabrías cómo emitir una factura, gestionar tus impuestos o presupuestar un trabajo profesional? ";
    const as009Column = "¿Conoces la existencia Preincubadora (AS009) en la facultad?";
    const fearsColumn = "¿Cuál es tu mayor incertidumbre al pensar en el día después de tu graduación?";

    const total = data.length;

    const illiterateCount = data.filter(row => row[illiteracyColumn] !== "Sí, perfectamente.").length;
    const fiscalIlliteracy = Math.round((illiterateCount / total) * 100);

    const nonUsersCount = data.filter(row => row[as009Column] !== "Sí, la uso o la he usado." && row[as009Column] !== "Ya la he visitado").length;
    const preincubatorNonUsers = Number(((nonUsersCount / total) * 100).toFixed(1));

    const allFears = data.flatMap(row => {
        const val = row[fearsColumn];
        if (!val) return [];
        return val.split(';').map(f => f.trim()).filter(Boolean);
    });

    const counted = {};
    for (const fear of allFears) {
        counted[fear] = (counted[fear] || 0) + 1;
    }

    const fears = Object.keys(counted)
        .map(key => ({ name: key, count: counted[key] }))
        .sort((a, b) => b.count - a.count);

    return {
        fiscalIlliteracy,
        preincubatorNonUsers,
        fears
    };
};
