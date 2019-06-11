import * as _ from 'lodash';
import {filter, map} from 'rxjs/operators';
import {$messages, bot} from '../bot';
import {mapByMatch, isFromUser} from '../utils';

const $getFact = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/fact/)),
    filter(({match}) => !!match)
);

const facts = [
    `Друзы исповедуют единого Бога, так же, как иудеи, христиане и мусульмане. Друзская религия появилась в результате раскола радикального направления шиитского ислама около 1000 лет назад. Сегодня друзов в мире более трех миллионов, половина из них живет на Ближнем Востоке.`,
    `В Сирии они считаются мусульманами. В Израиле друзы получили статус отдельной религии. Мы мало знаем о друзской религии, поскольку она тайная, только для своих. Известно лишь, что друзы верят в переселение душ. Они уверены, что душа умершего друза переселяется в новорожденного друзского младенца. Но поскольку количество друзских душ строго ограничено, они не принимают посторонних в свою религию и не вступают в смешанные браки. И еще нам известно, что одной из главных заповедей друзов является верность стране, в которой они живут. И именно неукоснительное соблюдение этих заповедей позволяют им сохраниться в круговерти нашей непростой действительности. Друзская святыня находится в кратере потухшего вулкана, который называется Карней Хиттин. Вон он, между горами, со срезанной вершиной.`,
    `Друзы, живущие в Израиле, утверждают, что Неби Шуэйб – это тесть еврейского пророка Моисея, того самого, который вывел народ из Египта. Он 40 лет кочевал вместе с евреями по пустыне и пришел с ними в Землю Обетованную. Он один из важнейших пророков в друзской религии. Здесь находится его гробница. А под горой бьет чудесный источник, из которого каждый может напиться.`,
    `Друзы – замечательные резчики по дереву и камню. Вот как красиво они украшают свои строения.`
]

$getFact.subscribe(({msg}) => {
    bot.sendMessage(msg.chat.id, facts[_.random(0, facts.length - 1)])
})