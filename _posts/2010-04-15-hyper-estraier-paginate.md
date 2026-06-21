---
layout: post
title: "hyper estraier + paginate"
date: 2010-04-15
---

Hyper Estraierとpaginateの組み合わせ。 ちなみに未だにwill_paginateを使ってます。ぬるくてすいません。 単に検索結果をpaginateしたいだけなら
    
    
    Item.paginate(params[:query], :page => params[:page], :per_page => 10, :total_entries => Item.count_fulltext(params[:query]), :finder => 'fulltext_search')
    

でいいんだけど、その他の条件を加えるととたんに面倒になる。 ログインしている時以外は、公開ビット（Item.pub)の立ってるエントリだけをヒットするようにしたかったんだが、こんなになってしまった。
    
    
    ids = Item.matched_ids(params[:query])
    unless logged_in?
    Item.paginate(:page => params[:page], :per_page => 10, :conditions => ["#{Item.table_name}.id IN (?) AND #{Item.table_name}.pub = ?", ids,  true])
    end
    

（else以下は略）

ダサい。猛烈にダサい。困った。 pub:boolが邪魔な気もするけど、他に代案もないし。うーん。
