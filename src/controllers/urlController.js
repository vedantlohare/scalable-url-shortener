const urlService = require('../services/urlService');

async function createShortUrl(req, res) {

    try {

        const { originalUrl, customAlias, expiryDays } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                error: "originalUrl is required"
            });
        }

        const userId = req.user.id;

        const result = await urlService.shortenUrl(
            originalUrl, customAlias, expiryDays, userId
        );


        res.status(201).json({
            shortUrl: `http://localhost:3000/${result.short_code}`,
            originalUrl: result.original_url
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

async function redirectToOriginal(req, res) {

    try {

        const { shortCode } = req.params;

        const url = await urlService.getOriginalUrl(
            shortCode
        );

        if (!url) {
            return res.status(404).json({
                error: "URL not found"
            });
        }
        if(
            url.expires_at &&
            new Date() > new Date(url.expires_at)
        ){
            return res.status(410).json({
                error: "URL expired"
            });
        }

        return res.redirect(url.original_url);

    } catch(error) {

        if(error.code === '23505') {

            return res.status(409).json({
                error: "Alias already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

async function getMyUrls(req,res){

    try{

        const urls =
            await urlService.getUserUrls(
                req.user.id
            );

        return res.json(urls);

    }catch(error){

        console.error(error);

        return res.status(500).json({
            error:"Internal Server Error"
        });
    }
}

async function getAnalytics(
    req,
    res
){

    const stats =
        await urlService.getStats(
            req.params.shortCode
        );

    if(!stats){

        return res.status(404).json({
            error:'URL not found'
        });
    }

    res.json(stats);
}

module.exports = {
    createShortUrl,
    redirectToOriginal,
    getMyUrls,
    getAnalytics
};