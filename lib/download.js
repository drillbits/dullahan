// Copyright 2020 drillbits
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const fs = require('fs');
const https = require('https');
const url = require('url');

const launcher = require('./launcher');
const session = require('./session');

async function run(argv) {
  const [cookie, streamMap] = await session.getSession(argv);

  try {
    // TODO: highest only
    const iTag = Object.keys(streamMap).reduce((a, b) => {
      return a > b ? a : b;
    });
    const urlStr = streamMap[iTag];
    const u = url.parse(urlStr);

    console.info(`download[${iTag}] ${urlStr}`);

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
    https.get(opts, (res) => {
      res.pipe(w);
      res.on('end', () => {
        console.info(`downloaded: ${argv.output}`)
      });
    }).on('error', (err) => {
      console.error(err);
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  run: (argv) => {
    run(argv);
  },
};
