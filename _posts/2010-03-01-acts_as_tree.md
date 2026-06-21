---
layout: post
title: "acts_as_tree"
date: 2010-03-01
---

acts_as_treeを使ったモデルで
    
    
    def branch 
      branch = [self] 
      if self.parent 
        branch.concat(self.parent.branch) 
      end 
      branch 
    end 
    

みたいなメソッドを定義して、model.branchでツリーをモデルオブジェクトの配列で返す（パンくずリンクなんかに使う）ようにしてたんだけど、何故かparentが自分自身になってるレコードがあって、無限参照でスタックオーバーフローを起こしていた。どうしてこうなった… unless self.parent == selfを入れて解決。 しかしサービスイン前に発覚してよかった。冷や汗物であった。
