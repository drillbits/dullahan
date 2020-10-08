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

const session = require('./session');
const download = require('./download');
const yargs = require('yargs');

const opts = {
  'email': {
    alias: 'e',
    describe: 'Specify the email address for your Google account. Required without skip-signin option.',
  },
  'password': {
    alias: 'p',
    describe: 'Specify the password for your Google account. Required without skip-signin option.',
  },
  'file-id': {
    alias: 'f',
    describe: 'Specify the File ID of Google Drive file.',
    demandOption: true,
  },
  'headless': {
    describe: 'Whether to run browser in headless mode.',
    boolean: true,
    default: true,
  },
  'remote-debugging-port': {
    describe: 'Specify the port for Google Chrome remote debugging.',
    default: '',
  },
  'skip-signin': {
    describe: 'Whether to skip sign-in to Google.',
    boolean: true,
    default: false,
  },
};

validate = (argv) => {
  if (!argv.skipSignin) {
    const missings = [];
    if (!argv.email) {
      missings.push('email');
    }
    if (!argv.password) {
      missings.push('password');
    }
    if (missings.length > 0) {
      throw new Error(`Missing required argument: ${missings.join(', ')}`);
    }
  }
  return true;
};

require('yargs')
  .usage('Usage: $0 <command>')
  .command('session', 'get cookie and stream map for streaming', (yargs) => {
    yargs.options(opts).check(validate);
  }, session.run)
  .command('download', 'download the encoded video', (yargs) => {
    yargs.options(opts).options({
      'output': {
        alias: 'o',
        describe: 'Write output to.',
        required: true,
      }
    }).check(validate);
  }, download.run)
  .demandCommand(1, 'Use "dullahan [command] --help" for more information about a command.')
  .help()
  .argv;
