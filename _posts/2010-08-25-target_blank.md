---
layout: post
title: 'target="_blank"'
date: 2010-08-25
---

今時target=”_blank”なんてやってると笑われるので、JavaScriptで実装する方法。 ぐぐると色々なやり方があるようだけど、例えばRailsのerbだと [html] <%= link_to(“新しいウィンドウで開く”, “http://blog.larus.jp/”, :popup => true) %> [/html] のようにhelperが用意されてて、出力されるのは以下のようなhtmlになる。 [html] [新しいウィンドウで開く](<http://blog.larus.jp/>) [/html] もちろんJavaScriptが無効になってるとそのウィンドウで開いてしまうのだけど、リンクが機能しないわけでもないからいいか。
