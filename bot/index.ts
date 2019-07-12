import {firebase} from '../database/firebase';
import {usersList} from '../database/usersList';

import './boring';
import './facts';
import './groups';
import './help';
import './name';

import './replys';
import './settings';
import {startListeningToMessages} from './bot';

export function startBot() {
    usersList.init(firebase);
    startListeningToMessages();
}


