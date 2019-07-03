import {distinctUntilChanged, map} from 'rxjs/operators';
import {bot} from '../bot';
import {firebase} from '../database/firebase';
import {last} from '../bot';
import {INLINE_CB, INLINE_CB_BORING} from '../groups/buttons';

export interface ISettings {
    activated: boolean;
    showBoring: boolean;
}

export const CURRENT_SETTINGS: ISettings = {
    activated: false,
    showBoring: false
}

firebase.$settings.pipe(map(({activated}) => activated), distinctUntilChanged()).subscribe(newStatus => {
    CURRENT_SETTINGS.activated = newStatus
})

// firebase.$settings.pipe(map(({showBoring}) => showBoring), distinctUntilChanged()).subscribe(newStatus => {
//     CURRENT_SETTINGS.showBoring = newStatus;
//     // sendToAllUsers('Появилась новая кнопка в меню')
//     var cb = newStatus ? INLINE_CB_BORING : INLINE_CB;
//     console.log(newStatus);
//     if(!last){
//         return
//     }
//     bot.editMessageReplyMarkup(
//         cb,
//         {
//             chat_id: last.chat.id,
//             message_id: last.message_id
//         }
//     );
//
// })