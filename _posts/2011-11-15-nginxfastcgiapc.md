---
layout: post
title: "nginx+fastcgi+APC"
date: 2011-11-15
---

このサーバのフロントエンドをapacheからnginxに入れ替えた。 passenger経由で動かしていたredmineがとても遅いというクレームがあったのと、最近apacheいじってなくて設定にちょっと不安が出てきたので。つーかnginxのが設定項目が少なくて楽だし。 参考にしたのは[ここ](<http://stnard.jp/2010/04/20/115/>)と[ここ](<http://kray.jp/blog/wordpress-tuning/>)と[ここ](<http://www.ideaxidea.com/archives/2009/01/php_apc.html>)。init scriptとかまんまコピペですいません。

まず、wordpressを動かすためにfastcgiを入れる。fastcgiはubuntuだとphp5-cgiパッケージに入っている。 php周りが入れ替わるのでphp5-mysqlと、ついでにphp-pear、php5-devも入れておく。 でもってapacheなしでfastcgiだけを起動するため、/etc/init.d/php5-fastcgiを書く。
    
    
    #!/bin/bash
    BIND=127.0.0.1:8888
    USER=www-data
    PHP_FCGI_CHILDREN=2
    PHP_FCGI_MAX_REQUESTS=1000
    
    PHP_CGI=/usr/bin/php5-cgi
    PHP_CGI_NAME=`basename $PHP_CGI`
    PHP_CGI_ARGS="- USER=$USER PATH=/usr/bin PHP_FCGI_CHILDREN=$PHP_FCGI_CHILDREN PHP_FCGI_MAX_REQUESTS=$PHP_FCGI_MAX_REQUESTS $PHP_CGI -b $BIND"
    RETVAL=0
    
    start() {
          echo -n "Starting PHP FastCGI: "
          start-stop-daemon --quiet --start --background --chuid "$USER" --exec /usr/bin/env -- $PHP_CGI_ARGS
          RETVAL=$?
          echo "$PHP_CGI_NAME."
    }
    stop() {
          echo -n "Stopping PHP FastCGI: "
          killall -q -w -u $USER $PHP_CGI
          RETVAL=$?
          echo "$PHP_CGI_NAME."
    }
    
    case "$1" in
        start)
          start
      ;;
        stop)
          stop
      ;;
        restart)
          stop
          start
      ;;
        *)
          echo "Usage: php5-fastcgi {start|stop|restart}"
          exit 1
      ;;
    esac
    exit $RETVAL
    

ポートはお好みで。スクリプトを設置したらa+xして、update-rc.d php5-fastcgi defaultsとかやって起動するように設定。 最後にnginxの設定。sites-availableの適当なファイルに書いて、sites-enabledにsymlinkを貼る。
    
    
    # for wordpress
    upstream wp-blog-larus-jp {
      server 127.0.0.1:8888;
    }
    
    server {
      listen   80 default;
      server_name blog.larus.jp;
    
      location / {
        root /var/www/blog;
        index index.php index.html;
    
        # static files
        if (-f $request_filename) {
          expires 30d;
          break;
        }
    
        # request to index.php
        if (!-e $request_filename) {
          rewrite ^(.+)$  /index.php?q=$1 last;
        }
      }
    
      location ~ \.php$ {
                    fastcgi_pass   wp-blog-larus-jp;
                    fastcgi_index  index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/blog/$fastcgi_script_name;
      }
    
      location ~ /\.ht {
        deny all;
      }
    
      access_log  /var/log/nginx/blog.larus.jp-access.log combined;
      error_log  /var/log/nginx/blog.larus.jp-error.log;
    }
    

ここまでやったら、apacheを止めてnginxとphp-fastcgiを起動すれば見れる。

ついでに高速化のため、APCを入れてみた。pecl install APCしてから/etc/php5/cgi/php.iniのどこかにextension=apc.soを入れる。 かなり表示が速くなったと思うんだけどどうだろう。 wordpressのキャッシュプラグインもあるんだけど、パーマリンクの形式を変えなければいけなかったりするので、とりあえずここまででいいか。

redmineは普通にunicornをバックエンドで動かしてsock経由で丸投げ。 例によってstatic fileはnginxで処理するようにした。
    
    
    # for redmine
    pstream unicorn-of-redmine {
      server unix:/var/www/rails/redmine/pids/unicorn.sock;
    }
    
    server {
            listen 80;
            server_name redmine.larus.jp;
            root /var/www/rails/redmine/public;
    
            location /images {
                    root /var/www/rails/redmine/public;
                    expires 30d;
            }
    
            location /stylesheets {
                    root /var/www/rails/redmine/public;
                    expires 30d;
            }
    
            location /javascripts {
                    root /var/www/rails/redmine/public;
                    expires 30d;
            }
    
            location / {
                    if (-f $request_filename) { break; }
                    proxy_set_header X-Real-IP  $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header Host $http_host;
                    proxy_pass http://unicorn-of-redmine;
            }
    
      access_log  /var/log/nginx/redmine.larus.jp-access.log combined;
      error_log  /var/log/nginx/redmine.larus.jp-error.log;
    }
    

unicorn.rbとかは割愛。こっちもpassengerよりは遙かに速くなった。
