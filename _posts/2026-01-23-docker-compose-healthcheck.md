---
layout: post
title: "docker compose healthcheck"
date: 2026-01-23
---
## docker-composeでよくある悩み

あるコンテナが別のコンテナに依存しているケース
depends_onで起動を待っているのに、DBが接続を受け付ける前にSQLを叩いて失敗する
depends_onはコンテナの起動を待つだけで、起動後にサービスがreadyになるのを待ってくれない

## entrypointに組み込むやつ

最初に思いつくのはこのへん

## sleep

- 一番安易なやつ
- command等に組み込む
- デメリットは言わずもがな

例
```entrypoint.sh
sleep 10
bundle exec rails db:create
...
```

## コマンドの成功を待つ

- mysqladmin ping, curlなど
- 「一定回数でresign」がやりにくい(工夫すればできる)

例
```entrypoint.sh
while true; do
  mysqladmin ping -h mysql -u root && break
done
bundle exec rails db:create
...
```

### [wait-for-it](https://github.com/vishnubob/wait-for-it)

- 特定のポートがオープンになるまで待ってくれるシェルスクリプト
- 割ときめ細かい設定が可能
- あくまでポートが開くまでなので、サービスがreadyになっているとは限らない

例
```entrypoint.sh
./wait-for-it.sh mysql:3306
mysqladmin ping -h mysql -u root
bundle exec rails db:create
...
```

## 欠点

- 元々のdockerのentrypointを上書きしてしまう
    - 何か前処理をしている時は混ぜないといけない
    - 本番のentrypointと乖離する
- 「最後に起動するサービス」のreadyを検知できない

## docker-compose healthcheck

ver 2.1から使用可能
特定のコマンドが成功するまで待つことができる

## docker-compose.yml

```docker-compose.yml
services:
  rails:
    build:
      context: .
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 30s
  mysql:
    image: mysql:8.0.32
    command:
      # this is to match Aurora mysql 2.10.2's empty sql_mode
      - --sql-mode=
      - --default-authentication-plugin=mysql_native_password
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root"]
      interval: 5s
      timeout: 5s
      retries: 10
```

## healthcheck

### test

実行するコマンドを書く
このコマンドの戻り値が0以外になるまでリトライする

### interval, timeout, retries

intervalごとにリトライし、retriesの回数失敗したら起動を諦める

### start_period

開始からstart_periodの間は失敗してもカウントしない
(成功したらその時点でhealthyになる)

## depends_on

- `condition: service_healthy` にすることでhealthcheckを待つ
- デフォルトは `service_started` (従来の動作)
- `service_completed_successfully` もある(対象コンテナの終了を待つ)

## 注意点

- healthcheckは**コンテナの実行中ずっと繰り返される**
    - 起動後も繰り返されるので負荷がかかったりする可能性がある
