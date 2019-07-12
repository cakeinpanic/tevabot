const {
    serviceAccount,
    databaseURL,
    BOT_ID,
    MEDIA_CHAT,
    MOTHER_CHAT,
    MESSAGES_CHAT,
    BOT_TOKEN,
    privateKey
} = process.env;

export const config = {
    serviceAccount: {...JSON.parse(serviceAccount), privateKey},
    databaseURL,

    BOT_ID: +BOT_ID,
    MEDIA_CHAT: +MEDIA_CHAT,
    MOTHER_CHAT: +MOTHER_CHAT,
    MESSAGES_CHAT: +MESSAGES_CHAT,
    BOT_TOKEN
};

