import {filter, map} from 'rxjs/operators';
import {$commands, sendMessageToBot} from '../bot';
import {isFromUser, mapByMatch, setGroupName} from '../utils';


const helpText = `
Привет, я бот! Я тут, чтобы улучшить TevaPulse! 🐿

Как можно меня использовать?
* написать любое сообщение, и оно будет отправлено организаторам. Это можно (и нужно) делать, если у тебя есть какие-то вопросы или что-то пошло не так. Мы сразу же тебе ответим.
* отправить видео, фото, аудио или даже "кружочек" нам. Из присланных медиа мы потом сделаем крутое слайдшоу. И вообще нам в штабе будет приятно посомтреть на то, что видите вы в этом путешествии 🌻

Также иногда мы сами будем присылать через бота всякие интересные штуки, задания и напоминания. Чтобы они приходили правильно, важно указать здесь свой маршрут при помощи команды /${setGroupName}. Если ты не знаешь свой маршрут – просто пожалуйся на это боту, и мы поможем
  
Напомню все свои команды: 
/help – информация про бота(повторит то, что ты сейчас читаешь)
/${setGroupName} – выбрать маршрут, по которому ты сегодня идешь
/fact – рандомный факт про выбранный маршрут
/mneskuchno – если тебе скучно 🍒
`

const $help = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/help/)),
    filter(({match}) => !!match),
    map(({msg}) => msg)
);

$help.subscribe((from) => {
    sendAbout(from.from.id)
})

export function sendAbout(userId, prefix = '') {
    sendMessageToBot(userId, prefix + helpText)
}

