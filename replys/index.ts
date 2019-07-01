import * as _ from 'lodash';
import {Observable} from 'rxjs/index';
import {delay, filter, map, tap} from 'rxjs/operators';
import {$messages, bot, MESSAGES_TO_IGNORE} from '../bot';
import {firebase} from '../database/firebase';
import {
    forwardToAdminChat,
    forwardToMediaChat,
    getUSerToReply,
    IMessage,
    isCommand,
    isFromBot,
    isInAdminChat,
    isInMediaChat,
    isMedia
} from '../utils';

const FORWARDED_MESSAGES = [];

export const $media: Observable<IMessage> = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter(isMedia)
);

export const $messagesToForwardToAdmins = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter((t) => !isMedia(t)),
    filter((t) => !isCommand(t)),
    delay(500),
    tap((t)=>{
        console.log('message');}),
    filter(({message_id}: IMessage) => {
        var w = _.includes(MESSAGES_TO_IGNORE, message_id);
        _.pull(MESSAGES_TO_IGNORE, message_id);
        return !w;
    }),
);

export const $replysToForwarded = $messages.pipe(
    filter((t) => isInAdminChat(t) || isInMediaChat(t)),
    filter(t => isFromBot(t)),
    map((msg) => ({
        msg,
        replyTo: getUSerToReply(msg)
    })),
    filter(({replyTo}) => !!replyTo)
);

$replysToForwarded.subscribe(({msg, replyTo}: {msg: IMessage, replyTo: {user: number, message: number}}) => {

    var original_reply = _.find(FORWARDED_MESSAGES, ({newOne: replyTo.message}));

    if (original_reply) {
        bot.sendMessage(replyTo.user, msg.text, {reply_to_message_id: original_reply.initial});
        _.pull(FORWARDED_MESSAGES, original_reply);
        return
    }
    bot.sendMessage(replyTo.user, msg.text);

});


$messagesToForwardToAdmins.subscribe(initial => {
    firebase.addMessageToLog(initial);

    forwardToAdminChat(initial).then(newOne => {
        FORWARDED_MESSAGES.push({initial: initial.message_id, newOne: newOne.message_id})
    })
});

$media.subscribe(initial => {
    firebase.addMessageToLog(initial);

    forwardToMediaChat(initial).then(newOne => {
        FORWARDED_MESSAGES.push({initial: initial.message_id, newOne: newOne.message_id})
    });
});


