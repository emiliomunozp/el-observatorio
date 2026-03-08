import axios from 'axios';
import { z } from 'zod';

// Zod Schemas for Validation with safe fallbacks
const MacroDataSchema = z.object({
    year: z.number().catch(new Date().getFullYear()),
    artsFriction: z.number().catch(0.85),
    stemFriction: z.number().catch(0.15),
}).array();

const MarketPulseSchema = z.object({
    designRatios: z.number().catch(10),
    engineeringRatios: z.number().catch(1),
});

const InternalSurveySchema = z.object({
    id: z.string().or(z.number()).transform(v => String(v)).catch("unknown"),
    fiscalIlliteracy: z.number().or(z.string().transform(v => parseFloat(v) || 0)).catch(95),
    confidenceLevel: z.number().min(0).max(100).catch(10),
}).array();

// Simulated API Calls (Currently returning mocked safe data structured like the intended APIs)
export const fetchMacroData = async () => {
    try {
        // In a real scenario: const response = await axios.get('/api/ine/macro');
        // return MacroDataSchema.parse(response.data);

        // Simulating INE Data
        const mockData = [
            { year: 2023, artsFriction: 0.82, stemFriction: 0.12 },
            { year: 2024, artsFriction: 0.85, stemFriction: 0.14 },
            { year: 2025, artsFriction: 0.88, stemFriction: 0.15 },
        ];
        return MacroDataSchema.parse(mockData);
    } catch (error) {
        console.error("Error fetching Macro Data:", error);
        // Fallback data to prevent D3 crashes
        return [{ year: 2026, artsFriction: 0.90, stemFriction: 0.10 }];
    }
};

export const fetchMarketPulse = async () => {
    try {
        // Simulating Live Job Offer Ratios
        const mockData = {
            designRatios: 12.5, // 12.5 applicants per design job
            engineeringRatios: 1.2, // 1.2 applicants per engineering job
        };
        return MarketPulseSchema.parse(mockData);
    } catch (error) {
        console.error("Error fetching Market Pulse:", error);
        return { designRatios: 10, engineeringRatios: 1 };
    }
};

export const fetchInternalSurvey = async () => {
    try {
        // Simulating UCM Google Forms parsing
        const mockData = [
            { id: "1", fiscalIlliteracy: "96.5", confidenceLevel: 5 },
            { id: "2", fiscalIlliteracy: 94, confidenceLevel: 12 },
            { id: "3", fiscalIlliteracy: "invalid_string", confidenceLevel: 8 },
        ];
        return InternalSurveySchema.parse(mockData);
    } catch (error) {
        console.error("Error fetching Internal Survey:", error);
        return [{ id: "fallback", fiscalIlliteracy: 95, confidenceLevel: 10 }];
    }
};
