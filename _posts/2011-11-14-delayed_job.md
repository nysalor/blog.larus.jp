---
layout: post
title: "delayed_job"
date: 2011-11-14
---

Railsで非同期実行する際の定番、[delayed_job](<https://github.com/collectiveidea/delayed_job>)。 ドキュメントが今一分かりにくかったりforkされまくっててどれがオリジナルか分からなかったりするので、メモしておく。

起動・終了・再起動
    
    
    bundle exec script/delayed_job start   # 起動
    bundle exec script/delayed_job stop    # 終了
    bundle exec script/delayed_job restart # 再起動
    

restartはプロセスが無いと起動してくれないので、stop→startの方が無難。

capistranoのレシピ
    
    
    namespace :delayed_job do
      desc "Start delayed_job process"
      task :start, :roles => :job do
        run "cd #{current_path}; RAILS_ENV=#{stage} bundle exec script/delayed_job start"
      end
    
      desc "Stop delayed_job process"
        task :stop, :roles => :job do
        run "cd #{current_path}; RAILS_ENV=#{stage} bundle exec script/delayed_job stop"
      end
     
      desc "Restart delayed_job process"
        task :restart, :roles => :job do
        run "cd #{current_path}; RAILS_ENV=#{stage} bundle exec script/delayed_job restart"
      end
    end
    

roleはお好みで。appとかやると全サーバで動き始めるのでお勧めしない。

遅延実行
    
    
    job = Job.new
    job.delay.execute
    

非同期で実行。デフォルトだと５分おき？にリトライされる。

時刻指定実行
    
    
    job = Job.new
    job.send_at Time.zone.now.tomorrow :execute
    

これくらいで十分ではないかと。 rails runnerで実行してるバッチもdelayed_jobにしたいんだけど（runnerだとRailsのプロセスが丸々一個上がるのでリソースの無駄）、いい方法ないかな。
