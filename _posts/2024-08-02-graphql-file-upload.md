---
layout: post
title: "graphqlでファイルをアップロードする"
date: 2024-08-02
---
## graphqlとは？

別記事参照。

## graphqlのリクエスト(query)

例

```graphql
query {
  entries(user_id: 1, first: 10) {
    edges {
      cursor
      node {
        id
        title
        items {
          id
          name
        }
      }
    }
  }
}
```

http的には決められたpathに対し、上記のような文字列をquery stringsとしてPOSTする。
クエリの文法はDSLとして決まっているが、仕組みとしてはhttpでPOSTしているだけ。

## variables

上の簡単な例では引数をクエリに含めているが、graphqlではvariablesをschemaと分離できる。
variablesは普通のJSONになる。

### query

```graphql

mutation post($title: String, $body: String) {
    createEntry(title: $title, body: $body) {
      id
      title
      body
    }
}
```

### variables

```json
{
    "title": "今日の日記",
    "body": "猫が撫でさせてくれない。いったいいつになったら懐くのだろうか"
}
```

## 画像などのファイルをアップロードするには

ここに画像を添付したいというケースがある。
バイナリファイルはもちろんJSONに入らないため、何か別の方法を考えなくてはならない。

## 無理矢理JSONに入れる

バイナリをBASE64エンコードし、JSONのパラメータに入れる。
一番単純だが、大きなファイルになると、JSONのパースは大抵オンメモリで行うのでメモリを大食いしてしまう。場合によっては落ちるかも知れない。
またファイル名や拡張子のメタデータを自分で渡す必要がある。

## アップロードだけRESTにする

ありがちな実装。
簡単だけど敗北感ありますね。

## grqaqhqlのリクエストをmultipartにする

本命はこれでしょう。

## そもそもmultipartって何なの？

multipartとは何ぞや、を説明するには、httpのリクエストの仕組みについて説明する必要がある。
エンジニアであっても、httpのリクエストそのものはほとんどの場合クライアントライブラリに隠蔽されていて意識することがないが、実際は以下のようになっている。

## GETリクエスト

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
```

GETは分かりやすい。クエリは全部pathに含まれているし。

## POSTリクエスト

```
POST /submit-form HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

title=今日の日記&body=猫が撫でさせてくれない。いったいいつになったら懐くのだろうか
```

（実際には日本語はエンコードされています）

## multipart

ここにファイルをアップロードする場合、Content-Typeにそのための指示を入れる。

```
POST /submit-form HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryxxxxyz
Content-Length: 27

title=今日の日記&body=猫が撫でさせてくれない。いったいいつになったら懐くのだろうか

----WebKitFormBoundaryxxxxyz
Content-Disposition: form-data; name="Filedata"; filename="/pictures/cat.jpg"
Content-Type: image/jpeg

(data)
----WebKitFormBoundaryxxxxyz
```

このようにboundary（境界線）を指定し、それを挟んでエンコードしたバイナリデータを入れる。

## graphqlでは？

これをgraphqlでやっても、webサーバはboundaryを認識するがgraphqlサーバはその前までしか認識しない。

## GraphQL multipart request specification

そこでGraphQL multipart request specificationという仕組みがある。
これを使うとリクエストはこうなる。

```
--------------------------cec8e8123c05ba25
Content-Disposition: form-data; name="operations"

{
  "query": "mutation post($title: String, $body: String) {
    createEntry(title: $title, body: $body) {
      id
      title
      body
    }
  }
  "variables": {
    "title": "今日の日記",
    "body": "猫が撫でさせてくれない。いったいいつになったら懐くのだろうか"
  }
}

--------------------------cec8e8123c05ba25
Content-Disposition: form-data; name="map"

{ "0": ["variables.file"] }

--------------------------cec8e8123c05ba25
Content-Disposition: form-data; name="0"; filename="/pictures/cat.jpg"
Content-Type: image/jpeg
Content-Transfer-Encoding: base64

(data)
--------------------------cec8e8123c05ba25--
```

このようにクエリ、マップ、ファイルの三つのパートに分けることでアップロードされるようになる。

## graphql-rubyの実装

```ruby
module Resolvers
  class CreateEntryResolver
    type Types::EntryType, null: false

    argument :images, [ApolloUploadServer::Upload], required: true
    argument :title, String, required: false
    argument :body, String, required: false

    def resolve(images:, title:, body:)
      entry = context[:current_user].entries.new(title:, body:)
      entry.add_images(*images)
      entry.save!
    end
  end
end
```
