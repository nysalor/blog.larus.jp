---
layout: post
title: "rspec-mode"
date: 2011-01-26
---

rails-modeは使ってない（rinari派）ので入れてなかったんだけど、ふと思い直してrspec-modeを入れてみたら便利すぎた。 describeとかitにカーソルを持って行ってC-c , s とやるだけでそのエクスペクテーションが実行される。 今までターミナルに移っていちいちspec -lineとかやってたのが馬鹿みたいだ。 ただし、デフォルトだとrake specが走るので、
    
    
    (require 'rspec-mode)
    (custom-set-variables '(rspec-use-rake-flag nil))
    

とやって無効にしておくと良い。
