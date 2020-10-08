# dullahan

[![Build Status][travis-badge]][travis-badge-url]
[![npm][npm-badge]][npm-badge-url]

`dullahan` supports streaming or downloading encoded videos on Google Drive with [puppeteer](https://pptr.dev/).

## Installation

```bash
$ npm install -g dullahan
```

## Usage

```bash
$ dullahan help
```

**Get cookie and stream map for streaming**

Output cookie and stream map to stdout as JSON format.

```bash
$ dullahan session -e EMAIL -p PASSWORD -f FILE_ID
{"cookie":{"name":"DRIVE_STREAM","value":"xxx","domain":".drive.google.com","hostOnly":false,"path":"/","secure":true,"httpOnly":true,"session":true},"
stream_map":{"18":"https://..."}
```

**Download the encoded video**

```bash
$ dullahan download -e EMAIL -p PASSWORD -f FILE_ID -o OUTFILE
```

**Attach to an existing browser**

Start Google Chrome with the remote-debugging-port option.

```bash
$ google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp
```

Start dullahan with the remote-debugging-port option, too.

```bash
$ dullahan download -e EMAIL -p PASSWORD -f FILE_ID -o OUTFILE --remote-debugging-port=9222
```

**Skip sign-in**

You can skip sign-in to Google account when you attach to an existing browser that has the session.

```bash
$ dullahan download -f FILE_ID -o OUTFILE --remote-debugging-port=9222 --skip-signin
```

## License

Apache 2.0

[travis-badge]: https://travis-ci.org/drillbits/dullahan.svg?branch=master
[travis-badge-url]: https://travis-ci.org/drillbits/dullahan
[npm-badge]: https://img.shields.io/npm/v/dullahan.svg
[npm-badge-url]: https://www.npmjs.com/package/dullahan
