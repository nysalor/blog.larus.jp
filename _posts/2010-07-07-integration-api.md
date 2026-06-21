---
layout: post
title: "Integration API"
date: 2010-07-07
---

RailsとWordPressをシングルサインオンで繋ぐIntegration APIというプラグインがあるらしい。 [MOONGIFTさんの記事](<http://www.moongift.jp/2008/12/rails_integration_api/>)を見てから一度使ってみたいと思ってたんだけど、使えそうな案件があったので試してみた。 簡単に仕組みを説明すると、Rails側にセッションと認証情報を提供するAPIを用意し、WordpressのプラグインからJSONで認証情報を貰ってくるというもの。APIはcookie名やログインURLを提供するconfg_infoと、cookieを認証情報にデコードするuserの二種類しかないシンプルなもの。

ところが、[記事中のサイト](<http://greenfabric.com/page/integration_api_home_page>)が既にドメインごとなくなっていていきなりつまづく。ええええ… githubを探し回ると、[gravis’s integration_api](<http://github.com/gravis/integration_api>)が見つかった。こ、これかな。 ちなみにWordpressのプラグインの方は[Rails Integration API](<http://wordpress.org/extend/plugins/rails-integration-api/>)という名前で公式からダウンロードできる。 既にこの時点で「メンテナンスされてないんじゃないか」という疑念が走るが、まぁ実験ということでとりあえず使ってみる。（と言うか既に手段が目的化しているのであった）

まずRails側にプラグインをインストール。
    
    
    script/plugin install git://github.com/gravis/integration_api.git
    

そのままだとcookie名がnilになってしまうので、vendor/plugins/integration_api/app/controllers/integration_api_controller.rbの
    
    
         cookie_name = ActionController::Base.session_options[:session_key]
    

を
    
    
         cookie_name = ActionController::Base.session_options[:key]
    

に直す。 さらにreadmeにある通り、config/environments/development.rbに
    
    
    # Constants for the Integration API
    INTEGRATION_API_DEBUG               = false
    INTEGRATION_API_SESSION_USER_ID_KEY = :user_id
    INTEGRATION_API_SESSION_ID_PARAM    = :id
    INTEGRATION_API_CONFIG = {
      :login_url  => 'http://localhost:3000/login',
      :logout_url => 'http://localhost:3000/logout'
    }
    
    # For security:
    INTEGRATION_API_REQUIRED_PORT       = 3000        # Set to nil to disable
    INTEGRATION_API_REQUIRED_HOST       = "localhost" # Set to nil to disable       
    

を追加。 INTEGRATION_API_SESSION_USER_ID_KEYとINTEGRATION_API_SESSION_ID_PARAMは何を設定したらいいのかよく分からなかったので、sessionの中身を確認して上記の設定にした。 なお、認証系は定番のrestful_authenticationを利用。

ここまでやって、http://localhost:3000/integration_api/config_infoにアクセスして {“cookie_name”:”_testapp_session”,”login_url”:”http://localhost:3000/login”,”logout_url”:”http://localhost:300/logout”} とか帰って来ればひとまず成功。

次にWordpress側。 上に挙げた[Rails Integration API](<http://wordpress.org/extend/plugins/rails-integration-api/>)をインストール。 設定画面ではEnable single sign-onとAutomatically create accountsをチェック。これでRailsの認証情報をWordpress側に自動的にコピーしてくれる。 そのコピーする内容のマッピングがUser data mappingで、認証に成功していればRails attributeの所に設定内容を表示してくれる。（が、これには罠がある。後述） Username、E-mailにUsersモデルの属性を入れればとりあえず動く。 restful_authenticationを改造してログイン名＝emailにしてたのでどっちもemailになってるが、これだとデフォルトのNicknameがemailになってしまうのがちと問題ではある。まぁこのへんは運用上の問題。

さて、マッピングはできるものの、一度この設定をしてしまうとRailsのアカウントでしかログインできなくなる。 で、自動作成されたアカウントはデフォルト権限しか持っていないので、管理者アカウントを作れない。 プラグインの設定も行えないし、無効化することもできない。これはどうすればいいんだ… 結局、いったんプラグインディレクトリを削除して強引に無効化してからWordpressの管理者アカウントでログインして、作成されたユーザに権限を与えるというとてもバッドノウハウな真似をしてしまった。 予め同名のユーザを作っておけばいいのかなぁ。ドキュメントが少なくて（と言うかサイト消えてるし）よく分からん。

正直、「シングルサインオン」という言葉のイメージからはほど遠い煩雑さで、管理もかえって面倒になりそうな気もした。これはちょっと仕事には使えないな。 まぁ、久々にphpのソース読んだりしてそれなりに楽しかったけどね。

[![](http://blog.larus.jpturbo.paulstamatiou.com/uploads/2010/07/integ-150x150.jpg)](<http://blog.larus.jpturbo.paulstamatiou.com/uploads/2010/07/integ.jpg>)
