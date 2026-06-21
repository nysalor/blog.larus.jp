---
layout: post
title: "本当は怖いReDoS攻撃"
date: 2023-06-30
---
ReDOS攻撃というのが流行っているらしい。
ReDOS攻撃is何？

## 正規表現に対するDoS攻撃

ユーザの入力を安易に正規表現に通すとDoS攻撃を受けることがある。

## 例

ごく単純な正規表現

```ruby
/^(([a-zA-Z0-9])+)+$/
```

アルファベットまたは数字の繰り返しにマッチし、マッチした部分を返す。

## マッチさせてみる

とりあえず3.1.0で試す。

```irb
irb(main):013:0> RUBY_VERSION
=> "3.1.0"
```

## 簡単な例から

```irb
irb(main):002:0> 'abcde'.match(re).to_s
=> "abcde"
irb(main):003:0> '1234567'.match(re).to_s
=> "1234567"
```

一瞬で返る。

## 長い文字列

```irb
irb(main):004:0> 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'.match(re).to_s
=> "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
```

これも瞬時に返る。

## 一文字だけ追加

```irb
irb(main):007:0> 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@'.match(re).to_s
```

**フリーズする！**
(実際には非常に時間がかかるだけ)

## なぜ？

正規表現がどのようにマッチングをしているか考える必要がある。

[このサイト](https://regex101.com/)で正規表現をチェックできる。

<a href="/assets/images/regex101-1.png" data-lightbox="photo1" data-title="regex101.com">
  <img src="/assets/images/regex101-1.png" width="300">
</a>

## 最初の例

<a href="/assets/images/regex101-2.png" data-lightbox="photo1" data-title="regex101.com">
  <img src="/assets/images/regex101-2.png" width="300">
</a>

## 長い例

<a href="/assets/images/regex101-3.png" data-lightbox="photo1" data-title="regex101.com">
  <img src="/assets/images/regex101-3.png" width="300">
</a>


## フリーズしてしまった例

<a href="/assets/images/regex101-4.png" data-lightbox="photo1" data-title="regex101.com">
  <img src="/assets/images/regex101-4.png" width="300">
</a>

## なぜフリーズするか

最後の@まで行ってから戻る、@まで進む、また一つ戻る、@まで進む・・・の繰り返し(バックトラック)が発生するため。

## 問題になるケース

攻撃者はある程度の長さを持ち、バックトラックを発生させる正規表現を検索フォーム等に流すだけでプロセスを長時間占有することができる。
それを多数同時にやればいとも簡単にDoS攻撃ができてしまう。

## 対策

## 自分で正規表現を書かない

URLやメールアドレスのマッチ等は処理系で定義済みのものや公開されているものを使う。
自分で下手に書くとリスクがある。

## 処理系を最新にする、古いライブラリを使わない

```irb
irb(main):001:0> RUBY_VERSION
=> "3.2.2"
irb(main):002:0> 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@'
.match(re).to_s
=> ""
```

ruby3.2だとアルゴリズムが改善されているため、そもそもこの正規表現でもフリーズせず一瞬で返る。

## 繰り返しをなるべく使わない

`*`や`+`など無制限の繰り返しを含む正規表現を書かない。

## 入力文字数を制限する

例えば上の例なら `/^(([a-zA-Z0-9]){,10}){,10}$/` のようにすれば繰り返し回数を制限できる。

## タイムアウトを設定する

最近の処理系では正規表現のタイムアウトを設定できる。
例えば1000msとかにしておけばフリーズは避けられる。
ちなみにrubyだと・・・

https://zenn.dev/tmtms/articles/202212-ruby32-12
https://bugs.ruby-lang.org/issues/17837

3.2から入ってます。

## まとめ

- 正規表現は特定の文字列でフリーズさせることができる
- 下手に自分で正規表現を書くのは危険
- **ruby3.2移行を使いましょう**
