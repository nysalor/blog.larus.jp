---
layout: post
title: "all your base are belong to us"
date: 2010-10-20
---

あらすじ： git commit、git pushして作業終了 ↓ 翌日、最後のcommitが気に入らなくなってgit checkout HEAD^ ↓ そのまま作業終了、commit ↓ fast-forwardでpushできない！ ↓ 昨日のことを忘れてmergeしたらconflictの嵐 ↓ ＼(^o^)／

解決編：
    
    
    git branch dummy origin/working
    git checkout dummy
    git revert xxxxxxxx
    git checkout working
    git rebase dummy working
    git push origin working
    

現在のorigin/workingを元にdummyブランチを切り、戻したい段階に戻ってからworkingにrebase。

教訓： むやみにpull originしたりmergeするのはやめて、rebaseを使うべし。

最後に、origin/masterの変更をworkingに適用する手順をまとめておく。
    
    
    git checkout master
    git pull origin master
    git checkout working
    git rebase master
    # conflictがある場合ここで表示されるので編集
    git add path/to/conflicted_file
    git rebase --continue
    # conflictの数だけ繰り返し
