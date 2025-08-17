<p align="center">
  <img src="docs/revcord.png" width="64px" />
</p>

<h1 align="center">revcord</h1>
<p align="center">
  <img src="https://img.shields.io/github/v/release/mayudev/revcord?style=for-the-badge">
  <img src="https://img.shields.io/github/license/mayudev/revcord?style=for-the-badge">
  <img src="https://img.shields.io/github/languages/top/mayudev/revcord?style=for-the-badge">
</p>

<p align="center"><b>🌉 あなたのRevoltとDiscordサーバーを繋ぐ一本のコード</b></p>

🔗 [revolt.js](https://github.com/revoltchat/revolt.js) を使用してTypeScriptで書かれた、コマンドによる簡単なセットアップが可能なDiscordと[Revolt](https://revolt.chat)のブリッジです。

[機能](#features) | [セットアップ](#setup) | [設定](#configuration) | [トラブルシューティング](#troubleshooting)

## 📔 機能 <a id="features"></a>

- [x] プラットフォーム間のメッセージをブリッジ
- [x] 添付ファイルのブリッジ
- [x] 返信のブリッジ
- [x] メッセージの編集と削除のブリッジ
- [x] 埋め込みのブリッジ
- [x] 絵文字のブリッジ[^1]
- [x] ユーザー情報をシームレスに表示

[^1]: RevoltからDiscordへの転送は機能しますが、リンクの連続投稿を防ぐため、表示される絵文字は3つに制限されています。Revoltのアニメーション絵文字は、Revoltの画像バックエンドの制限により静止画に変換されます。

![スクリーンショット - Revolt](docs/discord.png) ![スクリーンショット - Discord](docs/revolt.png)

## 🔩 セットアップ <a id="setup"></a>

[Docker](#using-docker) を使用することもできます。

**Node v16.9以上が必須です！**

重要：このボットは1つのサーバー（Discord+Revolt）で使用することを想定していますが、同じ管理者がいる限り、複数のサーバーでも使用できます。

1. このリポジトリをクローンし、依存関係をインストールしてビルドします

```sh
git clone https://github.com/mayudev/revcord
cd revcord
npm install
npm run build
```

2. Discord ([ガイド](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)) と Revolt (ユーザー設定を開く -> `My Bots` -> `Create a bot`) でボットを作成します
3. 関連するトークンを環境変数に設定します。最も簡単な方法は、`.env`という名前のファイルを作成することです（はい、`.env`という名前のファイルです）：

```
DISCORD_TOKEN = ...
REVOLT_TOKEN = ...
```

もちろん、...をトークンに置き換えてください。

セルフホスト版のRevoltを実行している場合は、追加で`API_URL`と`REVOLT_ATTACHMENT_URL`変数を設定してください：

```
API_URL = https://api.revolt.chat
REVOLT_ATTACHMENT_URL = https://autumn.revolt.chat
```

4. **重要！** ボットの招待リンクを作成する際に、URLジェネレータで以下の権限を選択してください（Discord Developersのあなたのボット -> `OAuth2` -> `URL Generator`）（面倒な場合は`管理者`を選択しても構いません）。**applications.commands**に注意してください！

![permissions](docs/permissions.png)

5. Bot -> Privileged Gateway Intents の下にある `Message Content Intent` を有効にします。これを忘れると、ボットは `Used disallowed intents` というメッセージでクラッシュします。

![intent](docs/intent.png)

6. **重要！** Revoltでは、ボットに **Masquerade** 権限を持つロールを必ず追加してください！

![revolt permissions](docs/mask.png)

7. ボットをRevoltとDiscordのサーバーに招待します。
8. `npm start` を使用してボットを起動します。

注意：ボットの実行には [pm2](https://pm2.keymetrics.io/) や [nodemon](https://nodemon.io/) のようなツールを使用することをお勧めします。`--experimental-specifier-resolution=node` フラグをnodeに手動で渡すようにしてください。そうしないと実行されません（デフォルトのstartスクリプトには含まれています）。

### Dockerを使用する

Dockerとdocker-composeがインストールされている必要があります。

上記の手順に従って `.env` ファイルを作成してください[^2]。`npm install` や `npm run build` を実行する必要はもちろんありません。また、ボットが必要な権限をすべて持っていることを確認してください。

docker-composeを実行する前に、`touch revcord.sqlite` を使用してデータベースファイルを作成し、空のままにしておきます。

これで準備完了です。

```
docker-compose up -d
```

[^2]: または、`docker-compose.yml` ファイルを適切に編集することもできます。`.env` ファイルがない場合に文句を言われないように、`volumes:` の下にある `./.env:/app/.env` を削除してください。

## 🔧 設定 <a id="configuration"></a>

### コマンドを使用する

Discordのスラッシュコマンドか、Revoltの `rc!` プレフィックスを使用できます（`rc!help` ですべてのコマンドを表示します）。

コマンドを使用するには、Discordで **あなた** が `管理者` 権限を持っている必要があります。Revoltでは、今のところサーバーの所有者のみが実行できます。

### DiscordとRevoltチャンネルを接続する

**Discordから**:

```
/connect <Revoltのチャンネル名またはID>
```

**Revoltから**:

```
rc!connect <Discordのチャンネル名またはID>
```

例：

```
# Discordから
/connect lounge
/connect 01AB23BC34CD56DE78ZX90WWDB

# Revoltから
rc!connect general
rc!connect 591234567890123456
```

✔️ メッセージを送信して動作するか確認してください。編集や削除も試してみてください。

### 接続を解除する

**Discordから**:

```
/disconnect
```

**Revoltから**:

```
rc!disconnect
```

チャンネルを指定する必要はありません。コマンドが送信されたチャンネルの接続を解除します。

### 接続を表示する

**Discordから**:

```
/connections
```

**Revoltから**:

```
rc!connections
```

### ボットの切り替え

ボットによって送信されたメッセージを転送するかどうかを切り替えることができます。デフォルトで有効になっています（NQNが正しく動作するために必要です）。

`rc!bots` または `/bots` を使用してください。

### mappings.jsonを使用する（非推奨）

#### この方法は推奨されません！

1. ルートディレクトリに `mappings.json` ファイルを作成します。
2. 以下の形式を使用します：

```json
[
  {
    "discord": "discord_channel_id",
    "revolt": "revolt_channel_id"
  },
  {
    "discord": "another_discord_channel_id",
    "revolt": "another_revolt_channel_id"
  }
]
```

## 🔥 トラブルシューティング <a id="troubleshooting"></a>

### `npm install` に時間がかかりすぎる、または `Please install sqlite3 package manually` (Raspberry Pi / 32-bit arm デバイス)

これは `node-sqlite3` がネイティブモジュールであるものの、32-bit arm アーキテクチャ用のビルド済みバイナリがなく、ソースからのビルドにフォールバックするためです。

しかし、Raspberry Piは通常、コンパイルを完了するにはパワーが低すぎます。

したがって、唯一の解決策は、より強力なデバイスを使用してarmにクロスコンパイルすることです。便宜上、`armv7l` アーキテクチャ用のビルド済みバイナリが[こちら](https://github.com/mayudev/revcord/releases/download/v1.2/node_sqlite3.node)で提供されています。

これを `node_modules/sqlite3/lib/binding/napi-v6-linux-glibc-arm/node_sqlite3.node` に配置する必要があります。

または、お使いのデバイスが対応している場合（Raspberry Pi 3は対応しています）、64-bitディストリビューションをインストールすることもできます。

### Discordに送信されたメッセージに内容がない！

[セットアップ](#setup) のステップ5にあるように、Discordボット設定で `Message Content Intent` を有効にする必要があります。これが機能しない場合は、ボットがチャンネル内のメッセージを読む権限を持っていることを確認してください。

![intent](docs/intent.png)

### ボットがチャンネルで十分な権限を持っていません。ウェブフックの管理権限がその特定のチャンネルのボットロールで上書きされていないか確認してください。

サーバー全体での権限とは別に、チャンネル固有の権限もあります。このメッセージは、ある時点で、ボットのウェブフック管理権限がチャンネルレベルで上書きされていることを意味します。最も簡単な修正は、上書きを変更して許可することです。または、ボットに `管理者` 権限を付与すると、すべてのチャンネル固有の権限が上書きされます。

チャンネル設定 -> 権限：

![override](docs/override.png)
