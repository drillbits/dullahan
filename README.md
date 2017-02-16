# dullahan

`dullahan` supports streaming or downloading encoded videos on Google Drive with [nightmare](https://github.com/segmentio/nightmare).

## Usage

```bash
$ dullahan help
```

**Get cookie and stream map for streaming**

Output cookie and stream map to stdout as JSON format.

```bash
$ dullahan session -e EMAIL -p PASSWORD -f FILE_ID [--show]
{"cookie":{"name":"DRIVE_STREAM","value":"xxx","domain":".drive.google.com","hostOnly":false,"path":"/","secure":true,"httpOnly":true,"session":true},"
stream_map":{"18":"https://..."}
```

**Download the encoded video**

```bash
$ dullahan download -e EMAIL -p PASSWORD -f FILE_ID [-o OUTFILE] [--show]
```

## License

Apache 2.0