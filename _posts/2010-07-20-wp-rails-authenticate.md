---
layout: post
title: "WP Rails Authenticate"
date: 2010-07-20
---

懲りずにRailsとWodpressの認証を結合する試みの続き。 [integration apiを使って](<http://blog.larus.jp/?p=174>)一定の成功は見たものの、実はdevelopment環境（cookieセッション）でしか動かなかった。production環境はmemcachedセッションを採用しているが、integration apiはcookieセッションとActiveRecordセッションにしか対応してない。memcachedセッションに対応させようと色々やってみたが挫折した。遺憾ながらこの手は放棄するッ！ と言うわけでもう一つのプラグイン、[WP Rails Authenticate](<http://wordpress.org/extend/plugins/wp-rails-authenticate/>)を使ってみることにした。

このプラグインは、Wordpress側にだけインストールし、Railsアプリケーションのdatabase.ymlの場所を設定してやれば、そこからRailsのデータベース情報を拾って独自に認証してくれるというもの。直接SQLを叩くのでMySQLにしか対応していないが、Rails側には一切手を加えないで済む。 前提としてphpのライブラリsyckとmysqliが必要なのでpearなどでインストールしておく。（今回はportsで入れた） プラグインそのままだと色々不具合がある。SQLは決め打ちなので、Railsの認証に合わせて直接変更する必要があるし、暗号化方式もsha512で決め打ちされていた（restful_authenticationはsha1だった）。 さらにWPもRailsもUTFなのに日本語が化ける問題が発生。これを回避するためにmysqli_set_charset($db, “utf8”)を加えておく。 以上を色々いじってようやく動くようになったので、パッチを載せておく。 なお、Railsのusersテーブルはrestful_authenticationを基本に、[こちらを参考](<http://shiroutodesign.blogspot.com/2008/12/restfulauthentication_4046.html>)にメールアドレスでログインするようにしたもので、nicknameカラムは表示のみに使用している。
    
    
    --- wp-rails-authenticate.php.orig	2010-02-15 00:37:22.000000000 +0900
    +++ wp-rails-authenticate.php	2010-07-20 12:49:49.000000000 +0900
    @@ -45,8 +45,8 @@
          * @param stdClass the user object returned from the rails app's database
          * @return string the encrypted password
          */
    -    function apply_encryption($data) {
    -      return hash('sha512', "--{$data->salt}--{$password}--");
    +    function apply_encryption($data, $password, $enctype) {
    +      return hash($enctype, "--{$data->salt}--{$password}--");
         }
         
         /*
    @@ -98,7 +98,7 @@
             // load our database credentials from the rails database.yml file
             $yaml = file_get_contents($config_file);
             $data = syck_load($yaml);
    -        $credentials = $data['staging'];
    +        $credentials = $data['production'];
             extract($credentials);
             $this->db = new mysqli($host, $username, $password, $database);
           }
    @@ -107,16 +107,18 @@
         
         function authenticate_rails($username, $password) {
           $db = $this->oc_db();
    -      $query = sprintf("SELECT `id`, `first_name`, `last_name`, `email`, `encrypted_password`, `salt` FROM `users` WHERE `email` = '%s'", 
    +      $query = sprintf("SELECT `id`, `email`, `crypted_password`, `salt`, `nickname` FROM `users` WHERE `email` = '%s'", 
             mysql_real_escape_string($username));
    +      mysqli_set_charset($db, "utf8");
    +      $db->query($query);
           $login = $db->query($query);
           if (! $login->num_rows || $login->num_rows == 0) {
             return false;
           }
           $data = $login->fetch_object();
    -      
    -      $encrypted_password = $this->apply_encryption($data);
    -      if ($encrypted_password == $data->encrypted_password) {
    +
    +      $encrypted_password = $this->apply_encryption($data, $password, 'sha1');
    +      if ($encrypted_password == $data->crypted_password) {
             return $data;
           }
           return false;
    @@ -195,10 +197,11 @@
           $user_data = array(
             'user_pass' => $password,
             'user_login' => $oc_user->email,
    -        'first_name' => $oc_user->first_name,
    -        'last_name' => $oc_user->last_name,
    -        'display_name' => $oc_user->first_name . ' '. $oc_user->last_name,
    -        'email' => $oc_user->email
    +        'first_name' => $oc_user->nickname,
    +        'last_name' => '',
    +        'nickname' => $oc_user->nickname,
    +        'display_name' => $oc_user->nickname,
    +        'user_email' => $oc_user->email
           );
           
           require_once(WPINC . DIRECTORY_SEPARATOR . 'registration.php');
