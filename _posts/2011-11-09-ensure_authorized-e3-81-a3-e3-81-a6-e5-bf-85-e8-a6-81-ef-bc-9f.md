---
layout: post
title: "ensure_authorizedって必要？"
date: 2011-11-09
---

[RestGraph](<https://github.com/godfat/rest-graph>)を使ってFacebookアプリを書いていて、ドキュメントを参考にしつつ
    
    
    rest_graph_setup(:app_id => API_ID,
    :secret => API_SECRET,
    :canvas => CANVAS_NAME,
    :auto_authorize => true,
    :auto_authorize_scope => 'publish_stream',
    :auto_authorize_options => {},
    :ensure_authorized => true,
    :write_session => true,
    :write_cookies => true,
    :write_handler => nil,
    :check_handler => nil,
    :auto_decode => true,
    )
    

とか初期設定しているんだけど、これだとスマートフォン版Facebook（アプリ、ブラウザ共に）で開くと延々とリダイレクトループになってOAUTHが通らない。

ログによると、APIのレスポンスは [javascript] { “error”: { “type”: “OAuthException”, “message”: “Error validating verification code.” } } [/javascript] と出ていて、ぶっちゃけなんだかよく分からない。検索すると「リダイレクトURLに変な文字が入ってると出るよ！」とか出てくるんだが、入ってないし。 ちなみにアプリ側では/にアクセスするとFBにログインしているかどうかを見て、ログインしていればiFrame canvasにリダイレクト、逆にFBにログインせずにcanvasを見に行くと/にリダイレクトされるようになっている。どうやらここでaccess_tokenからFacebook IDが取得できないのでリダイレクトループになってるというのは分かった。 そこで、いったんどうなるか試そうとensure_authorized（access_tokenがない時にFBに要求しに行く）をfalseにしてみたところ、リダイレクトループは止まり、「Facebookでログイン」ボタンを押すと正常にログインできるようになった。 と言うか、ensure_authorizedをfalseにしたままでもブラウザでの挙動は変わらないし、/からのリダイレクトも問題ない。ensure_authorizedってどんな時に使うんだろう？

[amazon-product]4048703048[/amazon-product]

rubyのコードは載ってないですがとっかかりとしては分かりやすいかと。 索引があまり当てにならないのは残念。
