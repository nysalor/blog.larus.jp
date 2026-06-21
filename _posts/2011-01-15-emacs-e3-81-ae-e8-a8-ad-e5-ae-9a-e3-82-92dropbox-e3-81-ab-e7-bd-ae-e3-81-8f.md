---
layout: post
title: "Emacsの設定をDropboxに置く"
date: 2011-01-15
---

emacsの設定はプラットフォームごとにまちまちで、統合したいなーといつも思っていた。 一時期gitで管理したりもしたんだけど、設定をいじる→リポジトリに登録→push→各プラットフォームでpullという作業があまりにも煩わしく、ついついおろそかになってしまう。 ここらへんを自動化すべく、elisp群をDropboxに置いてみた。

**Mac/Linux** .emacs.dをsymlinkにすると動作がおかしいので、~/elispとか適当なディレクトリを読みに行くようにして、ln -s Dropbox/elisp ~/elispとしておく。 **Windows** symlinkの代わりにショートカットを置いても動作しないので（このへん実に融通が効かない）、代わりにWindows7のハードリンクを使ってみる。Vista以前の人は自分で考えて下さい、すいません。
    
    
    mklink /d C:\Users\name\Dropbox\elisp %HOME%\elisp
    

こんな感じ。

なお、分岐部分はこんな感じにした。
    
    
    ;; プラットフォームを判定して分岐する
    (cond
     ((string-match "apple-darwin" system-configuration)
      (load "~/elisp/etc/cocoa.el")
      (load "~/elisp/etc/unix.el")
      )
     ((string-match "linux" system-configuration)
      (load "~/elisp/etc/linux.el")
      (load "~/elisp/etc/unix.el")
      )
     ((string-match "freebsd" system-configuration)
      (load "~/elisp/etc/freebsd.el")
      (load "~/elisp/etc/unix.el")
      )
     ((string-match "mingw" system-configuration)
      (load "~/elisp/etc/windows.el")
      )
     )
    

ここで悩んだのがバイトコンパイルの扱い。 プラットフォームをまたいでもバイトコンパイルしたlispは動作するだろうか？ 当初、elcだけ別のディレクトリに置くとか、ディレクトリツリーをそっくり複製してelcだけ移動するスクリプトを書くとか考えたが、どうもうまい手が思いつかないので、普通にそのまま（バイトコンパイルしたファイルも共通）にしてみたところ、特に問題なく動いた。もちろんEmacsのバージョンが全て共通でなければならないけど… とりあえず23.2.90@Macと23.2.1@NTEmacsでは問題ないようだ。23.1@Linuxではうまく動いてないけど、これは互換性の問題だろう。（さっさと23.2にします、はい）
