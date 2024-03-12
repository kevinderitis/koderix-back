import { sendMessage } from "../services/gptService.js";

export const chat = async (req, res) => {
    const response = await sendMessage(req.body.prompt, req.cookies.threadId);
    if(response.threadId){
        res.cookie('threadId', response.threadId)
    }
      res.send({ response });
    }
    
export const refreshChat = (req, res) => {
    res.clearCookie('threadId');
    res.send({ response: 'Cookies borradas'})
}