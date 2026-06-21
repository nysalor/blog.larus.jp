---
layout: post
title: "assets:precompile問題"
date: 2012-03-05
---

[Rails3.1+capistrano](<http://blog.larus.jp/?p=440>)の続き的なもの。 しばらくローカルでassets:precompileする運用をやっていたが、色々問題があった。具体的には以下のような感じ。

  * デザインの細かな修正ごとにprecompileするので、コミットがassets:precompileだらけになる。
  * precompileした状態でdevelopment環境をロードすると、coffeescriptで書いた関数が2回実行されたりおかしなことになる。
  * Rails3.2だとprecompile時にデフォルトでproductionデータベースに接続しようとするので、そのままのdatabase.ymlのままローカルで実行するとエラーになる。（これは一応**RAILS_ENV=development rake assets:precompile** で解決可能）

と言うわけで改善を試みた。 参考にしたのは[stackoverflowのこのスレ](<http://stackoverflow.com/questions/9016002/speed-up-assetsprecompile-with-rails-3-1-3-2-capistrano-deployment>)。

まず、Capfileに**load ‘deploy/assets’** を追加する。この時、必ずload ‘config/deploy’よりも先にすること。そうしないと後述のnamespaceが有効にならない。 次にdeploy.rbに以下のnamespaceを定義。
    
    
    400: Invalid request
    

これでassetsのnamespaceが上書きされ、app/assets以下に変更があった時のみリモートでassets:precompileが行われるようになる。 万事解決良かった良かった。

のはずが、環境によってはprecompileが失敗することがある（[この問題？](<https://github.com/rails/sass-rails/issues/81>)）。ソースを追っかけたけどよく分からなかった。3.2.2で解決したかなぁ。
