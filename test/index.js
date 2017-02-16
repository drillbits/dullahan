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
const path = require('path');

const test = require('ava');
const pify = require('pify');
const execFile = require('child_process').execFile;

test('session', async t => {
    const stdout = await pify(execFile)('./bin/dullahan', [
        'session',
        '-e', process.env.DULLAHAN_TEST_EMAIL,
        '-p', process.env.DULLAHAN_TEST_PASSWORD,
        '-f', '0B7rtUHJTGP6DbGc5SmZNV19fdzQ',
    ]);
    let session;
    try {
        session = JSON.parse(stdout);
    } catch (err) {
        t.fail('failed to parse as json: ' + stdout);
    }
    const cookie = session.cookie;
    t.truthy(cookie, 'session has a cookie');
    t.is(cookie.name, 'DRIVE_STREAM', 'cookie name is DRIVE_STREAM');
    const streamMap = session.stream_map;
    t.truthy(streamMap, 'session has a stream_map');
});

test('download', async t => {
    const output = path.join(path.resolve(''), 'test.mp4');
    const stdout = await pify(execFile)('./bin/dullahan', [
        'download',
        '-e', process.env.DULLAHAN_TEST_EMAIL,
        '-p', process.env.DULLAHAN_TEST_PASSWORD,
        '-f', '0B7rtUHJTGP6DbGc5SmZNV19fdzQ',
        '-o', output,
    ]);

    let stat;
    try {
        stat = fs.statSync(output);
    } catch (err) {
        t.fail(`failed to open ${output}`);
    }
    t.is(stat.size, 660955);
    fs.unlinkSync(output);
});