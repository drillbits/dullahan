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

async function run(email, password, fileID, waitMsec, headless) {
  const [browser, page] = await launcher.launch(headless);

  try {
    const cookie = await hijack.getCookie(browser, page, email, password, waitMsec, fileID);

    const streamMap = await hijack.extractStreamMap(browser, page, cookie, fileID);

    console.log(JSON.stringify({
      'cookie': cookie,
      'streamMap': streamMap,
    }));
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
    argv.headless
  );
};
