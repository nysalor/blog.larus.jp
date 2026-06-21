---
layout: post
title: "続々assets:precompile問題"
date: 2012-04-04
---

[先日のエントリ](<http://blog.larus.jp/?p=508>)の最後に書いたprecompileが失敗する問題の続き。 Rails3.2.3でも解決していなかったので本腰入れて調べてみた。

具体的には、rake assets:precompileを実行すると以下のようなエラーで中断する。

[text] rake aborted! undefined method `[]' for nil:NilClass (in /path/to/rails_app/app/assets/stylesheets/application.css) /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-rails-3.2.5/lib/sass/rails/helpers.rb:32:in `resolver’ /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-rails-3.2.5/lib/sass/rails/helpers.rb:22:in `image_path' /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-3.1.15/lib/sass/script/funcall.rb:88:in `_perform’ 以下略 [/text]

railsをstableにすると発生しなくなったり3.2.3で復活したり長らく原因不明だったが、[githubのこのissue](<https://github.com/rails/sass-rails/issues/81>)を追っかけてようやく原因が分かった。

cssのurlをassetsに対応させるため、erbを埋め込んで以下のようにしていた。
    
    
    400: Invalid request
    

これはprecompileしない環境（development）だとうまく行くが、assets:precompileを実行すると上記のエラーになる。 どうやらasset_pathヘルパが[:custom]オプションを要求するのに対し、sassエンジンが[:custom]オプションなしで初期化されるのが原因らしい。 erbのasset_pathを諦め、styles.css.scssにリネームした上で、以下のように書き換えて解決。
    
    
    400: Invalid request
    

asset_pathがsassではasset-pathになるのが分からなくてハマった。[RailsGuide](<http://guides.rubyonrails.org/asset_pipeline.html>)に書いてはあるんだけど例が分かりづらい。 [sprocketのドキュメント](<http://rubydoc.info/github/petebrowne/sprockets-sass/master/Sprockets/Sass/Functions#asset_path-instance_method>)の方が分かりやすいかも。 なお、asset-pathだとimageオプションが必要だが、文字列を生で書くのが気持ち悪い場合、image-pathにするとオプションが不要になる。
    
    
    400: Invalid request
    

胸のつかえが取れたー。
