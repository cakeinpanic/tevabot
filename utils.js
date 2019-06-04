
function isFromAdmin(msg) {
    const chatId = msg.from.id;
    return chatId === 123456;
}

function isFromUser(msg) {
    const chatId = msg.chat.id;
    return chatId > 0;
}


module.exports = {isFromAdmin, isFromUser}