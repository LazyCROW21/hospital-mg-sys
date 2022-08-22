const redis = require('redis');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.on('end', () => {
    console.log('Client disconnected from Redis Server');
});

process.on('SIGINT', () => {
    client.quit();
});

client.on('connect', () => {
    console.log('Connected to redis cache server');
});

client.connect();

module.exports = client;