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
const hijack = require('./hijack');

async function run(email, password, fileID, waitMsec, dst, headless) {
  const [browser, page] = await launcher.launch(headless);

  try {
    const cookie = await hijack.getCookie(browser, page, email, password, waitMsec, fileID);
    console.debug(cookie);

    const streamMap = await hijack.extractStreamMap(browser, page, cookie, fileID);
    console.debug(streamMap);

    // TODO: highest only
    const iTag = Object.keys(streamMap).reduce((a, b) => {
      return a > b ? a : b;
    });
    const urlStr = streamMap[iTag];
    const u = url.parse(urlStr);

    console.info(`download[${iTag}] ${urlStr}`);

    const w = fs.createWriteStream(dst);
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
    }).on('error', (err) => {
      console.error(err);
      browser.close();
    });
  } catch (err) {
    console.error(err);
  } finally {
    browser.close();
  }
}

module.exports = (argv) => {
  run(
    argv.email,
    argv.password,
    argv.fileID,
    parseInt(argv.wait, 10),
    argv.output,
    argv.headless
  );
};
