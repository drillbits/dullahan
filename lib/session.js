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

const launcher = require('./launcher');
const hijack = require('./hijack');

async function getSession(argv) {
  let browser, page, cleanup;

  if (!!argv.remoteDebuggingPort) {
    console.log(`connect the existing browser: ${argv.remoteDebuggingPort}`);
    [browser, page] = await launcher.connect({
      remoteDebuggingPort: argv.remoteDebuggingPort,
    });
    cleanup = async () => {
      await page.close();
      await browser.disconnect();
    };
  } else {
    console.log(`launch a ${argv.headless ? 'headless' : 'new'} browser`);
    [browser, page] = await launcher.launch(argv.headless);
    cleanup = async () => {
      await browser.close();
    };
  }

  let cookie, streamMap
  try {
    if (!argv.skipSignin) {
      await hijack.signin(page, argv.email, argv.password);
    }

    cookie = await hijack.getCookie(page, argv.fileId);
    console.debug(cookie);

    streamMap = await hijack.extractStreamMap(page, cookie, argv.fileId);
    console.debug(streamMap);
  } catch (e) {
    console.error(e);
  } finally {
    await cleanup();
  }

  return [cookie, streamMap];
}

async function run(argv) {
  const [cookie, streamMap] = await getSession(argv);
  console.log(JSON.stringify({
    'cookie': cookie,
    'streamMap': streamMap,
  }));
}

module.exports = {
  getSession: getSession,
  run: (argv) => {
    run(argv);
  },
};
