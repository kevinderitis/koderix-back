import dotenv from 'dotenv';
dotenv.config();

const config = {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY
};

export default config;
