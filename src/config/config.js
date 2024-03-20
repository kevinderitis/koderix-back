import dotenv from 'dotenv';
dotenv.config();

const config = {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    ASSISTANT_ID: process.env.ASSISTANT_ID,
    PORT: process.env.PORT
};

export default config;
