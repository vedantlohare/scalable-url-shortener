const pool = require('../config/db');
const { getUrlStats } = require('./userModel');

async function createUrl(originalUrl, shortCode, expiresAt, userId) {
    const query = `
        INSERT INTO urls (original_url, short_code, expires_at, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const result = await pool.query(query, [originalUrl, shortCode, expiresAt, userId]);

    return result.rows[0];
}

async function getUrlByCode(shortCode) {
    const query = `
        SELECT * FROM urls
        WHERE short_code = $1;
    `;

    const result = await pool.query(query, [shortCode]);

    return result.rows[0];
}

async function getUrlsByUserId(userId){

    const query = `
        SELECT *
        FROM urls
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;

    const result =
        await pool.query(
            query,
            [userId]
        );

    return result.rows;
}

async function incrementClicks(shortCode) {

    const query = `
        UPDATE urls
        SET clicks = clicks + 1
        WHERE short_code = $1;
    `;

    await pool.query(query, [shortCode]);
}

module.exports = {
    createUrl,
    getUrlByCode,
    incrementClicks,
    getUrlsByUserId,
    getUrlStats
};