---
layout: post
title: "NTFS on Snow Leopard"
date: 2010-04-12
---

Snow LeopardでNTFSを読み書き可能マウントする方法。

デフォルトだとread onlyなんだけど、内部的にはrw可能になっている。 UIDをfstabに書いてやるというのが一般的なやり方だけど、これだとディスクが増えるごとに書き加えないといけない。 そこで、/sbin/mount_ntfsをmount_ntfs.binにリネームして、mount_ntfsという名前のシェルスクリプトを書いてしまう。内容は以下の通り。
    
    
    #!/bin/sh
    /sbin/mount_ntfs.bin -o rw "$@"
    
    

これで問題なく読み書きできる。

セキュリティアップデートでmount_ntfsが書き換わって動作しなくなってたのでメモ。
