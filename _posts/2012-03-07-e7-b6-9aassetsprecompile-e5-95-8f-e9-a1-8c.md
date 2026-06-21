---
layout: post
title: "続assets:precompile問題"
date: 2012-03-07
---

[先日のエントリ](<http://blog.larus.jp/?p=508>)は色々間違ってました。

まず、Rails3.2でDBに接続しに行く問題はapplication.rbに**config.assets.initialize_on_precompile = false** を追加することで回避できるみたい。[RailsGuidesくらいちゃんと読め](<http://guides.rubyonrails.org/asset_pipeline.html>)って話ですよね。このへんは[先日の勉強会](<https://twitter.com/search?q=%23shibuyarails>)で教えて貰いました。

~~あとdeploy.rbでnamespaceを定義して更新時だけprecompileするコードだけど、multistageを使っているとパスがデフォルトになってしまったりでうまく動作しない。（multistageしてない時には正常動作するはず） こちらはちょっと考え直す必要がありそう。うまく行ったらまた紹介します。~~ 上記、別の問題とごっちゃになってました。そのままのコードで問題なしです。
