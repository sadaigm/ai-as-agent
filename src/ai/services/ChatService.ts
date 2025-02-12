import { ChatPayload } from "../components/types/tool";
import { HOST_URL_VERSION_PATH } from "../const";

class ChatService {
    apiBase:string;

    constructor(){
        this.apiBase = `${HOST_URL_VERSION_PATH}`;
    }

    async invoke(payload: ChatPayload, controller: AbortController) {
        return await fetch(this.apiBase+"/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      }

}

export default ChatService;

let chatServiceInstance:ChatService;

export const createChatService = () : ChatService => {

    
    if(!chatServiceInstance){
        chatServiceInstance = new ChatService()
    }

    return chatServiceInstance;

}