const { nanoid } = require('nanoid');
const urlModel = require('../models/urlModel');
const redisClient =require('../config/redis');

async function shortenUrl(originalUrl, customAlias, expiryDays, userId) {

    let expiresAt = null;

    if (expiryDays) {

        expiresAt = new Date();

        expiresAt.setDate(
            expiresAt.getDate() + expiryDays
        );
    }

    const shortCode = customAlias || nanoid(6);

    const savedUrl = await urlModel.createUrl(
        originalUrl,
        shortCode,
        expiresAt,
        userId
    );

    return savedUrl;
}

async function getUserUrls(userId){

    return await urlModel.getUrlsByUserId(
        userId
    );
}


async function getOriginalUrl(shortCode) {

    const cachedUrl =
        await redisClient.get(shortCode);

    if(cachedUrl){

        console.log(
            'Cache Hit:',
            shortCode
        );

        await urlModel.incrementClicks(
            shortCode
        );

        return JSON.parse(cachedUrl);
    }

    console.log(
        'Cache Miss:',
        shortCode
    );

    const url =
        await urlModel.getUrlByCode(
            shortCode
        );

    if(url){

        await redisClient.set(
            shortCode,
            JSON.stringify(url),
            {
                EX: 3600
            }
        );

        await urlModel.incrementClicks(
            shortCode
        );
    }

    return url;
}

async function getStats(shortCode){

    return await urlModel.getUrlStats(
        shortCode
    );
}

module.exports = {
    shortenUrl,
    getOriginalUrl,
    getUserUrls,
    getStats
};