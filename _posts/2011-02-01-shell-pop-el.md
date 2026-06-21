---
layout: post
title: "shell-pop.el"
date: 2011-02-01
---

[新年の記事](<http://blog.larus.jp/?p=342>)で[Visor](<http://visor.binaryage.com/>)便利！と書いたけど、Emacs上で同じようなことをするelispがあった。 [shell-pop.el](<http://www.emacswiki.org/emacs-en/ShellPop>)を使うと、Emacsのどこからでもホットキーでshell-modeあるいはansi-termを呼び出し、もう一度ホットキーを押すと閉じることができる。 ちょっとだけコマンド実行したい時に便利。 こんな感じで設定している。
    
    
    ;; shell-pop with ansi-term
    (require 'shell-pop)
    (shell-pop-set-internal-mode "ansi-term")
    (shell-pop-set-internal-mode-shell shell-file-name)
    
    (defvar ansi-term-after-hook nil)
    (add-hook 'ansi-term-after-hook
    (function
    (lambda ()
    (define-key term-raw-map "\C-z" 'shell-pop))))
    (defadvice ansi-term (after ansi-term-after-advice (arg))
    "run hook as after advice"
    (run-hooks 'ansi-term-after-hook))
    (ad-activate 'ansi-term)
    
    (global-set-key "\C-z" 'shell-pop)
    

C-tに設定する人が多いようだけど（Terminalだろう）、C-tは分割フレーム間の移動に割り当てているのでC-z（Zsh）にした。 デフォルトのC-z（Minimize）は使わない、と言うかうっかり触って最小化することが多いので無効にしてるし。ああでも-nwで起動した時はScreenとぶつかって邪魔だから何か考えないと…

なお、Cocoa Emacsだとなぜか画面半分くらいで折り返されてしまって使いにくい。 font spacingの問題っぽいんだけど、解決策は今のところ不明。
