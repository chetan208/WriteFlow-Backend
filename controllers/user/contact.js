
const {sendContactMessage} = require("../../services/sendEmail");

async function sendContactMessageController(name, email, message) {
    await sendContactMessage(name, email, message);
}