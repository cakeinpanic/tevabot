import {bot} from '../bot';
import {IMessage} from '../entities';

export function sendMessageByBot(...args): Promise<IMessage> {
    var sender = Promise.resolve(null);
    const content = args[1];

    if (!content) {
        return sender;
    }

    if (typeof content === 'string') {
        sender = bot.sendMessage(...args);
    }

    try {
        if (!!content.photo) {
            sender = bot.sendPhoto(args[0], content.photo);
        } else if (!!content.sticker) {
            sender = bot.sendSticker(args[0], content.sticker);
        } else if (!!content.location) {
            sender = bot.sendLocation(args[0], content.location.latitude, content.location.longitude);
        }
    } catch (e) {
        sender = Promise.resolve();
    }

    return sender.catch(err => {
        console.log(err);
    });
}