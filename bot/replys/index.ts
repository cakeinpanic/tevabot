import * as _ from 'lodash';
import {Observable} from 'rxjs/index';
import {delay, filter, map} from 'rxjs/operators';
import {$messages} from '../bot';
import {firebase} from '../../database/firebase';
import {sendMessageByBot} from '../utils/sendMessage';
import {
    forward,
    getUSerToReply,
    isCommand,
    replyToBot,
    isFromUser,
    isInMediaChat,
    isMedia,
    MEDIA_CHAT,
    MESSAGES_CHAT, isInAdminChat, isInMessagesChat, MESSAGES_TO_IGNORE
} from '../utils/utils';
import {IMessage} from '../entities';

const FORWARDED_MESSAGES = [];

export const $media: Observable<IMessage> = $messages.pipe(
    filter((t) => isFromUser(t)),
    filter(isMedia)
);

export const $messagesToForwardToAdmins = $messages.pipe(
    filter((t) => isFromUser(t)),
    filter((t) => !isMedia(t)),
    filter((t) => !isCommand(t)),
    delay(500),
    filter(({message_id}: IMessage) => {
        var w = _.includes(MESSAGES_TO_IGNORE, message_id);
        _.pull(MESSAGES_TO_IGNORE, message_id);
        return !w;
    })
);

export const $messagesToLog = $messages.pipe(
    filter((t) => isFromUser(t))
);

export const $adminReplyedToForwarded = $messages.pipe(
    filter((t) => isInAdminChat(t) || isInMessagesChat(t) || isInMediaChat(t)),
    filter(t => replyToBot(t)),
    map((msg) => ({
        msg,
        replyTo: getUSerToReply(msg)
    })),
    filter(({replyTo}) => !!replyTo)
);

$adminReplyedToForwarded.subscribe(({msg, replyTo}: {msg: IMessage, replyTo: {user: number, message: number}}) => {
    var originalReply = _.find(FORWARDED_MESSAGES, ({newOne: replyTo.message}));

    if (!!originalReply) {
        sendMessageByBot(replyTo.user, msg.text, {reply_to_message_id: originalReply.initial});
        _.pull(FORWARDED_MESSAGES, originalReply);
        return;
    }

    sendMessageByBot(replyTo.user, msg.text);

});


$messagesToForwardToAdmins.subscribe(initial => {
    forwardMessage(initial, MESSAGES_CHAT);
});

$media.subscribe(initial => {
    forwardMessage(initial, MEDIA_CHAT);
});

$messagesToLog.subscribe(initial => {
    firebase.addMessageToLog(initial);
});


function forwardMessage(initial, chat) {
    forward(initial, chat).then(newOne => {
        FORWARDED_MESSAGES.push({initial: initial.message_id, newOne: newOne.message_id});
    });
}