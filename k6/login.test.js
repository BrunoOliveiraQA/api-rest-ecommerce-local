import http from 'k6/http';
import { sleep, check } from 'k6';
import { pegarBaseURL } from '../utils/variaveis.js'
const postLogin = JSON.parse(open('../fixtures/loginBase.json'))


export const options = {
    iterations: 5,
    thresholds: {
        // Evite usar 'max' por ser muito sensível a ruídos; prefira percentis
        http_req_duration: ['p(90)<120', 'p(95)<150'],
        http_req_failed: ['rate<0.01']
    }
}

export default function () {

    const url = pegarBaseURL() + '/auth/login'

    const payload = JSON.stringify(postLogin)


    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'Validar que o Status é 200': (r) => r.status === 200,
        'Validar que o Token é string': (r) => typeof(r.json().token) === 'string'
    })

    sleep(1);
}