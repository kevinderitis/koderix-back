import { sendMessage, OpenAIError } from "../services/gptService.js";

export const chat = async (req, res) => {
    try {
        console.log(`Sending message thread ${req.body.threadId}: ${req.body.prompt}`)
        const response = await sendMessage(req.body.prompt, req.cookies.threadId);
        if (response.threadId) {
            res.cookie('threadId', response.threadId);
        }
        res.send({ response });
    } catch (error) {
        if (error instanceof OpenAIError) {
            res.status(400).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'Error interno del servidor' });
        }
    }
};

export const refreshChat = (req, res) => {
    res.clearCookie('threadId');
    res.send({ response: 'Cookies borradas' });
};
