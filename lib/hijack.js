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

const hijack = {};

hijack.getCookie = (nightmare, email, password, fileID, waitMsec) => {
    if (!waitMsec || isNaN(waitMsec)) {
        waitMsec = 3000;
    }
    return nightmare
        .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36')
        .goto('https://accounts.google.com/signin/v2')
        .wait('#identifierId')
        .type('#identifierId', email)
        .click('#identifierNext')
        .wait("input[type=password]")
        .wait(2000) // WORKAROUND
        .type("input[type=password]", password)
        .click('#passwordNext')
        .wait(waitMsec)
        .goto(`https://drive.google.com/file/d/${fileID}/view`)
        .cookies.get('DRIVE_STREAM');
};

hijack.extractStreamMap = (nightmare, fileID, cookie) => {
    return nightmare
        .useragent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36')
        .cookies.set(cookie)
        .goto(`https://drive.google.com/file/d/${fileID}/view`)
        .evaluate(() => {
            const streamMap = {};         
            JSON.parse(document.body.innerHTML.split("\n").find((l)=> l.match(/fmt_stream_map/)).slice(1))[1].split(",").map((x)=> x.split("|")).forEach((a)=>{
              streamMap[a[0]] = a[1];
            });
            return streamMap;
        });
};

module.exports = hijack;
