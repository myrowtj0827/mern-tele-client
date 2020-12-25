import {
    replyBot,
} from "../redux/actions/register/chatbot";

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowercase = message.toLowerCase();
        const data = {
            message: lowercase,
        };

        replyBot(data)
            .then(res => {

                let flag = res.data.results.flag;
                let get_reply = res.data.results.reply;

                if(flag === 0) {
                    this.actionProvider.greet(localStorage.provider_name);
                } if(flag === 1) {
                    this.actionProvider.handlePricing();
                } if(flag === 2) {
                    this.actionProvider.handleTraining();
                } if(flag === 3) {
                    this.actionProvider.handleTechnical();
                } else if(flag === 4){
                    this.actionProvider.generalMessage(get_reply);
                }
                console.log(get_reply);
            }).catch(err => {
            console.log(err.toString());
        })
    }
}
export default MessageParser;