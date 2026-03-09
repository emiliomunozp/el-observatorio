import fs from 'fs';
import path from 'path';

// Path to our local JSON "database"
const dbPath = path.join(process.cwd(), 'src/data/db.json');

/**
 * Reads the entire database object safely.
 */
export const readDB = () => {
    try {
        const fileContent = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading db.json:", error);
        // Fallback to empty structure if read fails
        return { profile: {}, projects: [], team: [], resources: [] };
    }
};

/**
 * Writes to the database safely.
 */
export const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error writing to db.json:", error);
        return false;
    }
};
