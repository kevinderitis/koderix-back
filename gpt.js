import OpenAI from "openai";

const openai = new OpenAI({ apiKey: '' });


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

// async function listMsg() {
//     const threadMessages = await openai.beta.threads.messages.list(
//       "thread_vNgppHbqbhFIlBv4ZwrMz6Br"
//     );
  
//     console.log(threadMessages.data[0].content);
//   }
  
//   listMsg();