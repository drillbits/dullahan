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

const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

async function connect(opts) {
  const res = await fetch(`http://localhost:${opts.remoteDebuggingPort}/json/version`)
  const json = await res.json();
  const { webSocketDebuggerUrl } = json;
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
  })
  const page = await browser.newPage();

  return [browser, page];
}

async function launch(headless) {
  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--disable-web-security',
    ],
  });

  const page = await browser.newPage();
  page.on('error', err => {
    console.error(`error at page: ${err}`)
  });
  page.on('pageerror', err => {
    console.error(`pageerror at page: ${err}`)
  });

  await page.setViewport({
    width: 1024,
    height: 768,
  });

  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');

  return [browser, page];
}

module.exports = {
  launch: launch,
  connect: connect,
};
