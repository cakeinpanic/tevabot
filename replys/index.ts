import * as _ from 'lodash';
import {Observable} from 'rxjs/index';
import {delay, filter, map} from 'rxjs/operators';
import {$messages, MESSAGES_TO_IGNORE, sendMessageToBot} from '../bot';
import {firebase} from '../database/firebase';
import {
    forward,
    getUSerToReply,
    IMessage,
    isCommand,
    replyToBot,
    isFromUser,
    isInMediaChat,
    isMedia,
    MEDIA_CHAT,
    MESSAGES_CHAT
} from '../utils';

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
    }),
);

export const $adminReplyedToForwarded = $messages.pipe(
    filter((t) => isInMediaChat(t) || isInMediaChat(t)),
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
        sendMessageToBot(replyTo.user, msg.text, {reply_to_message_id: originalReply.initial});
        _.pull(FORWARDED_MESSAGES, originalReply);
        return
    }

    sendMessageToBot(replyTo.user, msg.text);

});


$messagesToForwardToAdmins.subscribe(initial => {
    firebase.addMessageToLog(initial);
    forwardMessage(initial, MESSAGES_CHAT)
});

$media.subscribe(initial => {
    firebase.addMessageToLog(initial);
    forwardMessage(initial, MEDIA_CHAT)
});


function forwardMessage(initial, chat) {
    forward(initial, chat).then(newOne => {
        FORWARDED_MESSAGES.push({initial: initial.message_id, newOne: newOne.message_id})
    })
}