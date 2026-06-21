---
layout: post
title: "varnish&nginx"
date: 2012-03-21
---

varnishとnginxを使っているサーバをマイグレーションすることになり、今まで外部のLBを通していたのを直接処理することになった。 そこで問題になるのはSSLの扱い。varnishはSSLを扱えないため（作者はopensslのコードはクソだ、と[一刀両断](<https://www.varnish-cache.org/docs/trunk/phk/ssl.html>)している）、httpsのフロントエンドとしては使えない。 そこで順序を入れ替え、nginxをフロントエンドに、varnishを挟んでunicornに投げるようにした。

具体的には以下の通り。

旧構成:**LB→varnish→nginx→unicorn**

新構成:**nginx→varnish→unicorn**

varnishはUNIX socketに対応していないので（[予定はあるようだが](<https://www.varnish-cache.org/trac/ticket/1020>)）、unicornを適当なポートで待ち受けさせてやらなければならない。 静的ファイルはフロントエンドのnginxで直接捌くためvarnishにキャッシュさせることはできなくなるが、nginx単体で充分なパフォーマンスが出るので考えなくていいだろう。

nginxを80で待ち受けさせて、静的ファイル以外をバックエンドのvarnishに投げ、varnishがさらにバックエンドのunicornに投げる。 これで問題なく動作しているかに見えたが、実は大きな罠があった。 varnishはGETリクエストしかキャッシュしないため、POSTについてはそのままバックエンドに丸投げになるはずが、間にnginxが挟まったことで全てのリクエストがGETになってしまう現象が発生した。 恐らくvclの記述がまずいのだと思うが、とりあえずnginxの方でGETリクエストのみをvarnishに投げ、それ以外は直接unicornに投げるように変更して解決した。 以下はその設定。

**/etc/nginx/sites-available/default**
    
    
    upstream varnish {
            server localhost:8080;
    }
    
    upstream unicorn-rails {
            server localhost:3000;
    }
    
    server {
            listen 80;
            server_name rails-app-sample.larus.jp;
            root /var/www/rails-app/current/public;
            error_log /var/www/rails-app/current/log/nginx-error.log;
    
            location ~ ^/assets|system/ {
                    expires 1y;
                    add_header Cache-Control public;
                    add_header Last-Modified "";
                    add_header ETag "";
            }
    
            location = /favicon.ico {
                root   /var/www/rails-app/current/public/assets;
            }
    
            location / {
                    proxy_set_header X-Real-IP  $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $http_host;
    
                    if ($request_method = GET) {
                            proxy_pass http ://varnish;
                            # httpの後のスペースは本来は省く
                    }
    
                    proxy_pass http ://unicorn-rails;
                    # httpの後のスペースは本来は省く
            }
    
    }
    

**/etc/varnish/default.vcl**
    
    
    backend rails_app {
      .host = "127.0.0.1";
      .port = "3000";
      .connect_timeout = 30s;
    }
    
    sub vcl_recv {
      if (req.http.host == "rails-app-sample.larus.jp") {
        set req.backend = rails_app;
        return (lookup);
      }
    }
    

なお、以後スケールする場合はnginxをロードバランサにしてvarnish+unicornの組を増やせば良い。

しかしvarnishの作者はDJBの同類っぽくてやや不安・・・
