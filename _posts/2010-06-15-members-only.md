---
layout: post
title: "Members Only"
date: 2010-06-15
---

Wordpressで作ったブログを非公開にする方法。 （もちろんこのブログではやってません） とりあえず.htaccessでBASIC認証にしてみたが、この方法だとフラッシュアップローダが使えないという制約がある（ブラウザによってはフリーズしてしまう）。 というわけでもう少しスマートに、Wordpressの認証を使うようにしてみる。 phpを直接書き換える方法もあるが、[Registered Users Only](<http://www.viper007bond.com/wordpress-plugins/registered-users-only/>)というそのまんまなプラグインがあるので頼ることにした。 これをインストールすると、閲覧しようとしただけで認証を求めるようになる。 警告メッセージを日本語化するには、75行目の$errorの中身を書き換え…てしまったけど今みたらtemplate.poっていう国際化対応っぽいファイルがあった。こっちをいじった方がスマートかも知れない。まぁいっか。

ついでに[Twitpress](<http://thomaspurnell.com/twitpress/>)で更新情報をTwitterに投げるようにしたけど、ちゃんと動作するかな…しませんね。ちぇ。 追記。php5-curlをインストールしてapacheを再起動したら動作しました。
