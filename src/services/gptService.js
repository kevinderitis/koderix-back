import OpenAI from "openai";
import config from '../config/config.js';
import { executeActionWithParams } from '../functions/gptFunctions.js';

const openai = new OpenAI({ apiKey: config.OPEN_AI_API_KEY });

export class OpenAIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OpenAIError';
    }
};

const createAndRun = async (msg) => {
    try {
        const run = await openai.beta.threads.createAndRun({
            assistant_id: config.ASSISTANT_ID,
            thread: {
                messages: [{ role: "user", content: msg }],
            },
        });
        return run;
    } catch (error) {
        throw new OpenAIError('Error al crear y ejecutar el hilo.');
    }
};

const getThread = async (threadId) => {
    try {
        const runs = await openai.beta.threads.runs.list(threadId);
        return runs.data[0];
    } catch (error) {
        throw new OpenAIError('Error al obtener el hilo.');
    }
};

const addMessage = async (msg, threadId) => {
    try {
        const threadMessages = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: msg,
        });
        return threadMessages;
    } catch (error) {
        throw new OpenAIError('Error al añadir mensaje al hilo.');
    }
};

const listMessages = async (threadId) => {
    try {
        let threadMessages = await openai.beta.threads.messages.list(threadId);
        while (threadMessages.data.length === 0 || threadMessages.data[0].role === 'user' ||  !threadMessages.data[0].content) {
            await sleep(2000);
            threadMessages = await openai.beta.threads.messages.list(threadId);
        }

        return threadMessages.data;
    } catch (error) {
        throw new OpenAIError('Error al listar mensajes del hilo.');
    }
};

const runThread = async (threadId) => {
    try {
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: "asst_sksmUkXcO0OfByUPRT6l3GJ4",
        });
        return run;
    } catch (error) {
        throw new OpenAIError('Error al ejecutar el hilo.');
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const validateThread = async (threadId) => {
    let attempts = 5;

    while (attempts > 0) {
        try {
            const run = await getThread(threadId);
            console.log(`Status run: ${run.status}`)
            if (run.status === 'requires_action') {
                console.log(`Requires action`)
                return {
                    response: {
                        action: 'email',
                        params: JSON.parse(run.required_action.submit_tool_outputs.tool_calls[0].function
                            .arguments)
                    }
                };
            } else if (run.status !== 'in_progress') { // queued tener en cuenta
                return {
                    response: {
                        result: 'completed'
                    }
                };
            }

            await sleep(5000);
            attempts--;
        } catch (error) {
            throw new OpenAIError('Error al validar el hilo');
        }
    }

    throw new OpenAIError('Se agotaron los intentos');
};

export const sendMessage = async (prompt, threadId) => {
    let messages;
    let response;
    try {
        if (!threadId) {
            let thread = await createAndRun(prompt);
            threadId = thread.thread_id;
        }

        let threadObj = await validateThread(threadId);

        if (threadObj.response.action) {
            response = await executeActionWithParams(threadObj.response.action, threadObj.response.params);
            console.log(response)
        } else if (threadObj.response.result === 'completed') {
            console.log('El hilo se ha completado exitosamente');
            await addMessage(prompt, threadId);
            await runThread(threadId);
            messages = await listMessages(threadId);
            console.log(messages[0]);
            response = messages ? messages[0].content[0].text.value : 'Aguardame un minuto';
        } else {
            console.log('El hilo no está en progreso ni requiere acción');
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
    return response;
};
