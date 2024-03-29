import * as _ from 'lodash';
import {bot} from '../bot';
import {actions} from '../utils/utils';

export interface IActionReaction {
    id: string;
    from: {
        id: number;
        is_bot: false;
        first_name: string;
        username: string;
        language_code: string;
    };
    message: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            username: string;
            type: string;
        };
        date: number;
        text: string;
        reply_markup: {inline_keyboard: any[]};
    };
    chat_instance: string;
    data: string;
}

export interface IAction {
    remove: boolean;
    cb: (any) => any;
    id: number;
}

bot.on('callback_query', (t: IActionReaction) => {
    const action = _.find(actions, {id: t.message.message_id});

    if (action) {
        action.cb(t.data, {
            chat_id: t.message.chat.id,
            message_id: t.message.message_id
        });
    }

    if (action.remove) {
        bot.deleteMessage(t.message.chat.id, t.message.message_id);
        return;
    }

    bot.editMessageReplyMarkup(
        {
            parse_mode: 'Markdown'
        },
        {
            chat_id: t.message.chat.id,
            message_id: t.message.message_id
        }
    );
});
