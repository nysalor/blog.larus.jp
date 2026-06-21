---
layout: post
title: "Rails3.1+capistrano"
date: 2011-11-14
---

Rails3.1でasset pipelineが導入された関係で、3.0のままのレシピでデプロイするといくつか問題が出る。

まずpublic/images、public/stylesheets、public/javascriptsがないというエラー。 エラーが出ても実害はないが、赤文字がずらずら流れるので心臓によろしくない。 これの解決は簡単で、deploy.rbに
    
    
    set :normalize_asset_timestamps, false
    

を追加するだけでＯＫ。

ちょっと悩ましいのが、rake assets:precompileをいつ実行するかということ。 ヒューマンエラーをなくすために、まずはdeploy時に実行するようにしてみる。 （deploy.rbではなく）Capfileに
    
    
    require "deploy/assets"
    

Gemfileに
    
    
    gem 'execjs'
    

を追加。さらにサーバ側にnode.jsをインストールしておく。 これでcap deployすると自動的にrake assets:precompileが実行される・・・んだけど、実はassets:precompileはかなり遅い。appサーバが複数あると全部で実行されるし、大変に効率が悪い。node.jsが簡単にインストールできない環境だとそれも面倒だし。（Ubuntuならapt-getするだけだが） というわけで、assets:precompileはローカルで実行してリポジトリに含めておくことにした。

ついでにcapistranoではないけど、nginxの設定。 unicornに投げる部分は省略して、assetsまわりのみはこんな感じ。
    
    
            location ~ ^/assets|system/ {
                    expires 1y;
                    add_header Cache-Control public;
                    add_header Last-Modified "";
                    add_header ETag "";
            }
    

例によって静的ファイルはrailsを通さずに処理されるので、圧倒的に早い。

[amazon-product]4797363827[/amazon-product]

必携。[電書版はこちら](<http://bookpub.jp/books/bp/198>)。
