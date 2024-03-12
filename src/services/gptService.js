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

const addMessage = async (msg, threadId) => {

    const runs = await openai.beta.threads.runs.list(
        threadId
      );

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

    console.log(threadMessages);
    console.log(threadMessages.content)
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


// async function listMsg() {
//     const threadMessages = await openai.beta.threads.messages.list(
//         "thread_vNgppHbqbhFIlBv4ZwrMz6Br"
//     );

//     console.log(threadMessages.data[0].content);
// }

// listMsg();



export const sendMessage = async (prompt, threadId) => {
    let response = {};
    try {
        if (!threadId) {
            let thread = await createAndRun(prompt);
            response.threadId = thread.thread_id;
            response.messages = await listMessages(thread);
        } else {
            await addMessage(prompt, threadId);
            await runThread(threadId);
            let msgs = await listMessages(threadId);
            response.messages = msgs;
        }
    } catch (error) {
        console.log(error);
    }
    console.log(response);
    return response;
};