import * as _ from 'lodash';
import {actions, bot} from './bot';

bot.on('callback_query', t => {
    const action = _.find(actions, {id: t.message.message_id});

    if (action) {
        action.cb();
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
