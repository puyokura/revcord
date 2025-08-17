このプロジェクトで`nohup`を使用する場合、ビルド後の実行ファイルである`build/index.js`を指定する必要があります。

### 起動コマンド

```bash
nohup node build/index.js > revcord.log 2>&1 & echo $! > revcord.pid
```

このコマンドは以下のことを行います：
- `nohup`: ターミナルを閉じても実行を継続します。
- `node build/index.js`: プロジェクトをビルドした後の、正しい実行ファイルを指定します。
- `> revcord.log 2>&1`: 標準出力とエラー出力を`revcord.log`ファイルにリダイレクトします。
- `& echo $! > revcord.pid`: バックグラウンドでプロセスを実行し、そのプロセスIDを`revcord.pid`ファイルに保存します。

### 停止コマンド

プロセスを停止するには、保存したPIDファイルを使って以下のコマンドを実行します。

```bash
kill $(cat revcord.pid) && rm revcord.pid
```
- `kill $(cat revcord.pid)`: `revcord.pid`に書かれたプロセスを停止します。
- `&& rm revcord.pid`: 停止が成功したら、不要になった`revcord.pid`ファイルを削除します。
