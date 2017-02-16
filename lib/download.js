//    Copyright 2017 drillbits
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

const fs = require('fs');
const https = require('https');
const url = require('url');

const vo = require('vo');
const Nightmare = require('nightmare');

const hijack = require('./hijack');

module.exports = (argv) => {
    vo(function* () {
        const nightmare = Nightmare({
            show: argv.show
        });
        const cookie = yield hijack.getCookie(nightmare, argv.email, argv.password, argv.fileID);
        if (!cookie) {
            throw new Error('failed to get cookie');
        }
        const streamMap = yield hijack.extractStreamMap(nightmare, argv.fileID, cookie);
        yield nightmare.end();
        return {
            'cookie': cookie,
            'stream_map': streamMap,
        };
    })((err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        const cookie = result['cookie'];
        const streamMap = result['stream_map'];

        // TODO: highest only
        const iTag = Object.keys(streamMap).reduce(function (a, b) {
            return a > b ? a : b;
        });
        const urlStr = streamMap[iTag];
        const u = url.parse(urlStr);

        console.log(`download[${iTag}] ${urlStr}`);

        const w = fs.createWriteStream(argv.output);
        const opts = {
            protocol: u.protocol,
            host: u.host,
            method: 'GET',
            path: u.path,
            headers: {
                'Cookie': `${cookie.name}=${cookie.value}`,
            },
        };
        https.get(opts, (resp) => {
            resp.pipe(w);
        })
    });
};