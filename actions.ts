import * as _ from 'lodash';
import {actions, bot} from './bot';

export interface IActionReaction {
    id: string,
    from: {
        id: number,
        is_bot: false,
        first_name: string,
        username: string,
        language_code: string
    },
    message: {
        message_id: number,
        from: {
            id: number,
            is_bot: boolean,
            first_name: string,
            username: string
        },
        chat: {
            id: number,
            first_name: string,
            username: string,
            type: string
        },
        date: number,
        text: string,
        reply_markup: {inline_keyboard: any[]}
    },
    chat_instance: string,
    data: string
}

bot.on('callback_query', (t: IActionReaction) => {
    const action = _.find(actions, {id: t.message.message_id});

    if (action) {
        action.cb(t.data);
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
