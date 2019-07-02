import {filter} from 'rxjs/operators';
import {$commands, sendMessageToBot} from '../bot';
import {HELP, INLINE_CB} from '../groups/buttons';
import {filterByWord, isFromUser} from '../utils';


const helpText = `
Привет, я бот! Я тут, чтобы улучшить TevaPulse! 🐿

Как можно меня использовать?
■ написать любое сообщение, и оно будет отправлено организаторам. Это можно (и нужно) делать, если у тебя есть какие-то вопросы или что-то пошло не так. Мы сразу же тебе ответим. 🐸 
■ отправить видео, фото, аудио или даже "кружочек" нам. Из присланных медиа мы потом сделаем крутое слайдшоу. И вообще нам в штабе будет приятно посомтреть на то, что видите вы в этом путешествии 🌻
■ узнать рандомный факт про свой маршрут через меню 🍒
 
Также иногда мы сами будем присылать через бота всякие интересные штуки, задания и напоминания. Чтобы они приходили правильно, важно указать здесь свой маршрут при помощи меню внизу. Если ты не знаешь свой маршрут – просто пожалуйся на это боту, и мы поможем! 🍕 
`

const $help = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    filter(t => filterByWord(t, HELP))
);

$help.subscribe((from) => {
    sendAbout(from.from.id)
});

export function sendAbout(userId, prefix = '') {

    if (!!prefix) {
        sendMessageToBot(userId, prefix + helpText, INLINE_CB)
        return
    }
    sendMessageToBot(userId, helpText)
}

