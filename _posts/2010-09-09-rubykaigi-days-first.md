---
layout: post
title: "rubykaigi.days.first"
date: 2010-09-09
---

[![](http://blog.larus.jpturbo.paulstamatiou.com/uploads/2010/09/IMG_2861-150x150.jpg)](<http://blog.larus.jpturbo.paulstamatiou.com/uploads/2010/09/IMG_2861.jpg>)

タイトルはタイムテーブルのパクリ。 会場案内図はrubykaigi.map(&:guide)とか書いてあった。 なお、なぜか毎回ある「map vs collectアンケート」では今回もmapが圧勝してました。

さて、rubykaigi１日目の感想。

**オープニング基調講演** Jeremy Kemper氏が急に来れなくなったとのことで、急遽座談形式に。どうなることかと思ったけど、これはこれでほのぼのしてて良かった。 要約すると、Rails3は層の分離が進んでいるため、Acrive*だけ使うとかいうこともできる。あと、ruby1.9使えと。

[nicodo]sm11901600[/nicodo]

**Jpmobile on Rails3** 前述の層の分離を活かして、一部機能をRackに組み込むことができたため、Sinatraでも利用できる。 Jpmobileに関してはそれほど目新しい話はなかったが、開発の過程でRailsのソースを読む話が面白かった。

[nicodo]sm11901698[/nicodo]

**オープンソーシャルアプリケーションの開発** acts_as_opensocialプラグインの紹介など。あとスケールアウトの助けとして、acts_as_multi_connection、ec2tools等も開発。 オープンソーシャルは以前調べたけどよく分からなかったので、acts_as_opensocialのソースを読んでみようと思う。 Rubyとは関係ないけど、ノウハウとしてメンテ開けはどっと来るのでIDの下一桁で区切って段階的にログインできるようにしていくって話が面白かった。

[nicodo]sm11902001[/nicodo]

**リアルタイムウェブができるまで** 昔々、TCP over HTTPってジョークRFCがあったのを思い出した。ついに時代が追いついたか… コネクション数とか平気なんだろうか。後でちょっと調べてみよう。

[nicodo]sm11902134[/nicodo]

**Head First 普通のシステム開発** アジャイル開発（スクラム）を実際にやり、時間内に実際に公開しているサービスに新機能を実装してしまうというライブ。 今回最高に面白かったセッション。本で読むよりも遙かに分かりやすいし、テーマの選び方も秀逸（見ている人が何をやっているかすぐ分かる）。 恥ずかしながら、bundlerを初めて知りました。次から使って見よう。
