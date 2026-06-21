const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: 6379
    }
});

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

(async () => {
    await client.connect();
    console.log('Redis Connected');
})();

module.exports = client;