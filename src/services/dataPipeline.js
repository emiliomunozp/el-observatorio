import axios from 'axios';
import { z } from 'zod';
import Papa from 'papaparse';

// ==========================================
// ZOD SCHEMAS
// ==========================================

const SurveyRecordSchema = z.object({
    id: z.string().or(z.number()).transform(v => String(v)).catch(() => "unknown"),
    Timestamp: z.string().catch(""),
    Estudios: z.string().catch("Desconocido"),
    Nivel_Analfabetismo_Fiscal: z.string().transform(v => parseFloat(v) || 0).catch(95),
});

const SurveyResponseSchema = z.array(SurveyRecordSchema);

const ProjectRecordSchema = z.object({
    id: z.string().or(z.number()).transform(v => String(v)).catch(() => "unknown"),
    projectName: z.string().catch("Proyecto sin nombre"),
    client: z.string().catch("Cliente no especificado"),
    designPhase: z.enum(["Ideation", "Prototyping", "Testing"]).catch("Ideation"),
    assignedTeam: z.string().catch("Sin asignar"),
});

const ProjectResponseSchema = z.array(ProjectRecordSchema);

// ==========================================
// HELPERS
// ==========================================

/**
 * Fetches and parses a public CSV from a Google Sheet URL.
 */
const fetchAndParseCSV = async (url) => {
    const response = await axios.get(url, { responseType: 'text' });

    return new Promise((resolve, reject) => {
        Papa.parse(response.data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
        });
    });
};

// ==========================================
// DATA FETCHING FUNCTIONS
// ==========================================

export const fetchSurveyData = async () => {
    try {
        // Replace this placeholder URL with your actual Google Sheets CSV export link via .env.local
        const CSV_URL = process.env.NEXT_PUBLIC_SURVEY_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv';

        // Fallback if no URL is provided locally for testing
        if (CSV_URL.includes("...")) {
            console.warn("Survey CSV URL not configured. Returning fallback data.");
            return {
                data: SurveyResponseSchema.parse([
                    { id: "1", Timestamp: "2023-10-01", Estudios: "Diseño Gráfico", Nivel_Analfabetismo_Fiscal: "98" }
                ]),
                error: null
            };
        }

        const rawData = await fetchAndParseCSV(CSV_URL);
        const validatedData = SurveyResponseSchema.parse(rawData);

        return { data: validatedData, error: null };
    } catch (error) {
        console.error("Error fetching or parsing survey data:", error);
        return { data: null, error: error.message || "Failed to fetch survey data" };
    }
};

export const fetchActiveProjects = async () => {
    try {
        // Replace this placeholder URL with your actual Google Sheets CSV export link via .env.local
        const CSV_URL = process.env.NEXT_PUBLIC_PROJECTS_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR.../pub?output=csv';

        // Fallback if no URL is provided locally for testing
        if (CSV_URL.includes("...")) {
            console.warn("Projects CSV URL not configured. Returning fallback data.");
            return {
                data: ProjectResponseSchema.parse([
                    { id: "P1", projectName: "Rebranding MUPAI", client: "MUPAI", designPhase: "Ideation", assignedTeam: "Equipo Alfa" },
                    { id: "P2", projectName: "App Observatorio", client: "UCM", designPhase: "Prototyping", assignedTeam: "Equipo Beta" },
                    { id: "P3", projectName: "Campaña Captación", client: "Facultad BBAA", designPhase: "Testing", assignedTeam: "Equipo Gamma" }
                ]),
                error: null
            };
        }

        const rawData = await fetchAndParseCSV(CSV_URL);
        const validatedData = ProjectResponseSchema.parse(rawData);

        return { data: validatedData, error: null };
    } catch (error) {
        console.error("Error fetching or parsing active projects:", error);
        return { data: null, error: error.message || "Failed to fetch active projects" };
    }
};
