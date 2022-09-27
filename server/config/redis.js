const redis = require('redis');
require('dotenv').config({ path: '../.env' });
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
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