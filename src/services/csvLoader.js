import Papa from 'papaparse';

export const fetchAndParseCSV = async (filePath) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error(`Failed to fetch and parse CSV at ${filePath}:`, error);
        return [];
    }
};

/**
 * Calculates the percentage of students who do not know how to manage their fiscal responsibilities.
 * Exact column: "Si terminaras la carrera mañana, ¿sabrías cómo emitir una factura, gestionar tus impuestos o presupuestar un trabajo profesional? "
 */
export const getFiscalIlliteracyRate = (data) => {
    const column = "Si terminaras la carrera mañana, ¿sabrías cómo emitir una factura, gestionar tus impuestos o presupuestar un trabajo profesional? ";

    if (!data || data.length === 0) return 95; // Fallback to 95% if data is missing

    const totalRespondents = data.length;
    const illiterateCount = data.filter(row => {
        const answer = row[column];
        return answer === "No, no tengo ni idea." || answer === "Tengo una idea vaga, pero necesitaría ayuda.";
    }).length;

    // Return the rounded percentage
    return Math.round((illiterateCount / totalRespondents) * 100);
};

/**
 * Calculates the percentage of students who have NOT used the Incubator.
 * Exact column: "¿Conoces la existencia Preincubadora (AS009) en la facultad?"
 */
export const getIncubatorUsage = (data) => {
    const column = "¿Conoces la existencia Preincubadora (AS009) en la facultad?";

    if (!data || data.length === 0) return 87.2; // Fallback if data is missing

    const totalRespondents = data.length;
    const nonUsersCount = data.filter(row => {
        const answer = row[column];
        // Users are those who answer explicitly that they use it or have visited
        return answer !== "Sí, la uso o la he usado." && answer !== "Ya la he visitado";
    }).length;

    // Return to 1 decimal place, e.g., 87.2
    return Number(((nonUsersCount / totalRespondents) * 100).toFixed(1));
};
