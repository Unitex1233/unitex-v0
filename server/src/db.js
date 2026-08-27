// Mock DB pool - replaced with file-based storage for MVP
// This is a stub to satisfy the module requirements while using file-backed storage

const fs = require('fs');
const path = require('path');

// Mock pool object that satisfies the interface but doesn't require PostgreSQL
const pool = {
    query: async (sql, params) => {
        // For MVP, we use file-based storage instead
        // Services have been updated to use local files
        return { rows: [] };
    },
    end: async () => {
        // No-op for file-based storage
    }
};

module.exports = { pool };
