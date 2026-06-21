---
layout: post
title: "unscopedとkaminari"
date: 2012-01-05
---

default_scopeを外そうとしてunscopedしてからkaminariのpageオブジェクトにすると奇妙なことになる。
    
    
    class Item < ActiveRecord::Base
      default_scope where(:closed => nil)
      paginates_per 20
    end
    
    
    
    > Item.scoped.to_sql
    # => "SELECT `items`.* FROM `items` WHERE `items`.`closed` IS NULL"
    > Item.scoped.page.to_sql
    # => "SELECT `items`.* FROM `items` WHERE `items`.`closed` IS NULL LIMIT 20 OFFSET 0"
    > Item.unscoped.to_sql
    # => "SELECT `items`.* FROM `items`"
    # ここまでは想定通り
    > Item.unscoped.page.to_sql
    # => "SELECT  `items`.* FROM `items` WHERE `items`.`closed` IS NULL LIMIT 20 OFFSET 0"
    # えええなんで？
    

Rails3.0.10で確認。3.1.3だと直っているので、3.0系のみの問題かな。

回避方法探してstackoverflow漁ったら[amatsudaさんが回答してた](<http://stackoverflow.com/questions/7968622/kaminari-and-unscoped>)。
    
    
    > Item.unscoped{ Item.page.to_sql }
    # => "SELECT  `items`.* FROM `items` LIMIT 20 OFFSET 0"
    

3.0系でdefault_scopeは注意した方がいいよねってことで。
