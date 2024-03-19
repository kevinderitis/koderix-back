import OpenAI from "openai";
import config from '../config/config.js';

const openai = new OpenAI({ apiKey: config.OPEN_AI_API_KEY });


// async function main() {
//   const emptyThread = await openai.beta.threads.create();

//   console.log(emptyThread);
// }

// main();

// async function runFunct() {
//     const run = await openai.beta.threads.runs.create(
//       "thread_TlLmIVbblS0g4thgnKoFjNKG",
//       { assistant_id: "asst_sksmUkXcO0OfByUPRT6l3GJ4" }
//     );

//     console.log(run);
//   }

// runFunct()


// async function addMsg() {
//     const threadMessages = await openai.beta.threads.messages.create(
//       "thread_TlLmIVbblS0g4thgnKoFjNKG",
//       { role: "user", content: "Hola" }
//     );

//     console.log(threadMessages);
//     console.log(threadMessages.content)
//   }

//   addMsg();

// async function runF() {
//   const run = await openai.beta.threads.createAndRun({
//     assistant_id: "asst_sksmUkXcO0OfByUPRT6l3GJ4",
//     thread: {
//       messages: [
//         { role: "user", content: "Hola!" },
//       ],
//     },
//   });

//   console.log(run);
// }

// runF();

const createAndRun = async msg => {
    const run = await openai.beta.threads.createAndRun({
        assistant_id: "asst_sksmUkXcO0OfByUPRT6l3GJ4",
        thread: {
            messages: [
                { role: "user", content: msg },
            ],
        },
    });

    return run;
}

const validateThread = async threadId => {
    const run = await getThread(threadId);

    let result = run.status === 'requires_action' ? false : true;

    return result;
}

const addMessage = async (msg, threadId) => {
    //   if(runs){
    //     const run = await openai.beta.threads.runs.cancel(
    //         'thread_m0YHQqsvmNBwvvqUwFFZllgY',
    //         'run_MVXOIB6TqrBdyepvuWlsZNZZ'
    //       );
    //     console.log('ok')
    //   }

    const threadMessages = await openai.beta.threads.messages.create(
        threadId,
        { role: "user", content: msg }
    );
    return threadMessages;
}

const listMessages = async threadId => {
    const threadMessages = await openai.beta.threads.messages.list(
        threadId
    );

    return threadMessages.data;
}

const runThread = async threadId => {
    const run = await openai.beta.threads.runs.create(
        threadId,
        { assistant_id: "asst_sksmUkXcO0OfByUPRT6l3GJ4" }
    );
    return run;
}

const getThread = async threadId => {
    const runs = await openai.beta.threads.runs.list(
        threadId
    );
    return runs.data[0];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForThreadResolution = async (threadId) => {
    let thread = await getThread(threadId);
    let i = 0;
    while (thread.status !== 'completed' && thread.status !== 'expired') {
        console.log(i++);
        await sleep(1000);
        thread = await getThread(threadId);

        if (thread.status === 'requires_action') {
            return {
                status: 'requires_action',
                email: thread.required_action.submit_tool_outputs.tool_calls[0].function.arguments,
            };
        }
    }
};

export const sendMessage = async (prompt, threadId) => {
    let response = {};
    try {
        if (!threadId) {
            let thread = await createAndRun(prompt);
            response.threadId = thread.thread_id;
            let action = await waitForThreadResolution(thread.thread_id);
            response.messages = await listMessages(thread.thread_id);
        } else {
            let msgs;
            if (validateThread(threadId)) {
                await addMessage(prompt, threadId);
                await runThread(threadId);
            }
            let action = await waitForThreadResolution(threadId);
            if (!action) {
                msgs = await listMessages(threadId);
            }
            response.messages = msgs;
        }
    } catch (error) {
        console.log(error);
    }
    console.log(response);
    return response;
};