---
layout: post
title: "Rubyで関数型プログラミング"
date: 2025-03-07
---
rubyと言えばオブジェクト指向言語ですね。

![オブジェクト指向スクリプト言語Ruby](/assets/images/objective-ruby.jpg){: width="300"}

ちなみに公式サイトのtitleタグも「オブジェクト指向スクリプト言語Ruby」。

## でも関数型の影響を受けている

matzがCommon Lisp好きだとかいろいろね。

## 関数型っぽく書いてみるRubyの話

と言うわけで、関数型苦手な人間が関数型っぽくRubyを書いてみる。

## Procオブジェクト

簡単に言うとブロックをオブジェクト化したもの。

```ruby
x = Proc.new { |a, b| a + b }
x.call(1, 2) #=> 3
```

&で呼び出すこともできる。

```ruby
x = Proc.new { |a, b| a + b }
[[1, 2], [3, 4]].map(&x) #=> [3, 7]
```

`Object#proc` メソッドでも定義できる。

```ruby
x = proc { |a, b| a + b }
x.call(1, 2) #=> 3
```

## lambdaオブジェクト

Proc同様、ブロックをオブジェクト化したもの。

```ruby
x = lambda { |a, b| a + b }
x.call(1, 2) #=> 3
```

省略記法 `->()` もある(railsのscopeでお馴染みのアレ)。

```ruby
x = ->(a, b) { a + b }
x.call(1, 2) #=> 3
```

## Procとの違い

Procとの違いは大きく分けて2つ。

## 引数チェックが厳密

Procは引数が合っていなくても実行できる。

```ruby
x = proc { |a, b| a.to_i + b.to_i }
x.call(1) #=> 1 引数が足りない時はnilが渡る
```

lambdaは引数が異なるとエラーになる。

```ruby
x = lambda { |a, b| a.to_i + b.to_i }
x.call(1) #=> ArgumentError
```

## returnの扱い

Procは外側のメソッドも抜ける。

```ruby
def test_proc
  x = proc { return }
  x.call
  p 'method end'
end

def test_lambda
  x = lambda { return }
  x.call
  p 'method end'
end

test_proc #=> 何も表示されない
test_lambda #=> "method end"
```

## カリー化

(カレーではない)

![カレー](/assets/images/curry.jpg){: width="300"}

## カリー化とは？

```
複数の引数をとる関数を、引数が「もとの関数の最初の引数」で戻り値が「もとの関数の残りの引数を取り結果を返す関数」であるような関数にすること(wikipediaより)
```

## Procオブジェクトのカリー化

```ruby
x = proc { |a, b| a.to_i + b.to_i }
y = x.curry # カリー化 Procオブジェクトが返る
z = y.call(1) # Procオブジェクトが返る
z.call(2) #=> 3
```

## 実はメソッドでもできたりする

```ruby
class Sample
  def self.add(a, b)
    a + b
  end

  def self.curry_add
    self.method(:add).curry
  end
end

x = Sample.curry_add
y = x.call(1) #=> Procオブジェクトが返る
y.call(2) #=> 3
```

## カリー化すると何が嬉しいのか？

例えば2つの引数を取る処理があるが、1つ目の引数が共通の処理が複数あったりするケース。

```ruby
x = proc { |a, b| a.to_i % 3 + b.to_i % 2 }
y = x.curry
z1 = y.call(5)
[1, 2, 3, 4, 5].map(&z1) #=> [3, 2, 3, 2, 3]
z2 = y.call(4)
[1, 2, 3, 4, 5].map(&z2) #=> [2, 1, 2, 1, 2]
```

## 関数合成

```ruby
x = proc { |a| a * 2 }
y = proc { |a| a ** 2 }
z = x << y # Procオブジェクトが返る
z.call(3) #=> 18 (=3**2*2)
```

## 逆向きの合成もできる

```ruby
x = proc { |a| a * 2 }
y = proc { |a| a ** 2 }
z2 = x >> y # Procオブジェクトが返る
z.call(3) #=> 36 (=(3*2)**2)
```

## 高階関数

関数を引数に取り、関数を返す関数を高階関数という(ゲシュタルト崩壊しそう)
Haskellなんかではお馴染みのやつ。
proc(lambda)で高階関数を実装でき、一風変わったコードが書けるようになる。

プロダクトコードに使うのはレビューが大変だからやめて下さいね！！！
