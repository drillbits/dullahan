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

const signinPageURL = 'https://accounts.google.com/signin/v2';

async function signin(page, email, password, waitForInput, waitForSignin) {
  waitForInput = waitForInput || 2000;
  waitForSignin = waitForSignin || 3000;

  console.info(`goto "${signinPageURL}"`);
  await page.goto(signinPageURL, {
    waitUntil: 'networkidle2'
  });

  console.info('wait for id input');
  await page.waitForSelector('#identifierId');
  await page.type('#identifierId', email);
  await page.click('#identifierNext');

  console.info('wait for password input');
  await page.waitForSelector("input[type=password]");
  await page.waitFor(waitForInput);
  await page.type("input[type=password]", password);
  await page.click('#passwordNext');

  await page.waitFor(waitForSignin);
}

async function getCookie(page, fileID) {
  const fileURL = `https://drive.google.com/file/d/${fileID}/view`;

  console.info(`goto "${fileURL}"`);
  await page.goto(fileURL, {
    waitUntil: 'networkidle2'
  });

  const cookies = await page.cookies();
  let streamCookie;
  cookies.forEach((o) => {
    if (o.name === 'DRIVE_STREAM') {
      streamCookie = o;
    }
  });

  return streamCookie;
}

async function extractStreamMap(page, cookie, fileID) {
  const fileURL = `https://drive.google.com/file/d/${fileID}/view`;

  await page.setCookie(cookie);

  console.info(`goto "${fileURL}"`);
  await page.goto(fileURL, {
    waitUntil: 'networkidle2'
  });

  const streamMap = await page.evaluate(() => {
    const streamMap = {};
    Array.prototype.forEach.call(document.scripts, (e) => {
      const x = e.innerHTML.split('\n').find((l) => l.match(/fmt_stream_map/));
      if (!!x && x.slice(1)) {
        const y = JSON.parse(x.slice(1));
        y[1].split(',').map((z) => z.split('|')).forEach(([k, v]) => {
          streamMap[k] = v;
        });
      }
    });
    return streamMap;
  });

  return streamMap;
}

module.exports = {
  signin: signin,
  getCookie: getCookie,
  extractStreamMap: extractStreamMap,
};
