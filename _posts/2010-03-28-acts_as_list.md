---
layout: post
title: "acts_as_list"
date: 2010-03-28
---

任意に並び替えがしたいナリ、とお客さんに言われたので、acts_as_listを使ってみた。 使い方はほぼこちらの通りでOK。簡単簡単。 <http://tobysoft.net/wiki/index.php?Ruby%2FRuby%20on%20Rails%2Facts_as_list> 最初あるいは最後のエントリかどうかは、model.first?とかmodel.last?で取れる（view内でとても便利）。ただし常時n+1問題が発生するので、頻繁に並び替えるような用途では危険。

ついでに、ソートしてpositionを付け直す機能の実装でちょっと悩む。 普通にmove_to_bottomを使って
    
    
    items.each do |item|
    item.move_to_bottom
    end
    

とかやると、positionの値が現在の最後+1から付け直されてしまう（当たり前だけど）。機能的には何ら問題ないけど、ソートするごとにpositionが増えていって気持ち悪い。 acts_as_listのソースを読んで、
    
    
    items.each_with_index do |item, index|
    item.insert_at(index+1)
    end
    
    

なんてコードを書いてみたら、positionが[1,1,1,1,5,5,5…]みたいな面白い並びになってしまった。ガッデム。 色々試行錯誤したけど、単純に
    
    
    items.each_with_index do |item, index|
    item.update_attributes(:position => index + 1)
    
    end
    
    

で良かった。KISSですな。
