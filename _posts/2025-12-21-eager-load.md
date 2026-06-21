---
layout: post
title: "eager_loadでサービスを停止させた話"
date: 2025-12-21
---
この記事は[リサーチ・アンド・イノベーション 開発者ブログ](https://rni-dev.hatenablog.com/) のアドベントカレンダーに掲載した記事を一部手直ししたものです。

## 三浦半島.rb

三浦半島の付け根に住んでいる私ですが、今年の2月から[三浦半島.rb](https://miurahantorb.connpass.com/)という地域Rubyコミュニティが立ち上がり、そちらによくお邪魔しています。
だいたい二ヶ月に一度くらいの頻度で集まっているので、お近くにお住まいの方は是非顔を出してみて下さい。

### みんなで三崎港に行ってマグロを食べたりしてます

<a href="/assets/images/maguro.jpg" data-lightbox="photo1" data-title="マグロ会の様子">
  <img src="/assets/images/maguro.jpg" width="300">
</a>

<a href="/assets/images/misakikan.jpg" data-lightbox="photo1" data-title="三崎館">
  <img src="/assets/images/misakikan.jpg" width="300">
</a>

## サービスの紹介

ここから本題です。
表題の障害が発生したサービスは、WebアプリケーションのバックエンドAPIで、他社さんと協業で運営しています。
今回はこのサービスに起きた障害を紹介し、原因究明までお話ししたいと思います。

## 技術スタック(障害発生当時)

- Ruby3.3
- Ruby on Rails 7.1
- DB: Aurora Serverless
- APIは全てGraphQLで提供しています。

## ある日突然それは起きた

9月からの期間限定キャンペーンが始まった瞬間、レスポンスが急激に悪化。
タイムアウトエラーが頻発し始めました。
メトリクスを見るとDB(Aurora Serverless)のCPUが100%に張り付いています。

## 緊急対応

とりあえずACU(CPUユニット)の上限を上げましたが、すぐ再び100%に張り付いてしまいます。

## 原因調査

AWSのperformance insightで確かめると、**なんかすごいクエリ**がCPU資源を大量に消費していました。

```sql
SELECT DISTINCTROW `aaaa` . `id` FROM `aaaa`
LEFT OUTER JOIN `bbbb` ON `bbbb` . `aaaa_id` = `aaaa` . `id`
LEFT OUTER JOIN `cccc` ON `cccc` . `id` = `bbbb` . `cccc_id`
LEFT OUTER JOIN `dddd` ON `dddd` . `aaaa_id` = `aaaa` . `id`
LEFT OUTER JOIN `eeee` ON `eeee` . `id` = `ffff` . `eeee_id`
WHERE ( `start_at` < ? AND `end_at` > ? ) LIMIT ? OFFSET ?
```

**？？？？**


とりあえずexplainしてみます。

```
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: aaaa
   partitions: NULL
         type: range
possible_keys: PRIMARY,index_aaaa_on_col,index_aaaa_on_end_at,index_aaaa_on_start_at
          key: index_aaaa_on_end_at
      key_len: 8
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using index condition; Using where; Using temporary
*************************** 2. row ***************************
以下略
```

Using temporaryで一時テーブルを作成しているのが問題？
ただし、datadogの指標では残メモリは十分にあるように見えます。

## ここでいったん情報整理

- このプロダクトのインターフェースは全てGraphQLで書かれている(**伏線**)
- フロントエンドは別の会社が開発したReactアプリケーション

## フォールバック

原因不明のまま、いったんキャンペーンを止めたところ治まりました。
-> 根本原因は不明だが、問題はキャンペーンにありそう。

このへんで**もう店頭にPOP出しちゃってます**等の情報が入って胃がキリキリ痛む

## 他力本願(誤用)

とりあえず**社内で一番データベースに詳しい人**を呼んで意見を聞いたところ、**「Left JoinしているのにJoinしたカラムでWhereしていないのはおかしい」**と言われました。
た、確かに。流石です。

原因をかみ砕くと、LEFT JOINしているのにそのテーブルの条件でフィルタリングしていないため、**全件を含んだtemporary tableが作られ、それをDISTINCTするために大量にCPUを使っている**と考えられます。
ActiveRecordのようなO-Rマッパーを使っているのでなければ起こりえない事象です。

## 再び原因調査

まずは該当する部分のRailsのコードを見てみます。

```ruby
class ModelA < ApplicationRecord
  def self.search(param_d: nil, param_b: nil, ongoing: false, extra_search: false)
    results = eager_load(:model_b, model_c: :model_d)
    results = results.merge(ModelC.merge(ModelD.where(param_d:))) if param_d.present?
    results = ongoing ? results.ongoing : results.in_period
    return results unless extra_search
    return results.where.missing(:model_b) if param_b.blank?

    results = results.where(another_conditions)
    # snip
  end
end
```

**Builderパターン**ですね。Builder好き。
ちなみに書いた人は自分です。(誰のせいにもできない)

<a href="/assets/images/design_patter.jpg" data-lightbox="photo1" data-title="Rubyによるデザインパターン">
  <img src="/assets/images/design_pattern.jpg" width="300">
</a>

(良い本だけど絶版・・・英語では第二版が出ている)

### 上記のコードでやっていること

#### モデル

- ModelA: キャンペーン
- ModelB: 購入する店舗の情報
- ModelC: 商品情報
- ModelD: 商品識別コード

#### 関連付け

(-<: has_many)

- ModelA -< ModelB
- ModelA -< ModelC
- ModelC -< ModelD

#### ロジック解説

- 検索に使うテーブルをeager_loadする
- 商品による検索条件をmergeする
- 開催中のキャンペーンのみを検索するか、一定期間内かによって条件を付加する
- 追加条件フラグがfalseならここでreturn
- 追加条件があればBuilderパターンを続ける
  - 追加条件のテーブルは最初に**eager_load**されている

## そもそもeager_loadとは何か？

ActiveRecordのjoin系メソッドは3種類あります。

### Preload

テーブルごとにクエリを作り、外部キー(xxx_id)によってid IN条件で検索します。

例:
UserモデルからPropertyモデルがhas_manyされているとして

```ruby
User.preload(:properties).where(login_at: 1.day.ago..8.days.ago)
```

```sql
SELECT * FROM users WHERE login_at BETWEEN '2025-09-11 00:00:00 +09:00' AND '2025-09-18 23:59:59 +09:00'
SELECT * FROM properties WHERE id in (xxxx, xxx, xxx, ...)
```

最も単純ですが以下のデメリットがあります。

- クエリがテーブルの分だけ発行される
- 条件によってはINに大量のidが入って長大なクエリになる

### eager_load

予めLEFT OUTER JOINでテーブルを結合し、1つのクエリで検索する

例:
UserモデルからPropertyモデルがhas_manyされているとして

```ruby
User.preload(:eager_load).where(login_at: 1.day.ago..8.days.ago)
```

```sql
SELECT properties.id AS t0_r0, users.id AS t1_r0 FROM users LEFT OUTER JOIN properties ON properties.user_id = users.id WHERE users.login_at BETWEEN '2025-09-11 00:00:00 +09:00' AND '2025-09-18 23:59:59 +09:00'
```

クエリが一度で済むので高速。
デメリットはさっき見た通り、**検索条件があろうとあるまいと**テーブルがLEFT OUTER JOINされます。

### Includes

デフォルトだとpreloadと同じ挙動。
関連先テーブルの条件で絞り込むとeager_loadになる。
なお今回のように「関連先の関連先」の条件で絞り込む場合、予めjoinsで結合しておかないとうまく動作しない。

## eager_loadを選択した理由

- 関連先が多段のため、includesではうまく動かない。
- preloadで大量のidがINに入ったクエリを発行したくなかった(以前それでトラブルが発生したため)。

## 無意味なLEFT OUTER JOINを予見できなかったか？

- GraphQLだったため、**「何も条件を付けなければ全案件を返す」**という使い方をされ、トップページのクエリとして大量に呼ばれていた。
- GraphQLへのリクエストはRails上では”POST /graphql”にまとめられてしまうため、クエリの利用実態が把握しにくい。
  - datadogを使っているのでAPMの機能でGraphQLクエリごとの指標を追うことができたが、手が足りなくてTODOのままだった。
- 自社のみで完結するプロダクトであればクライアントを実装しているチームに聞けば利用実態が分かるが、今回はサードパーティが実装・運用していたため情報が共有されなかった。

## 解決編

検索条件のある時だけeager_loadするように変更しました。

```ruby
class ModelA < ApplicationRecord
  def self.search(param_d: nil, param_b: nil, ongoing: false, extra_search: false)
    raise 'must be specify param_d when extra_search is true.' if param_d.blank? && extra_search

    results = if param_d.present? && extra_search
      extra_search(param_d:, param_b:)
    elsif param_d.present?
      eager_load(model_b, model_c: model_d).merge(ModelC.merge(ModelD.where(param_d:)))
    else
      includes(:model_c)
    end

    ongoing ? results.ongoing : results.in_grace_period
  end
end
```

修正をリリースしたところ、キャンペーンを再開してもCPUは正常のままになりました。

## 学び

- eager_loadするのは関連先テーブルの条件で検索する時だけ
  - 条件が変動する場合、「最初に全部eager_loadしておく」はNG
- GraphQLは利用実態の調査が必須
  - 想定外の呼ばれ方をしていないか監視する
  - クライアントが決まっている場合、クライアントの開発者ときちんとコミュニケーションする

個人的には今年経験したうちで最も学びの多いトラブルでした。

## 関連情報

なお、障害発生から数ヶ月後に参加した[Kaigi on Rails 2025](https://kaigionrails.org/2025/)で近い事象の[発表](https://kaigionrails.org/2025/talks/mugitti9/#day1)がありました。
(preloadでメモリを爆発させてしまったという話)




録画も公開されているので、関心があればぜひ見て下さい。
