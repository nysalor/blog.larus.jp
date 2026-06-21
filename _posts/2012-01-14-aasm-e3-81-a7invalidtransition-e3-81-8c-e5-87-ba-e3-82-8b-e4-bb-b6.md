---
layout: post
title: "AASMでInvalidTransitionが出る件"
date: 2012-01-14
---

[AASM](<https://github.com/rubyist/aasm>)をアップデートしたら、テストで例外が出るようになった。 正しくない状態遷移を行うと例外を返すようになったらしい。 AASMの初期化オプションに:whiny_transitions => falseを与えてやればいい。 以下は例。
    
    
    aasm :column => :aasm_status, :whiny_transitions => false do
      state :prepared, :initial => true
      state :queued
    　state :accepted
    ...
      event :accept do
        transitions :to => :accepted, :from => [:queued]
      end
    ...
    end
    

この例だと、whiny_transitionsがtrueならpreparedから直接accept!とかすると例外を投げる。 以前は単に遷移せずpreparedのままだった。

まぁ、例外を投げるのが正しい動作だとは思う。[作者もそう言ってるみたい](<https://github.com/rubyist/aasm/issues/40>)。 あくまで既存のコードをいじりたくない場合ってことで。
