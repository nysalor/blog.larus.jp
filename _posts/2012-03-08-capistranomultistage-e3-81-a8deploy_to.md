---
layout: post
title: "capistrano/multistageとdeploy_to"
date: 2012-03-08
---

[前回のエントリ](<http://blog.larus.jp/?p=512>)でnamespaceに起因すると勘違いした不具合。 capistranoのmultistageでdeploy_toにstageごとに異なるパスを指定すると変になるという話。

multistageを使っている時に、config/deploy/staging.rbに以下のように書いたとする。
    
    
    400: Invalid request
    

が、これは期待した動作をしない。deploy:symlinkの時にオーバーライドしたはずのdeploy_toが復活する。もしdeploy.rbでdeploy_toを指定していなければ、デフォルトの/u/apps/#{application}が使われる。

これを回避するには、staging.rbに以下を追加する必要がある。
    
    
    400: Invalid request
    

これならdeploy_toが呼び出された時点で評価される。

しかし、全てのrails_envについて（staging.rb,production.rbなど）同じ内容を書かないといけないのでよろしくない。 ぱっと見だと難しそうなので、ゆっくりソースを追って考えてみます。
