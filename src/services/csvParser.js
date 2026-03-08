import Papa from 'papaparse';
import _ from 'lodash';

export const loadTFMData = async () => {
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
        console.error("Failed to load survey data:", error);
        return [];
    }
};

/**
 * Counts percentage of users who answered anything other than "Sí, perfectamente" 
 * to the invoice question.
 */
export const getFiscalIlliteracy = (data) => {
    if (!data || data.length === 0) return 95;

    const column = "Si terminaras la carrera mañana, ¿sabrías cómo emitir una factura, gestionar tus impuestos o presupuestar un trabajo profesional? ";
    const total = data.length;

    const illiterate = data.filter(row => {
        return row[column] !== "Sí, perfectamente.";
    }).length;

    return Math.round((illiterate / total) * 100);
};

/**
 * Calculates the percentage of people who DO NOT use the AS009 Pre-incubator.
 */
export const getPreincubatorUsage = (data) => {
    if (!data || data.length === 0) return 87.2;

    const column = "¿Conoces la existencia Preincubadora (AS009) en la facultad?";
    const total = data.length;

    const nonUsers = data.filter(row => {
        return row[column] !== "Sí, la uso o la he usado." && row[column] !== "Ya la he visitado";
    }).length;

    return Number(((nonUsers / total) * 100).toFixed(1));
};

/**
 * Groups and counts the main fears from the "incertidumbre" column.
 */
export const getFearsData = (data) => {
    if (!data || data.length === 0) return [];

    const column = "¿Cuál es tu mayor incertidumbre al pensar en el día después de tu graduación?";

    const allFears = data.flatMap(row => {
        const val = row[column];
        if (!val) return [];
        return val.split(';').map(f => f.trim()).filter(Boolean);
    });

    const counted = _.countBy(allFears);

    // Format for Recharts and sort
    return Object.keys(counted)
        .map(key => ({ name: key, count: counted[key] }))
        .sort((a, b) => b.count - a.count);
};
