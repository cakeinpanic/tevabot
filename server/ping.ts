const http = require('http');

// only for heroku, because I dont want to pay from non-sleeping dyno
const PING_URL = 'http://tevapulse.herokuapp.com';

export function startPing() {
    if (!PING_URL) {
        return;
    }

    setInterval(() => {
        http.get(PING_URL);

        const hours = new Date().getUTCHours();

        console.log('ping ', hours);
    }, 300000);
}
