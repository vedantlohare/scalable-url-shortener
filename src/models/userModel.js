const pool = require('../config/db');

async function createUser(
    username,
    email,
    passwordHash
) {

    const query = `
        INSERT INTO users
        (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [username, email, passwordHash]
    );

    return result.rows[0];
}

async function getUserByEmail(email) {

    const query = `
        SELECT *
        FROM users
        WHERE email = $1;
    `;

    const result = await pool.query(
        query,
        [email]
    );

    return result.rows[0];
}

async function getUserById(id) {

    const query = `
        SELECT *
        FROM users
        WHERE id = $1;
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0];
}

async function getUrlStats(shortCode){

    const query = `
        SELECT
        short_code,
        original_url,
        clicks,
        created_at,
        expires_at
        FROM urls
        WHERE short_code = $1;
    `;

    const result =
        await pool.query(
            query,
            [shortCode]
        );

    return result.rows[0];
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    getUrlStats
};