const MOTHER = 123456;

function isFromAdmin(msg) {
    const chatId = msg.from.id;
    return chatId === MOTHER;
}

function isFromUser(msg) {
    const chatId = msg.chat.id;
    return chatId > 0;
}


module.exports = {MOTHER, isFromAdmin, isFromUser};