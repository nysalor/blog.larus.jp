---
layout: post
title: "Ominauthでtwitter/facebook認証"
date: 2012-01-03
---

あけましておめでとうございます。

TwitterとFacebookのどちらでも認証できて、なおかつログイン後にもう一方のアカウントを紐付けできるようにしてみた。

まずOmniauthの設定。1.0になって色々変わってるので、[こちらの記事](<http://www.terut.net/?p=730>)を参考に。 まぁproviderごとのgemを追加して、user_infoをinfoにするだけなんだけどね。

次にモデル。UserとAuthenticationを用意した。
    
    
    rails g model User nickname:string
    rails g model Authentication user_id:integer uid:string provider:string screen_name:string access_token:string access_secret:string
    
    
    
    class User < ActiveRecord::Base
      has_many :authentications
    
      class << self
        def create_with_omniauth(auth)
          user = User.create! do |user|
            user.nickname = auth["info"]["nickname"]
          end
          user.authentications.create! do |authentication|
            authentication.set_attributes auth
          end
          user
        end
      end
    
      def add_provider(auth)
        self.authentications.create! do |authentication|
          authentication.set_attributes auth
        end
      end
    end
    
    
    
    class Authentication < ActiveRecord::Base
      belongs_to :user
    
      def set_attributes(auth)
        self.provider = auth["provider"]
        self.uid = auth["uid"]
        self.screen_name = auth["info"]["nickname"]
        set_credentials auth
      end
    
      def set_credentials(auth)
        self.access_token = auth["credentials"]["token"]
        self.access_secret = auth["credentials"]["secret"]
        self
      end
    end
    

これでcontrollerからUser.create_with_omniauth request.env[“omniauth.auth”]とかやればユーザが作成される。 紐付けするには、@user.add_provider request.env[“omniauth.auth”]でＯＫ。 ログイン部分とかは省略するので他の情報源当たって下さい。 あと、プロフィール画像とかURLとかのソーシャルグラフを毎回引っ張ってくるとレスポンスが遅いので、モデルの属性としてキャッシングしておくことをお勧めします。
