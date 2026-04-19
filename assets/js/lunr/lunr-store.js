var store = [{
        "title": "acts_as_tree",
        "excerpt":"acts_as_treeを使ったモデルで  def branch    branch = [self]    if self.parent      branch.concat(self.parent.branch)    end    branch  end   みたいなメソッドを定義して、model.branchでツリーをモデルオブジェクトの配列で返す（パンくずリンクなんかに使う）ようにしてたんだけど、何故かparentが自分自身になってるレコードがあって、無限参照でスタックオーバーフローを起こしていた。どうしてこうなった…  unless self.parent == selfを入れて解決。 しかしサービスイン前に発覚してよかった。冷や汗物であった。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/acts_as_tree.html",
        "teaser":null},{
        "title": "push",
        "excerpt":"pushが破壊的メソッドなのをうっかり忘れててえらい目にあった。  定数の配列の最後に引数を追加して返すメソッドを  FixArray.push(param)   とか書いてた。その結果mongrelのインスタンスごとに定数が異なり、リロードされると配列がどんどん長くなるという怪奇現象が発生。我ながらなんて恐ろしいことを…  new_array = FixArray + [param]   でおｋですね。おｋだよな…？ 基本的すぎるミスで深く反省。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/push.html",
        "teaser":null},{
        "title": "あああ",
        "excerpt":"&lt;%= javascript_include_tag(:all, :cache =&gt; true) %&gt;   としてあると、  config.action_controller.perform_caching = false の状態では表示がおかしくなる。 （lightboxのモーダルウィンドウが出っぱなしになる）  どうにも原因不明なので、諦めてdevelopment環境でもキャッシュを有効にして作業してたんだが、viewをいじったりするたびにいちいちキャッシュを削除するのが激しくめんどくさいのできちんと調べてみた。   めんどいのでいきなり結論。  :cache =&gt; trueだとall.js（デフォルト）というJavaScriptを一つにまとめたファイルが生成されるんだけど、これが残ったままキャッシュを無効にするとall.jsまで読み込もうとしておかしくなる。  キャッシュまわりの開発のため一時的に有効にした時に生成されていた（そしてそのままgitリポジトリに取り込まれていた）のが残ってたらしい。  まぁ、考えたら当たり前なんだけど…  .gitignoreに加えておこう。 ついでに教訓。git commit -aする時はよーく考えてからにしよう…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/e3-81-82-e3-81-82-e3-81-82.html",
        "teaser":null},{
        "title": "伽藍とバザール",
        "excerpt":"Emacsの調子が悪いので作り直すことにした。  が、Emacsのリポジトリが移行したので、cvsだと23.0までしか取得できない。ちなみに新しいSCMはbazaar。なんでそんなマイナーなの使うんだ…gitでいいじゃん。まぁいいか。  http://wiki.bazaar.canonical.com/MacOSXDownloads  から入手してインストール。GUIつきだけどコマンドラインから起動する。  % bzr explorer  で起動、http://bzr.savannah.gnu.org/r/emacs/trunkをチェックアウト。でもって例によって  % patch -p0 &lt; ../emacs-inline.patch  % ./configure –with-ns –without-x  % make bootstrap  % make install  でビルド、nextstep/Emacs.appをApplicationsに入れてやればＯＫ。  特に問題なく動いているようだ。  バージョンも24.0.50になってEDGEって感じ。   この後調子悪いので23.1.93に落としました。orz  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/e4-bc-bd-e8-97-8d-e3-81-a8-e3-83-90-e3-82-b6-e3-83-bc-e3-83-ab.html",
        "teaser":null},{
        "title": "n+1",
        "excerpt":"いくつか残っていたn+1問題を解決するために、:includeをごりごり挿入。  以下メモ。  普通のinclude :include =&gt; :item  複数include :inluce =&gt; [:item, :another, :yetanother]  関連先もinclude :inluce =&gt; [{:item =&gt; :related_items}, :another]  acts_as_treeを使ってると、:include =&gt; :childrenで子ツリーを先読みできた。すばらしい。 （has_manyの時はちゃんと複数形にすること）  注意点として、:throughで中間テーブルを使って、かつ関連先が削除されていた場合、 @item.related_itemsだと削除済みのエントリは読み込まれないけど、Item.find(:all, :include =&gt; :related_items)にしてると配列にnilが入ってしまい、関連先の処理をしようとしたところで怒られてしまう。（お約束のnil class発生） 回避するためには中間テーブルに:dependent =&gt; :destroyを付けておかないといけないが、不幸にしてやってなかった場合には手でテーブルを編集するか、@item.related_items.compact.eachとかダサいことをしなくてはならない。しょんぼり。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/n1.html",
        "teaser":null},{
        "title": "消える世界",
        "excerpt":"エントリが次々destroyされる謎の現象が発生。 すわMySQLがいかれたか、あるいはメモリが尽きて誤動作でもしてるのかと思ってパニクったけど、何のことはないhas_manyしている側のmodelになぜか:dependent =&gt; :destroyが入っていた…  どう見てもケアレスミスです。本当にありがとうございました。  どういうことかと言うと、関連元のエントリをdestroy→関連先のエントリがdestroyされる→同じエントリを参照してる関連元のエントリがdestroy→…という死の連鎖が起こってしまったのだった。おそろしい。  しかもfragment cacheがあったために（関連先を共有してるmodelにまでsweeperが働かないので、cacheは残り続けた）表面上は何事もないまま内部が壊死していくというホラー。あはははは。 サービスインした後だったら首吊ってた。動き出してからmodelなんていじらないけどさ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/e6-b6-88-e3-81-88-e3-82-8b-e4-b8-96-e7-95-8c.html",
        "teaser":null},{
        "title": "We've got company",
        "excerpt":"メール受信がタイムアウトしたので、何かトラブルかと思ってサーバにsshしたら、プロンプトが出るまで数分かかった。  何か刺さってるのかとtopを見たが特にCPU食ってるタスクもない。メモリ使用量の多いタスクを止めようとして、いつもの調子で/usr/l→TABとかやったら固まる（１分後くらいに反応）。な、何が起きている！？  ひとまず落ち着いてtail /var/log/messages…また固まった。今度は何分待っても出てこない。C-c連打でやっとプロンプトに返ってきた。  再起動…が一瞬頭をよぎるが、もし再起動に失敗したらNOCの主が帰ってくるまでどうしようもなくなる。  祈るようにdmesg。今度は反応があった。そこには  ad4: FAILURE - READ_DMA status=51&lt;READY,DSC,ERROR&gt; error=40 LBA=8  g_vfs_done():ad4s1e[READ(offset=23891902464, length=16384)]error = 5  がびっしりと…うわああああ。  ついにディスクが逝ったか…と思ったけどよく見るとoffsetの値は全部同じ。どうやら全面的に壊れたわけではなさそうだ。要するに破損したセクタを読み込もうとして固まっている様子。  offset=23891902464, length=16384はそれぞれ単位がbytesなので、512で割って46663872番目から32セクタがいかれてると思われる。  とりあえずddで破損セクタをサーチ。  dd if=/dev/ad4s1e of=/dev/null skip=46663872 count=32 conv=noerror  案の定先ほどのエラーがコンソールに出るが、他に破損セクタはなく終了。んじゃbadsectするか…と思ったが、この時点で反応が正常に復帰。先ほどのddをもう一度実行すると、今度はノーエラーで終了した。どうやらhdd自身のセクタ代替機能が働いて回避するようになったらしい。  念のためsmartmontoolsをインストールして、  smartctl -A /dev/ad4  を実行してみると、Reallocated_Sector_Ctが173。173セクタほど破損しているようだ。幸い、断末魔の叫びであるSpin_Retry_Countはゼロなので、今日明日壊れるということもない様子。まぁ、不安だから早めに交換しよう…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/weve-got-company.html",
        "teaser":null},{
        "title": "リポジトリ再構築",
        "excerpt":"gitのリモートリポジトリがおかしくなったので仕切り直し。  ディレクトリ切ってそこに移動して  % git init –bare  でもって作業側で  % git remote add origin ssh://xxx.com/src/product  % git push origin master  これだとリモートにはリポジトリしかないから、cloneするまでファイルは見れないんだけどね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/e3-83-aa-e3-83-9d-e3-82-b8-e3-83-88-e3-83-aa-e5-86-8d-e6-a7-8b-e7-af-89.html",
        "teaser":null},{
        "title": "_blankが許されるのはHTML3.0までだよねー",
        "excerpt":"リンクを新しいウィンドウで開くのにtarget = “_blank”はダサいしjavascript書くか、と思ってたけど、link_toに:popup =&gt; trueを付けるだけであとは勝手にやってくれるのね。知らなかった。  あと、1バイト文字と2バイト文字（UTFだから3バイト文字か？）の混在する環境で一定バイト数以下の文字列を切り出す方法。自分で実装したのよりリファレンスマニュアルの方がスマートだった。  def jleft(len)  return \"\" if len &lt;= 0  str = self[0,len]  if /.\\z/ !~ str  str[-1,1] = ''  end   ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/_blank-e3-81-8c-e8-a8-b1-e3-81-95-e3-82-8c-e3-82-8b-e3-81-ae-e3-81-afhtml3-0-e3-81-be-e3-81-a7-e3-81-a0-e3-82-88-e3-81-ad-e3-83-bc.html",
        "teaser":null},{
        "title": "acts_as_list",
        "excerpt":"任意に並び替えがしたいナリ、とお客さんに言われたので、acts_as_listを使ってみた。 使い方はほぼこちらの通りでOK。簡単簡単。 http://tobysoft.net/wiki/index.php?Ruby%2FRuby%20on%20Rails%2Facts_as_list 最初あるいは最後のエントリかどうかは、model.first?とかmodel.last?で取れる（view内でとても便利）。ただし常時n+1問題が発生するので、頻繁に並び替えるような用途では危険。   ついでに、ソートしてpositionを付け直す機能の実装でちょっと悩む。 普通にmove_to_bottomを使って   items.each do |item| item.move_to_bottom end   とかやると、positionの値が現在の最後+1から付け直されてしまう（当たり前だけど）。機能的には何ら問題ないけど、ソートするごとにpositionが増えていって気持ち悪い。 acts_as_listのソースを読んで、    items.each_with_index do |item, index| item.insert_at(index+1) end    なんてコードを書いてみたら、positionが[1,1,1,1,5,5,5…]みたいな面白い並びになってしまった。ガッデム。 色々試行錯誤したけど、単純に    items.each_with_index do |item, index| item.update_attributes(:position =&amp;gt; index + 1)  end    で良かった。KISSですな。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/03/acts_as_list.html",
        "teaser":null},{
        "title": "ありがちなミス",
        "excerpt":"メール送信用のcontrollerを書いていて、謎の「wrong number of arguments (1 for 0)」で何時間も悩む。 controllerに不備はないし、そもそもメソッド内にdebuggerを仕掛けても実行が止まらない。なんなんだこれ。   答えは、うっかりsendというメソッドを作ってしまっていたことだった… 超初歩的なミスなんだけど、直接エラーに出てこないから全然気が回らなかった。 なお、メールまわりの開発時はmocksmtpd http://d.hatena.ne.jp/koseki2/20081103/mocksmtpd を使うととても便利です。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e3-81-82-e3-82-8a-e3-81-8c-e3-81-a1-e3-81-aa-e3-83-9f-e3-82-b9.html",
        "teaser":null},{
        "title": "移転",
        "excerpt":"ずっとmixiに書き散らしていましたが、技術ネタはこっちへ移動します。   プライベートや趣味の話はmixiへどうぞ。   技術ネタはRoR中心になるかと思います。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e7-a7-bb-e8-bb-a2.html",
        "teaser":null},{
        "title": "Railsで404を表示させる方法",
        "excerpt":" render :file=&amp;gt;\"#{RAILS_ROOT}/public/404.html\", :status=&amp;gt;'404 Not Found'    これで例えばログインしてる時だけ表示して、してない時は４０４とかできる。 しかし泥臭いコードだなぁ。もっとすっきり書けないものか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/rails-e3-81-a7404-e3-82-92-e8-a1-a8-e7-a4-ba-e3-81-95-e3-81-9b-e3-82-8b-e6-96-b9-e6-b3-95.html",
        "teaser":null},{
        "title": "サイトマップ生成",
        "excerpt":"google webmaster tool用のサイトマップを生成する方法。 と言うかいつの間にかサイトマップは標準仕様ができているようで、google/yahoo/msn(bing)で共通にできるようだ。 サイトマップの作成はほぼこの通りでＯＫ。感謝感謝。 http://brass.to/blog/sitemap_xml_by_rails2_0.html んでgoogle webmaster toolやyahoo site explorerにsitemap.xmlを登録してくるだけ。   あとは自動的にクロールしてページを拾ってくれる。動的生成なのでコンテンツを追加しても特に何もする必要なし（コントローラを追加したりしたら必要だけど）。便利だ。 ちなみにmsnはツールが存在しないっぽいので、link relを書いておくしかない。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e3-82-b5-e3-82-a4-e3-83-88-e3-83-9e-e3-83-83-e3-83-97-e7-94-9f-e6-88-90.html",
        "teaser":null},{
        "title": "Cocoa Emacsが落ちまくる件",
        "excerpt":"Snow LeopardにしてからCocoa Emacsがボロボロ落ちてるんだけど、どうもオートセーブとIMEの変換がぶつかった時に起きるような気がしてきた。   [text]   (setq auto-save-interval 0) (setq auto-save-timeout 30)   [/text]   で３０秒おきに保存させていたが、これを [text]   (setq auto-save-interval 100) [/text]   だけにして入力回数で保存に切り替えてテスト中。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/cocoa-emacs-e3-81-8c-e8-90-bd-e3-81-a1-e3-81-be-e3-81-8f-e3-82-8b-e4-bb-b6.html",
        "teaser":null},{
        "title": "limechatのマクロからrubyのコードを呼び出す方法",
        "excerpt":"ただしWindows版。 Cocoa版はマクロ未対応だっけ。 limeruby.dll http://wirepuller.org/text/ruby/arc/limeruby_071010.zip をダウンロード、limechat/users/[name]/macros/filesに入れる。 同じフォルダにtest.rbとかを置いて、マクロの「動作の情報」に   [text]   $DllString(limeruby.dll,ruby,test.rb)   [/text]   でOK。メッセージを引数にしたいなら   [text]   $DllString(limeruby.dll,ruby,test.rb %0)   [/text]   （%0～%9はメッセージをsplit(/ /)したもの） STDOUTが返ってくるだけなので、エラー発生させるとめんどくさいことになります。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/limechat-e3-81-ae-e3-83-9e-e3-82-af-e3-83-ad-e3-81-8b-e3-82-89ruby-e3-81-ae-e3-82-b3-e3-83-bc-e3-83-89-e3-82-92-e5-91-bc-e3-81-b3-e5-87-ba-e3-81-99-e6-96-b9-e6-b3-95.html",
        "teaser":null},{
        "title": "Urchin",
        "excerpt":"を設定しようとしたけど、途中でめんどくさくなってGoogle Analyticsに逃げた。 レポートもきれいだし、Railsならlayoutにコード埋め込むだけだし、やっぱクラウドっすよクラウド。 反映が遅いけど、まぁ月次レポートがありゃ十分。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/urchin.html",
        "teaser":null},{
        "title": "301 moved",
        "excerpt":"mod_proxyでmongrelに飛ばしてる環境下で、301でリダイレクトしたいんだけどhttpd.confに書いても成功しない。   （当然だけど、ディレクティブを無視してmongrelに丸投げされてしまう） rails内で301にするには    redirect_to(url_for(:controller =&amp;gt; \"items\", :action =&amp;gt; \"index\"), :status =&amp;gt; 301)    とすればいいらしい。（:statusを付けないと302になるので注意） 要するに古いURLを辿ってくる人が多いから誘導したいだけなんだけどね…もっとkoolな解決策はないものか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/301-moved.html",
        "teaser":null},{
        "title": "NTFS on Snow Leopard",
        "excerpt":"Snow LeopardでNTFSを読み書き可能マウントする方法。   デフォルトだとread onlyなんだけど、内部的にはrw可能になっている。 UIDをfstabに書いてやるというのが一般的なやり方だけど、これだとディスクが増えるごとに書き加えないといけない。 そこで、/sbin/mount_ntfsをmount_ntfs.binにリネームして、mount_ntfsという名前のシェルスクリプトを書いてしまう。内容は以下の通り。    #!/bin/sh /sbin/mount_ntfs.bin -o rw \"$@\"   これで問題なく読み書きできる。   セキュリティアップデートでmount_ntfsが書き換わって動作しなくなってたのでメモ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/ntfs-on-snow-leopard.html",
        "teaser":null},{
        "title": "全文検索 on Rails",
        "excerpt":"railsで全文検索するのに、LIKEを使うだけのぬるーい実装をしてたんだけど（SQLをごりごり書こうとしたらこんがらがったのでやめた）、もうちょっとスマートにやる方法を考えてみる。 色々調べたところ、Hyper Estraierとsearch_doプラグインを使うのが一般的らしい（と言っても情報は少なめ）。   というわけで既存のプロジェクトで実験してみた。 基本的には http://d.hatena.ne.jp/shunsuk/20090406/1239020647 の通りで動いたけど、ノードについてはデフォルトのままmodel名を後にくっつける（xxxx_itemみたいな）形式にした。複数のmodelを検索する場合はその方が良いと思う。 キーワード一つだけの検索はすぐできたんだけど、ANDやOR検索がうまく行かない。search_doのドキュメントは放置状態で何もない。しょうがないのでプラグインのソースを読む。やっぱり分からない。（ダメじゃん） 答えはHyper EstraierのAPIドキュメントにあった。AND/OR/ANDNOTではなく、&amp;/|/!を使えば良かった。 ちなみにmodelを更新すると自動的にreindexされるので、sweeperに仕込んだりする必要はなかった。 他のクエリやwill_paginateと連動させる予定だけど、そのへんは次回。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e5-85-a8-e6-96-87-e6-a4-9c-e7-b4-a2-on-rails.html",
        "teaser":null},{
        "title": "hyper estraier + paginate",
        "excerpt":"Hyper Estraierとpaginateの組み合わせ。 ちなみに未だにwill_paginateを使ってます。ぬるくてすいません。 単に検索結果をpaginateしたいだけなら  Item.paginate(params[:query], :page =&amp;gt; params[:page], :per_page =&amp;gt; 10, :total_entries =&amp;gt; Item.count_fulltext(params[:query]), :finder =&amp;gt; 'fulltext_search')   でいいんだけど、その他の条件を加えるととたんに面倒になる。 ログインしている時以外は、公開ビット（Item.pub)の立ってるエントリだけをヒットするようにしたかったんだが、こんなになってしまった。  ids = Item.matched_ids(params[:query]) unless logged_in? Item.paginate(:page =&amp;gt; params[:page], :per_page =&amp;gt; 10, :conditions =&amp;gt; [\"#{Item.table_name}.id IN (?) AND #{Item.table_name}.pub = ?\", ids,  true]) end  （else以下は略）   ダサい。猛烈にダサい。困った。 pub:boolが邪魔な気もするけど、他に代案もないし。うーん。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/hyper-estraier-paginate.html",
        "teaser":null},{
        "title": "さて",
        "excerpt":"とりあえず４月分の技術ネタ一式をmixiからコピペしました。   ３月以前のもぼちぼちコピペしていこうと思うけど、あんま過去まで遡ると恥ずかしいコードを公開してしまうので価値のあまりない古い情報まで載せてしまうので適当なところでやめます。   ちなみにタイトルはイタリア語です。意味はググれ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e3-81-95-e3-81-a6.html",
        "teaser":null},{
        "title": "WordPress",
        "excerpt":"外部ブログを使おうと思って色々見て回ったけど、自分で色々試したいので自前のサーバでWordPressを運用することにした。 と言うわけでプラグインを入れまくる。   まず、ソースを書いたりしたかったのでsyntax highlighter http://wppluginsj.sourceforge.jp/syntax-highlighter/ 入れてから気づいたけどLISPに対応してない。がーん。いや.emacsくらいしか書きませんけど。   誰も気づいてくれないと寂しくて死んじゃうのでGoogle XML Sitemap http://www.arnebrachhold.de/redir/sitemap-home/   素敵な本を紹介したいので（棒読み）Amazon Widget Shortcodes http://case.oncle-tom.net/code/wordpress/   実は使い方がよく分かってないので試しに貼ってみよう。   [amazon-product]4839929548[/amazon-product]   お、でけた。   最後にtwitterの公式ウィジェットをsidemenuに埋め込んで終わり。 →ウィジェットから「テキスト」で貼り付けるように変更。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/wordpress.html",
        "teaser":null},{
        "title": "王様のbranch",
        "excerpt":"gitのブランチでちょっとハマった。 % git checkout -b ng でブランチを切ってコミットして % git push origin ng でリモートに投げる。ここまでは良かった。 んで他のマシンに移って % git pull origin ng したらmasterにmergeされてしまった！がーん。   他のリポジトリにブランチとして取り込むには、いったん % git checkout -b ng してからpullすれば上手くいくんだけど、いちいちローカルでも同じ操作するって変じゃないか？ なんか勘違いしてそうだなぁ。ううむ。 ちなみにmergeする前に戻すには、git logでハッシュタグを調べてから % git reset –hard [ハッシュタグ] でおｋ。 % git checkout HEAD^ でもいいか。（戻すバージョンの数だけ^をつける）   rebaseとかgitらしい機能は全然使いこなせてないです。   [amazon-product]4798023809[/amazon-product]  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e7-8e-8b-e6-a7-98-e3-81-aebranch.html",
        "teaser":null},{
        "title": "でざぱた",
        "excerpt":"「Rubyによるデザインパターン」読了。 GoFを読んだこともないへたれプログラマですいません。 だいたいあの長ったらしい邦題（「オブジェクト指向における再利用のためのデザインパターン」だっけ？）はなんなの。冷凍食品とか台所用品じゃあるまいし。「おばあちゃんがじっくりコトコト煮込んだ炎上プロジェクト」みたいな。 閑話休題、この本は大変分かりやすいばかりか、ところどころにウィットに富んだジョークが散りばめられていて楽しく読めました。例えば、Compositeパターンの説明で、ケーキの製造工程を小麦粉一粒ずつまで分解するというくだりには吹き出してしまった（電車の中で）。技術書にそんなもんいらん、という気難しい人には逆につらいかも。 Rubyの基礎も一応説明してるけど、どっちかと言うと「Rubyを知ってる人にデザパタを解説する」本ですね、どう見ても。そうでないのは巻末のDSLとかCoCくらいか。   [amazon-product]4894712857[/amazon-product]  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e3-81-a7-e3-81-96-e3-81-b1-e3-81-9f.html",
        "teaser":null},{
        "title": "ローレンツ短縮",
        "excerpt":"最近、目を離すとWindowsのFirefoxがクラッシュしていることがよくあるので、改善を図ってFirefox 3.6.4 Lorentzをインストールしてみた。 ac版の方も3.6.4でプロセス分離が実装されたのかな？ acの方はクラッシュはしないけど、CPU使用率が跳ね上がったままになることが多いのでこっちも切り替えてみる。 今のところ、アドオンまわりで特に互換性問題は起きてない様子。     使用中の主なアドオン: AutoAuth Echogon Firebug Google Bookmarks Shorten URL SQL Optimizer Tab Mix Plus Xmarks XUL/migemo テキストリンク   クラッシュした時どうなるかはお楽しみ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e3-83-ad-e3-83-bc-e3-83-ac-e3-83-b3-e3-83-84-e7-9f-ad-e7-b8-ae.html",
        "teaser":null},{
        "title": "次元断層",
        "excerpt":"時報を見てからふとPCの時計を見ると、１分も進んでいた。 ルータ（FreeBSD）で動かしているntpdに合わせてるんだけども、ルータにsshしてdateしてみるとこっちも１分進んでいる。あれぇ？ とりあえずntpの状況を確認しようとntpq -p。 ntpq: write to localhost failed: Network is unreachable はいー？ なんだか分からないがntpdに障害が出ているようだ。調べたけどよく分からないので、ntpdを新しくしてみる。困った時のpsearchでnet/ntpがあるのを確認し、cd /usr/ports/net/ntp; make。 ntp-4.2.6p1-RC5.tar.gzが無いとか言われた。調べると２週間ほど前にRCが取れている。portsは更新されてないのか… クイックハック…はめんどくさいのでしない。幸いRC5をまだ置いてるサーバが見つかったのでそこから拝借。/usr/ports/distfilesに置いてさくっとmake。 でもってrc.confをこんな感じに修正。 ntpd_enable=\"YES\" ntpd_program=\"/usr/local/bin/ntpd\" ntpd_flags=\"-p /var/run/ntpd.pid\" 設定は/etc/ntpd.conf。本当は/etc/ntp/ntpd.confにしたかったんだけど、-cと-pを同時に受け付けてくれない。なぜだ。 内容は特に変えてないけど、こんな感じ。 driftfile /etc/ntp/ntp.drift logfile /var/log/ntpd.log server ntp1.jst.mfeed.ad.jp server ntp2.jst.mfeed.ad.jp server ntp3.jst.mfeed.ad.jp /etc/rc.d/ntpd restartで再起動。さて/usr/local/bin/ntpq -p… ntpq: write to localhost failed: Network is unreachable なんでじゃあああああああ！ 冷静にエラーメッセージを見てみよう。 localhostに到達できない。あははは、そりゃ大変ですねぇ。ねーよ。 念のためping...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/04/e6-ac-a1-e5-85-83-e6-96-ad-e5-b1-a4.html",
        "teaser":null},{
        "title": "IRC",
        "excerpt":"未だにIRCをけっこう使ってるんだけども、ここ数ヶ月様子がおかしい。 発言の多いチャンネル（にJOINしているサーバ）からランダムに切断されるようになってしまった。 正確には、クライアントが切断と判断して再接続するんだけど、サーバ側にはまだ自分が残っていて、しばらくするとtimeoutするという状態。 IRCクライアントの設定を色々いじったけど全く改善しないので、根本的に原因を調べることにした。 というわけでまずはWireShark（旧Ethereal）をインストールしてパケットを観察。うっかりHDDに残っていたEtherealをインストールしようとしてできなかったのは秘密だ。 フィルタを「ip.addr == xxx.xxx.xxx.xxx」（IRCサーバのアドレス）に設定。IRCクライアントの方もラウンドロビンのホストではなく、サーバを決め打ちに設定しておく。 そして流れの速いチャンネルに繋ぎ、じーっと観察。 5558 19:33:08.121560 192.168.xxx.xxx xxx.xxx.xxx.xxx TCP [TCP Retransmission] agentsease-db &gt; ircu [PSH, ACK] Seq=2650 Ack=61672 Win=65361 Len=47 が7回流れた後に切れた。パケットの中身は発言だったり、クライアントが定期的に送信しているCTCP PONGだったり色々。 どうもこちらから何かアクションを起こした時にTCPの再送を繰り返して、それが一定回数になるとクライアント側が切断してしまうらしい。 何度か見ていると、毎回7回再送→切断というパターンになっている。 次に、ルータ（FreeBSD）でtcpdumpを起動して調べてみる。ちなみにipfilterを使っているので、kernelは既にプロミスキャスモードが可能なようにコンパイルされている。 tcpdump -vv -l -n -i ng0 host xxx.xxx.xxx.xxx | tee tcpdump.log とかやってログを取りつつ観察。ちなみにng0はPPPoEドライバmpd4のインターフェイス名。 切断された時に、Wiresharkと付き合わせて同じシーケンス番号のパケットを探す。 19:33:06.599574 IP (tos 0x0, ttl 127, id...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/irc.html",
        "teaser":null},{
        "title": "お約束二点",
        "excerpt":"string.sub(/^No¥.(\\d+)/, \"#{$1}番目\")  とかやってもきちんと置換されない。 何故かと言うと、#{}の式展開は正規表現マッチの前に行われるから。  string.sub(/^No¥.(\\d+)/) {\"#{$1}番目\"}  とブロックに書き換えれば正しく置換される。   まぁ、お約束なんだけどいつも忘れた頃にハマるのでメモメモ。 gsubとかeachブロックとかでまとめて置換すると一見動いてるように見えたりして罠に陥るんだよね。   ついでにevalにコードを渡した時にrescueする方法。  begin   @result = eval(@code) rescue SyntaxError   @result = 'Error! (in Syntax)' end  明示的に例外を指定しないと捕まえてくれない。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/e3-81-8a-e7-b4-84-e6-9d-9f-e4-ba-8c-e7-82-b9.html",
        "teaser":null},{
        "title": "Cocoa Emacs23.2",
        "excerpt":" 正式版が出たのでビルドしてみた。 ミラーからファイルを探してきて % /configure –with-ns –without-x % make bootstrap % make install でもってnextstep/Emacs.appをApplicationsにコピーして終了。 cedetが標準搭載になったらしいけど（よく見ると23.1.92にも入ってた…）使い方がよく分からないので放置。   相変わらずnavi2ch使ってると落ちるなぁ。 2chブラウザだけ乗り換えるかな…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/cocoa-emacs23-2.html",
        "teaser":null},{
        "title": "ActiveRecordからfixtureを作る",
        "excerpt":"稼働中のDBからfixtureを生成したくなって色々調べてみた。 （csvでエクスポートすればいいじゃんとかいうのは却下） ar_fixturesプラグインが有名だけど、最近のRailsでは色々とめんどくさいらしい。 というわけでこちらの記事を参考に（というか丸写しで）やってみた。 実行するとschema_migrationsテーブルにidカラムがないよ、というエラー。 そりゃそうだよな、と思って改めてextract_fixtures.rakeを読むと（先に読めよ）  skip_tables = [\"schema_info\"]  という行がある。Rails2.1でschema_infoはschema_migrationsに変わっているので、この行を  skip_tables = [\"schema_migrations\"]  に変更すればおｋ。 あとはrake db:fixtures:extractで自動的に抽出してくれる。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/activerecord-e3-81-8b-e3-82-89fixture-e3-82-92-e4-bd-9c-e3-82-8b.html",
        "teaser":null},{
        "title": "Wordpressで画像がリサイズされない件",
        "excerpt":"なんつーかいっつもハマるので（３回目くらい）メモ。   画像をアップロードした後、「小中大」などのサイズが選択できない（オリジナルサイズしか選べない）場合はphp-gdが入ってない。 FreeBSDでphp5の場合、/usr/ports/graphics/php5-gdをインストールすればＯＫ。 今回は途中libpngで引っかかった（共有ライブラリpng.6が見つからないと出たが、これは以前のバージョンのlibpngが入っているためで、/usr/ports/graphics/pngをアップグレードするなりインストールし直すなりすればいい）。 なお、インストール後に/usr/local/etc/php/extensions.iniにextension=gd.soを追加しろと出てくるけど、portsで入れていれば自動的に追加されているはず。   ちなみに既にアップロードしたメディアはリサイズできないので（アップロードの時点でリサイズされているため）、php-gdを入れたらアップロードからやり直すべし。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/wordpress-e3-81-a7-e7-94-bb-e5-83-8f-e3-81-8c-e3-83-aa-e3-82-b5-e3-82-a4-e3-82-ba-e3-81-95-e3-82-8c-e3-81-aa-e3-81-84-e4-bb-b6.html",
        "teaser":null},{
        "title": "攻性防壁",
        "excerpt":"いや全然攻性じゃないんですが。 ftp関係のトラブルを調べている時、ftpにAdministratorというアカウントでアクセスを試みる不心得者がずっとアタックをかけていた。 気持ち悪いので、以前やっていたhosts.allowの設定を復活させることにした。 ごく簡単に、/etc/deny.listに拒否するIPをずらーっと書いて  sshd : /etc/deny.list : deny sshd : ALL : allow ftpd : /etc/deny.list : deny ftpd : ALL : allow  とかやればOK。 deny.listは今までアタックかけてきたIPをリストアップしてある。 一定回数以上連続でアタックされたら自動的に追加とかすると面白いような誤動作が怖いような。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/e6-94-bb-e6-80-a7-e9-98-b2-e5-a3-81.html",
        "teaser":null},{
        "title": "ffftpの怪",
        "excerpt":"ユーザから「ftpでファイル見えないぞゴルァ」というクレームが。 普段ftpを使ってない（sftpオンリー）なので気が付かなかった。 とりあえず仮ユーザを作成し、コマンドラインのftpで確認。普通に繋がる。 次に手持ちのNextFTPで確認。あれ、見える… 次にffftpで確認。ファイルが見えない。 あれぇ…     とりあえずお約束のPASVモードを確認。PASV有効、無効共にファイルは見えず。 ぐぐってみると（と言うかffftpのＱ＆Ａによると）、「LISTコマンドでファイル一覧を取得」をチェックしろと出ている。 試したがやはり見えず。うーん。 ffftpで同様の現象は多数見つかるのだが、ほとんどがLISTで解決している。 その中で、ffftpではなくDreamWeaverでの現象だが、ロケールがC以外だとタイムスタンプのフォーマットが違うためDreamWeaverのftp機能が正常に動作しない、というのがあった（AdobeのFAQ）。もしやこれか？ ロケール関連の情報を探したところ、さらに決定的な情報を発見。これか…   まとめると、原因は以下のようなものだった。   ・以前、一般ユーザからsuして/etc/rc.d/inetd restartを行った際、ユーザのロケール（LANG=ja_JP.eucJP）がinetdに引き継がれていた ・inetdから起動されるftpにもロケール（LANG=ja_JP.eucJP）が引き継がれていた ・ffftpはLANG=C以外のタイムフォーマットに対応していない→ファイルが見えなくなる   と言うわけでもっかいsuして、export LANG=Cしてから/etc/rc.d/inetd restartしたら治りました。 ffftpだけなんだよなぁこれ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/05/ffftp-e3-81-ae-e6-80-aa.html",
        "teaser":null},{
        "title": "WPTouch",
        "excerpt":"「すまーとふぉん」とかいうのがはやっているそうなので、このブログも対応してみました。 まぁ、WPTouchを入れただけなんだけどね。 iPod touchしか持ってないので動作確認はmobile safariのみです。   ついでにGoogleでホストされているjQueryを使う方法を参考に、テーマのヘッダ（header.php）に以下のコードを挿入。 [html]   [/html] これでJQueryが使えるようになる。 JQueryを有効にすると、スマートフォン用ページの最後に自動的に「Load more entries」ボタンが付いて、古いエントリをたどれるようになる。 「Mobile Theme」スイッチに触れるとPC用ページに切り替えてくれる（あんま使わないと思うけど）。 ちなみに元に戻すボタンは表示されたPC用ページの一番下。   さらに、せっかくJQueryを入れたのでjQuery Lightboxプラグインを入れて画像表示をモーダルウィンドウにしてみました。 まぁ、あんま画像ないけど。           ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/wptouch.html",
        "teaser":null},{
        "title": "たまには時事ネタでも",
        "excerpt":"人工衛星（衛星じゃないよね、ほんとは）「はやぶさ」の運用情報で、「（噴射を行う際には）先に噴射終了をスケジューリングする命令を発してから噴射開始をスケジューリングする」という話を聞いて面白いなぁと思った。 なぜそうするのかと言うと、何らかのトラブルが発生して二つ目の指令が受信されなかった場合、噴射開始だけがスケジューリングされていると燃料が尽きるまで噴射してしまうからだそうな。フェイルセーフですね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/e3-81-9f-e3-81-be-e3-81-ab-e3-81-af-e6-99-82-e4-ba-8b-e3-83-8d-e3-82-bf-e3-81-a7-e3-82-82.html",
        "teaser":null},{
        "title": "clamav",
        "excerpt":"先日、ウィルスメールの爆撃を受けた際に、ウィルスメールが自分のメールサーバとgmailの間でbounceしてしまい、メールボックスが「ウィルスバスターによって削除されました」で埋め尽くされるという悲劇が発生してしまった。 ちなみにメールは「Outlookのパスワードが変わったよ！添付のファイルを実行してね」というお約束な代物。 発信者を変えながら大量に送ってきた？模様。 元の発信者やなんかがウィルスバスターに消されてしまっているため、bounceを止めるまでに手間取ってしまった。 再発を防ぐため、いったん止めていたメールサーバ上でのウィルススキャンを再開することにした。     portsからclamavを入れ直し、clamd-clamdとclamav-freshclamを起動してから、.procmailrc postfixからamavisd経由で実行するのがセオリー？だが、ここは敢えて.procmailrcの先頭に入れておく。  VIRUS=$HOME/Mail/virus`date +%y%m` :0 HB * ? /usr/local/bin/clamdscan -m --quiet - ;test $? = \"1\" $VIRUS  これでclamdscanでクロと出たメールはファイルに保存され、以後のレシピ（gmailへの転送など）は適用されない。 postfixから実行する場合と異なり、clamdが落ちても以後のレシピは正常に処理される、はず。 刺さってるとだめかも…   メールもGAE使ったりした方が楽なんだろうけど、他のユーザもいるからなぁ。 全員gmail取って下さいってのもありっちゃありか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/clamav.html",
        "teaser":null},{
        "title": "Members Only",
        "excerpt":"Wordpressで作ったブログを非公開にする方法。 （もちろんこのブログではやってません） とりあえず.htaccessでBASIC認証にしてみたが、この方法だとフラッシュアップローダが使えないという制約がある（ブラウザによってはフリーズしてしまう）。 というわけでもう少しスマートに、Wordpressの認証を使うようにしてみる。 phpを直接書き換える方法もあるが、Registered Users Onlyというそのまんまなプラグインがあるので頼ることにした。 これをインストールすると、閲覧しようとしただけで認証を求めるようになる。 警告メッセージを日本語化するには、75行目の$errorの中身を書き換え…てしまったけど今みたらtemplate.poっていう国際化対応っぽいファイルがあった。こっちをいじった方がスマートかも知れない。まぁいっか。   ついでにTwitpressで更新情報をTwitterに投げるようにしたけど、ちゃんと動作するかな…しませんね。ちぇ。 追記。php5-curlをインストールしてapacheを再起動したら動作しました。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/members-only.html",
        "teaser":null},{
        "title": "ルータ交換、そして",
        "excerpt":"IRCが切断されまくる件についての続編。 ルータ−モデム間のLANケーブルと電話線を全て交換したが解決しないので、次の一手としてルータを変更してみることにした。 ルータはFreeBSDで運用していたが、無線APとして使っているバッファローのWZR-HP-G300NHにルータ機能が付いているので、これを有効にして切り替える。 原因が他にあった場合は元に戻せるよう、ネットワークにはあまり手を加えたくない。 というわけで、DHCPやDNS（unboundで運用中）はそのままに、デフォルトゲートウェイのみをWZR-HP-G300NHに移行する。    まず、WZR以下略のルータ機能を復活させる。切り替えスイッチ一つで有効・無効にできる（WANポートの信号の有無を見て自動的に切り替えるAUTOもあり）が、有効にしたところLAN側のIPアドレスが自動的にデフォルトの192.168.1.1になってしまった。我が家のネットワークとはセグメントが違うので、いきなりここでつまずく。ちなみにルータ機能を有効にするとLAN側IPアドレスをDHCPで取得することはできない。何なのこの仕様。 PCのIPアドレスを一時的に変更して対処し、とりあえず外には出れるようにした。 次にFreeBSD側の設定変更。rc.confの以下の項目を全部NOに書き換える。  # ゲートウェイ gateway_enable=\"NO\" # mpd(pppドライバ) mpd_enable=\"NO\" # ipfilter ipfilter_enable=\"NO\" # NAT ipnat_enable=\"NO\" # linux igd(uPnPデーモン) linuxigd_enable=\"NO\"  さらにdefaultrouterをWZR略のアドレスに変更して、面倒なので再起動…すると応答がなくなった。あれぇ。 起動はしているようだったので、普段繋げてないキーボードを繋いで確認。 ifconfigしてみると、UPになってはいるもののLAN内のどこにも到達できない。 自分自身のアドレスにも到達不可。なんとlocalhostにすら到達しない！ 小一時間ほどパニクったが、答えは簡単だった。ipfilterをkernelに組み込んでしまっていたので、ipfilter_enable=”NO”だとスタンドアロンになってしまうのであった。kernel moduleにしとけって話ですよね。 後で戻す可能性もあるし、いちいちkernelの再構築をすることもないのでipfilterを有効にして再起動。以後は特に問題なし。   さて、さっそくwiresharkでパケットを確認。TCPの再送は続いている… 夜半にはめでたくIRCが切断。おめでとうルータ君、君の疑いは晴れた。 これで外に繋がっているルートはモデムを除いて全て交換したので、NTTに電話するしかなくなった。 以下次号。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/e3-83-ab-e3-83-bc-e3-82-bf-e4-ba-a4-e6-8f-9b-e3-80-81-e3-81-9d-e3-81-97-e3-81-a6.html",
        "teaser":null},{
        "title": "NTTに電話",
        "excerpt":"前のエントリに書いたように、ルータを交換してもIRCの切断が直らないので、NTTに電話してみた。 「回線に不調が…」と言いかけたところ、詳しく説明する前に「ではすぐ調べますので！10分後にお電話します！」とさっさと切られてしまった。 10分後、「調べたけどリンクダウンしてないしずっと繋がってますよ？」と言われる。ここでようやく説明開始。     \tリンクダウンはしていないこと。 \t一部のアプリケーション（IRCとか言うとめんどくさそうなので、MSNメッセンジャーを例にした）で切断が続いていること。 \tルータ及び屋内配線を全て交換したこと。 \tモデムの再起動も試したこと。 \tプロトコルアナライザで解析するとTCPの再送が続いていること。  以上を説明し、モデムorマンションの終端装置に問題があるのでは？と持ちかけた。 サポセンの人、既に「めんどくさい客だなこいつ」ムード。「分からないので上に聞いてみます」とのこと。 10分後くらいにまた折り返し電話があり、「リンクダウンが発生しない限り機器の交換はできない」「個々のアプリケーションでの不具合についてはプロバイダに問い合わせて欲しい」という回答。 うーん、まぁ正論だな。 こっちも正直モデムは可能性の一つとしてしか考えてなくて、切り分けがしたかっただけだし。 （あわよくば経年劣化しているであろうモデムを新品にしたいという気持ちもあり） と言うわけで今回は引き下がった。   長期戦になりそうなので、プロバイダには電話ではなくメールで問い合わせることにして、ネットワーク図を見ながら文面を考えているとふと気付いたことがあった。 こ、これは…！（以下次号）  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/ntt-e3-81-ab-e9-9b-bb-e8-a9-b1.html",
        "teaser":null},{
        "title": "第三の容疑者",
        "excerpt":"IRC切断問題の続き。 発端 ルータ交換 NTTに電話 再度LAN内の見直し　←いまここ ネットワーク図を見直して気付いたこと。 不具合の発生したPCは全て、同じスイッチングハブを経由している… LAN内の通信に何ら問題がなかったので、ルータよりも内側のネットワークについては疑っていなかったが、考えてみるとハブの故障あるいは暴走というケースは何度も経験している。 通常、そういう時にはまずLAN内のファイル転送やら何やらにまず不具合が出るが、実際外部との通信でもIRCやMSN以外は何ら問題なかったわけだし。 wiresharkによる解析では、TCP Retransmissionの他にReassembled PDUも多発していたので、もしかするとパケットサイズの小さな通信にのみ問題が発生しているのかも知れない。そう言えばLAN内はGbEの効率を上げるためMTUをでかくしているが、これが原因か？ だとすればハブの再起動で解決しそうだが、切り分けのためには別のハブに繋ぎたいところ。幸い、ルータ（WZRなんとか）に４ポートのハブがついているので、こっちに差し替えてみた。 とりあえずIRCサーバにテスト用のチャンネルを作り、一定時間ごとに自動的に発言するマクロを組んで一晩放置してみたが、切断はされなかった。まぁ、今までも丸一日程度切断されないことはあったので、これで解決とは言い切れないが。 なお、wiresharkによるとIRCサーバとの通信で再送は一度も発生していなかった。 残念ながらhttpやhttpsでの再送はまだ発生しているが、このトラブルが発生するまで解析したことはなかったので、これが異常な動作なのかははっきりしない。 この状態で数日間様子を見て、発生しなかったらハブを交換しようと思う。発生したらプロバイダに問い合わせかな。 参考資料:超簡単なネットワーク図 変更前 モデム | ルータ | GbEハブ−PC | 無線AP…Mac 変更後 モデム | 無線AP兼ルータ…Mac | PC ついでに、テスト用の自動発言マクロ。（Limechat2のスクリプト） 荒らしとかに使っちゃやーよ。 [javascript] var channel=”#loadtest”; //テスト用のチャンネル var inttime=30000; //発言間隔(ms) function testsend(){ send(channel, “ろーどてすとなう”); } function event::onConnect(){ testsend; setInterval(testsend,inttime);...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/e7-ac-ac-e4-b8-89-e3-81-ae-e5-ae-b9-e7-96-91-e8-80-85.html",
        "teaser":null},{
        "title": "rubykaigiチケット購入",
        "excerpt":"今年も参加します、rubykaigi。 今回の会場はつくばだそうで、遠いけど広くて快適なんだよね。 一昨年は宿が遠い上に周りにコンビニ一軒なかったけど、今回はすぐ隣に取れたので安心。   しかしチケット発売時の輻輳はひどかったな… 設定ミスらしいけど、逆宣伝にならないか心配。 まぁ、参加するような人はみんな事情分かってるからいいのか。 サーバはnginxっぽいですね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/rubykaigi-e3-83-81-e3-82-b1-e3-83-83-e3-83-88-e8-b3-bc-e5-85-a5.html",
        "teaser":null},{
        "title": "だが、しかし…",
        "excerpt":"IRC切断問題続き。 再度LAN内を見直したものの、残念ながら再び切断が発生、週末には一日に５回も６回も切断されるという事態になった。 もはやPCから電話線に至るまで、モデムを除いて全ての機器を交換しており、原因はPCかモデムの先の何かに絞られた。 ちなみにwiresharkで確認したところ、切断前に７回のTCP Retransmissionが起きており、今回も同じ症状であることはまず間違いない。    ところが、この時たまたま別のPCでもIRCに接続しており、そちらの方は一度も切断されていなかったことに気がついた。 acとPCで同じような症状が出ているので、当然原因も同じと考えていたのだが… とりあえず切断されなかったPCの環境をできるだけ同じにして様子を見ることに。 なお、Macにもwiresharkはあるけど、動かしているとそのうちNICが反応しなくなるという不具合があり、これ以上問題を複雑にしたくないので放置。あ、でも標準のtcpdumpでもいいのか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/e3-81-a0-e3-81-8c-e3-80-81-e3-81-97-e3-81-8b-e3-81-97-e2-80-a6.html",
        "teaser":null},{
        "title": "NTFS volume with Snow Leopard",
        "excerpt":"ac（Snow Leopard）でNTFSボリュームをrwでマウントするために、mount_ntfsのラッパーを書く方法を使っていたが、アップデートによってできなくなったようだ。 同じ方法を使うとmountされず、system.logに diskarbitrationd[13]: unable to mount /dev/disk1s1 (status code 0x00000040). のようなエラーが残る。 % sudo mount_ntfs -o rw /dev/disk1s1 /Volumes/temp とかやるとマウントはされるので、diskarbitrationdの仕様が変わってオプションを渡してくれなくなったのだろうか。   /etc/fstabを書こうか迷ったが、管理が面倒になるのでNTFS-3Gを入れてしまった。 NTFS-3GはいつのまにかTuxera NTFSとかいう商用プロダクトに変わっていたのね。オープンソースの方はCommunity Editionとして提供されているけど、今後どうなるか不透明ではある。 ちなみに商用だと他にParagon NTFSなる製品も出てますね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/mac-with-ntfs-volume.html",
        "teaser":null},{
        "title": "影とのたたかい",
        "excerpt":"最近spamが巧妙になってきたのか、bsfilterをくぐりぬけることが増えてきた。 まぁ、gmailのフィルタが相変わらず１０割打者なので実用上問題はないが、Thunderbirdで迷惑メールマークを付ける作業が家の前に放置された他人の生ゴミを捨てさせられているような不快感があるので、フィルタの精度を上げてみることにした。 まず、Thunderbirdのメールを保存しているフォルダから、手動でマークした迷惑メールを探す。 メールフォルダ/etc/Junkのようなファイルになっているが、これはmbox形式なのでそのままbsfilterに食わせることができる。このファイルをサーバに転送して、 bsfilter -v -s --mbox Junk で食わせてみる。 メールの数が常識的ならばこれでいいんだが、数が多いと処理にかなり時間がかかる。 あまりリッチなサーバではないので（つーかDELLの19800円のやつなので…）大きなファイルを読ませると辛い。 gmailの迷惑メールフォルダをそっくり食わせようとしたら、同じサーバで動いているrailsのインスタンスが応答しなくなった。これはマズい。 bsfilterはrubyで書かれているので、そもそもサーバ上で作業する必要はない気がするけど、Macでちょっと試したら予想外に面倒だった（MeCabが動かない…）ので負荷を下げる方向で考える。 まずは小手先の技でniceをいじってみる。 nice -n 20 bsfilter -v -s --mbox Junk これで優先度は最低になるはず（20が最低、-20が最高）。ちなみに実行中の場合はsuspendするなりもう一枚シェルを立ち上げるなりして、 renice 20 [PID] で変更できる。 が、最低まで下げても重い。ディスクIOか、あるいはメモリを使い切ってswapしてるのか… どっちにしろ巨大ファイルなのが良くないと思い、分割することに。 csplitを使って csplit -s -f \"Junk\" -n 4 Junk '/^From .*/' '{*}' で分割しようとしたがエラーが出る。え、FreeBSDだと{}使えないの？まじすか。 しょうがないのでgrep -c ‘From:’ Junkとかやって回数を調べ、の代わりに入れる。 が、なぜか分割されないファイルがある。文字コードの問題かなぁ… しゃーないのでmboxを分割するツールを探す。 Mail Export...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/06/e5-bd-b1-e3-81-a8-e3-81-ae-e3-81-9f-e3-81-9f-e3-81-8b-e3-81-84.html",
        "teaser":null},{
        "title": "Integration API",
        "excerpt":"RailsとWordPressをシングルサインオンで繋ぐIntegration APIというプラグインがあるらしい。 MOONGIFTさんの記事を見てから一度使ってみたいと思ってたんだけど、使えそうな案件があったので試してみた。 簡単に仕組みを説明すると、Rails側にセッションと認証情報を提供するAPIを用意し、WordpressのプラグインからJSONで認証情報を貰ってくるというもの。APIはcookie名やログインURLを提供するconfg_infoと、cookieを認証情報にデコードするuserの二種類しかないシンプルなもの。 ところが、記事中のサイトが既にドメインごとなくなっていていきなりつまづく。ええええ… githubを探し回ると、gravis’s integration_apiが見つかった。こ、これかな。 ちなみにWordpressのプラグインの方はRails Integration APIという名前で公式からダウンロードできる。 既にこの時点で「メンテナンスされてないんじゃないか」という疑念が走るが、まぁ実験ということでとりあえず使ってみる。（と言うか既に手段が目的化しているのであった） まずRails側にプラグインをインストール。 script/plugin install git://github.com/gravis/integration_api.git そのままだとcookie名がnilになってしまうので、vendor/plugins/integration_api/app/controllers/integration_api_controller.rbの cookie_name = ActionController::Base.session_options[:session_key] を cookie_name = ActionController::Base.session_options[:key] に直す。 さらにreadmeにある通り、config/environments/development.rbに # Constants for the Integration API INTEGRATION_API_DEBUG = false INTEGRATION_API_SESSION_USER_ID_KEY = :user_id INTEGRATION_API_SESSION_ID_PARAM = :id INTEGRATION_API_CONFIG = { :login_url =&gt; 'http://localhost:3000/login', :logout_url =&gt; 'http://localhost:3000/logout' }...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/integration-api.html",
        "teaser":null},{
        "title": "こわれた腕輪",
        "excerpt":"以前書いたSPAM対策の続き。 意外と粗忽と言うか良心的なのか、固定ホストから送信されていたり、Fromアドレスが一定のSPAMというのは多い。 それらをpostfixで一括して弾いてみる。    まず、送信元ホストによる制限。 main.cfに以下を記述する。  smtpd_sender_restrictions =          permit_mynetworks 　　　check_client_access hash:/usr/local/etc/postfix/reject_client  でもって/usr/local/etc/postfix/reject_clientに対象となるホストのIPアドレスを列挙。  xxx.xxx                  REJECT xxx.xxx.xxx.xxx     REJECT  アドレスブロックで指定することもできる。 リストを書いたらpostmap /usr/local/etc/postfix/reject_clientでDB作成。 次に同じくmain.cfに  smtpd_sender_restrictions =         hash:/usr/local/etc/postfix/reject_sender         reject_unknown_sender_domain,         reject_non_fqdn_sender  と書いて、/usr/local/etc/postfix/reject_senderに拒否するアドレスのリストを書く。  xxx.com            REJECT xxx@xxx.com    REJECT  ドメインだけを書けば、そのドメインを一括して拒否する。 リストを書いたらpostmap /usr/local/etc/postfix/reject_senderでDB作成。 以上の作業が終わったらpostfix reloadで。 maillogを見るとちゃんと拒否されているようだ。 拒否リストを追加した時はpostmapだけ実行すればＯＫ…のはず。   まぁ、「良心的」かと思ったらこれやった途端に発信元変えてくる奴とかもいたりして、不毛な戦いは続くんだけどね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/e3-81-93-e3-82-8f-e3-82-8c-e3-81-9f-e8-85-95-e8-bc-aa.html",
        "teaser":null},{
        "title": "リバースプロキシの一部無効化",
        "excerpt":"Apache2.2のリバースプロキシで運用しているRailsアプリ内で、ドメインをそのままに一部をRails以外のコンテンツ（Wordpress等）で構成する必要が出てきた。 と言ってもそんなに複雑なものではないので、下位ディレクトリの一つを適当な場所にAliasしてやって、そこだけリクエストがmongrelに渡らないようにする。    httpd.conf（ないしはincludeされる設定ファイル内）で    ProxyRequests Off   ProxyPass / balancer://rails/  timeout=2   ProxyPassReverse / balancer://rails/   &lt;proxy balancer://rails&gt;   #以下略  となってる所に    ProxyPass /blog/ !  を挿入してやれば、/blog以下はapacheが直接リクエストを処理するようになる。 ProxyPassの前に入れたけど、順番はどこでも大丈夫かな？ プロキシとは関係ないけど、以下も追加しておくのを忘れないように。 apache2.2はDeny from allがデフォルトなので、allowしてやらないと何も見えなくなる。    Alias /blog/ \"/www/blog/\"   &lt;Directory \"/www/blog/\"&gt;     Order deny,allow     Deny from all     Allow from all   &lt;/Directory&gt;   つーかそろそろnginxに移行するべきですかね？  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/e3-83-aa-e3-83-90-e3-83-bc-e3-82-b9-e3-83-97-e3-83-ad-e3-82-ad-e3-82-b7-e3-81-ae-e4-b8-80-e9-83-a8-e7-84-a1-e5-8a-b9-e5-8c-96.html",
        "teaser":null},{
        "title": "gitメモ+1",
        "excerpt":"いつも忘れて調べるので備忘録。主にブランチまわり。   ブランチを作成する  git branch new_branch  ブランチを切り替える  git checkout new_branch  new_branchブランチをmasterにマージ  git checkout master git merge new_branch  リモートにpushしたらrefuseされた時（リモートで）  git config --add receive.denyCurrentBranch ignore  特定ファイルを一つ前に戻す  git checkout HEAD^ path/to/file   おまけ。 capistranoから本番環境のサーバを停止・起動・再起動  cap deploy:[stop|start|restart]  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/git-e3-83-a1-e3-83-a21.html",
        "teaser":null},{
        "title": "FirePHP",
        "excerpt":"WP Rails Authenticateに手を加える過程で便利だったのが、FIrebugのプラグインFirePHP。php内でデバッグログを出力させてFirebugのコンソールに表示することができる。ちょっとしたプラグインの改造にはとても便利。 ライブラリは直接埋め込んでもいいが、WordpressならSimple WP FirePHPというプラグインがあるので、これを入れるだけでいい。 で、プラグインの適当な所に  FB::group('group one'); FB::log($object, 'some object data'); FB::groupEnd();  とか埋め込んでやればFirebugに表示される。文字列だけではなく、配列だのハッシュだのを放り込んでも適当に整形してくれる（rubyのppっぽく）。なお、groupは表示を分けてくれるだけなので無くても良い。 ついでに、cookieの内容が見れるFireCookieなんてのもある。全くFirebug様々です。しかしあのＧっぽいアイコンだけはどうにかならないものか…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/firephp.html",
        "teaser":null},{
        "title": "WP Rails Authenticate",
        "excerpt":"懲りずにRailsとWodpressの認証を結合する試みの続き。 integration apiを使って一定の成功は見たものの、実はdevelopment環境（cookieセッション）でしか動かなかった。production環境はmemcachedセッションを採用しているが、integration apiはcookieセッションとActiveRecordセッションにしか対応してない。memcachedセッションに対応させようと色々やってみたが挫折した。遺憾ながらこの手は放棄するッ！ と言うわけでもう一つのプラグイン、WP Rails Authenticateを使ってみることにした。 このプラグインは、Wordpress側にだけインストールし、Railsアプリケーションのdatabase.ymlの場所を設定してやれば、そこからRailsのデータベース情報を拾って独自に認証してくれるというもの。直接SQLを叩くのでMySQLにしか対応していないが、Rails側には一切手を加えないで済む。 前提としてphpのライブラリsyckとmysqliが必要なのでpearなどでインストールしておく。（今回はportsで入れた） プラグインそのままだと色々不具合がある。SQLは決め打ちなので、Railsの認証に合わせて直接変更する必要があるし、暗号化方式もsha512で決め打ちされていた（restful_authenticationはsha1だった）。 さらにWPもRailsもUTFなのに日本語が化ける問題が発生。これを回避するためにmysqli_set_charset($db, “utf8”)を加えておく。 以上を色々いじってようやく動くようになったので、パッチを載せておく。 なお、Railsのusersテーブルはrestful_authenticationを基本に、こちらを参考にメールアドレスでログインするようにしたもので、nicknameカラムは表示のみに使用している。 --- wp-rails-authenticate.php.orig 2010-02-15 00:37:22.000000000 +0900 +++ wp-rails-authenticate.php 2010-07-20 12:49:49.000000000 +0900 @@ -45,8 +45,8 @@ * @param stdClass the user object returned from the rails app's database * @return string the encrypted password */ - function apply_encryption($data)...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/wp-rails-authenticate.html",
        "teaser":null},{
        "title": ".gitignore",
        "excerpt":"redmineのデフォルト.gitignore 参考になるのでメモ。   /config/additional_environment.rb /config/database.yml /config/email.yml /config/initializers/session_store.rb /coverage /db/*.db /db/*.sqlite3 /db/schema.rb /files/* /log/*.log* /log/mongrel_debug /public/dispatch.* /public/plugin_assets /tmp/* /tmp/cache/* /tmp/sessions/* /tmp/sockets/* /tmp/test/* /vendor/rails *.rbc   database.ymlはリポジトリに含めた方がいい気もするけどね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/07/gitignore.html",
        "teaser":null},{
        "title": "続・Gitメモ",
        "excerpt":"たまにしか使わないのでよく忘れるコト。 作業ディレクトリをリポジトリ化する cd /path/to/project git init 空のリポジトリを作成する mkdir project cd project git init --bare ローカルリポジトリをリモートにコピー （リモートに空のリポジトリを作成してから） cd project git remote add origin ssh://remotehost/path/to/project git push origin master 特定のリビジョンのファイル内容を表示 （リビジョンはgit logで出てくる0c533178483e07649ec91462c97c0fe8889fa80aみたいな文字列） git show 0c533178483e07649ec91462c97c0fe8889fa80a:config/deploy.rb おまけその１。 capistranoで初回にデプロイするまで cd project capify . cap deploy:setup cap deploy:cold おまけその２。 will_paginateインストール sudo gem sources -a http://gems.github.com/...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/e7-b6-9a-e3-83-bbgit-e3-83-a1-e3-83-a2.html",
        "teaser":null},{
        "title": "redmineインストール",
        "excerpt":"ちょっと使い方を習得しておきたかったので、redmineをインストールしてみた。 以下そのログ。 改造することを考えて、手元にリポジトリをチェックアウトし、capistranoでデプロイする形にした。 まずsubversionリポジトリをチェックアウトし、gitリポジトリにする。 svn checkout http://redmine.rubyforge.org/svn/trunk/ redmine cd redmine git init . なぜかtrunkなのは気にしない。 以下インストールガイドを参考にしつつ。 まずdatabase.ymlを書き換え、deploy.rbを追加（いつものレシピをコピペ）。 ついでにcapifyを実行してcapistranoでデプロイできるようにしておく。 次にセッション暗号化鍵を作成。 rake config/initializers/session_store.rb .gitignoreを編集してdatabase.yml、email.yml、session_store.rbを無視リストから外す。 以上を設定して cap deploy:setup cap deploy:cold でデプロイし、サーバ上で RAILS_ENV=production rake db:create RAILS_ENV=production rake db:migrate RAILS_ENV=production rake redmine:load_default_data で初期設定。 ここまではいつもの手順だったが、セッションまわりでうまく動作せず。 config/environment.rbに config.action_controller.session = { :key =&gt; \"_redmine_session\", :secret =&gt; ランダムな文字列 } を追加する必要があるようだ。自動的にランダム生成するよう、...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/redmine-e3-82-a4-e3-83-b3-e3-82-b9-e3-83-88-e3-83-bc-e3-83-ab.html",
        "teaser":null},{
        "title": "GitX",
        "excerpt":"redmineをいじってるうちに、ローカルで動かすGitのリポジトリビューアが欲しくなった。 一応gitにGUIはついているものの、MacでXを立ち上げるのも億劫だし見た目もよろしくない。 まぁ、実際のコミットだのなんだのといった作業はコマンドラインで十分なので、差分だけぱっと見て分かれば良い。そんなのないかなぁと思って探したら、GitXがなかなか見やすくて良かった。 似たようなのがLinuxにもないかな…と思ってaptitude search gitしてみたら、gtkアプリのgitgというのがほぼそのまんまだった。アイコンまでそっくり。どっちがオリジナルなのか…gitgの方にGitX likeとか書いてあるからGitXが先か。まぁ何でもいいけど。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/gitx.html",
        "teaser":null},{
        "title": "SInatra３分間クッキング・その１",
        "excerpt":"突然、ちょっとしたブックマークアプリが欲しくなったので、以前から興味のあったSinatraででっち上げてみる。 そこ、一体いくつ車輪を再発明すれば気が済むんだ？とか言わない。    まず設計と言うか構想から。 最初に書いたとおり、フレームワークはSinatraを採用。（というかSinatraを使うのが目的みたいなもんだけど） O/RマッパとRDBMSは使い慣れてるActiveRecord+MySQLを…と思ったけど自転車にスクラムジェットエンジン付けて近所のコンビニに行くようなもんじゃね？と思い直し、Sequel+sqlite3を使ってみる。 最後にテンプレートエンジン。最初hamlで頑張ってみたけど資料が少なくて（←言い訳）断念。こっちは慣れたerbにする。 これらのために以下のgemをインストールする。   \tsinatra \tsequel \tsqlite3-ruby \tshotgun  shotgunは動作そのものには不要だが、スクリプトを書き換えた時にいちいち再起動しなくても自動的に再読み込みしてくれるので、開発時には必須アイテムと言える。 sqlite3そのものは既に入っていた。 以下次号。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/sinatra-ef-bc-93-e5-88-86-e9-96-93-e3-82-af-e3-83-83-e3-82-ad-e3-83-b3-e3-82-b0-e3-83-bb-e3-81-9d-e3-81-ae-ef-bc-91.html",
        "teaser":null},{
        "title": "Sinatra３日間クッキング・その３",
        "excerpt":"SInatraでなんか作ってみようその３。 shotgunの使い方とpagenationのやり方。    ここまでできたら、ruby server.rbとかやるだけでhttp://localhost:4567/で動作してしまうが、最初に書いた通り開発中はshotgunを使わないと、スクリプトを書き換える度にCTRL+Cで止めて立ち上げ直すことになってめんどくさい。余談だけど、sinatraを止めると「sinatraはセッションを終える（観衆は拍手した）」とか出てきてかっこいい。 閑話休題、shotgunで立ち上げるには、  shotgun server.rb -p 4567 -s mongrel  と、ポートとサーバを指定してやる必要があった。もちろんwebrickでもthinでも何でもいい、はず。 これでブラウザでアクセスする度にスクリプトが再読み込みされる。後は適当に書いていくだけ。 なお、本番環境では上記のshotgunをrubyに変えるだけでOK。   もう一つ引っかかったのはpagenation。情報が少ないんだよね。  Sequel.extension :pagination  を宣言しておいて、コントローラで  get '/all/:page' do   @page = params[:page].to_i   @items = Items.order_by(:id.desc).paginate(@page, 20)   erb :index end  としておけば、ビューで@items.current_pageなどのメソッドが使えるようになる。 その他利用可能なメソッド一覧。   以上、初めてなので３日くらいかかってしまったが（うち１日はhamlの記法に悩み、１日はpaginationで悩んでいた）、次回からはほんとに数時間で書けてしまうと思う。 まぁ、今回はイントラでしか使わないのでここで終了だけど、ちゃんと動かそうと思うとリバースプロキシとかやらないといけないんで、そのへんの手間はRailsアプリをデプロイする時とあまり変わらないかも知れない。 ともあれ、短時間で何かでっち上げたい時には便利なんじゃないでしょうか。あと簡潔に書けるので教育に良いかも。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/sinatra-ef-bc-93-e6-97-a5-e9-96-93-e3-82-af-e3-83-83-e3-82-ad-e3-83-b3-e3-82-b0-e3-83-bb-e3-81-9d-e3-81-ae-ef-bc-93.html",
        "teaser":null},{
        "title": "Sinatra３時間クッキング・その２",
        "excerpt":"SInatraでブックマークアプリっぽいものを作ってみるテストその２。 VC編。 sequelは直接SQLを叩いたりもできるが、やっぱりMVCっぽくしたいので以下のようにする。 Sequel::Model.plugin(:schema) Sequel.connect('sqlite://database.db') class Items &lt; Sequel::Model unless table_exists? set_schema do primary_key :id string :url timestamp :created_at end create_table end end これで初回に起動すれば、スキーマ通りにDBが作成される。 URLの設計は大したことしてないので略。 コントローラの実装はこんな感じ。 get '/' do @items = Items.order_by(:id.desc).limit(20) erb :index end 説明不要なくらい分かりやすい。パラメータを取る場合はこう。 get '/:id' do @item = Items.find(:id =&gt; params[:id]) erb :show end POSTで受け取ってエントリを作成し（いわゆるCRUDのC）、/に飛ばすなら　 post '/add'...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/sinatra-ef-bc-93-e6-99-82-e9-96-93-e3-82-af-e3-83-83-e3-82-ad-e3-83-b3-e3-82-b0-e3-83-bb-e3-81-9d-e3-81-ae-ef-bc-92.html",
        "teaser":null},{
        "title": "target=\"_blank\"",
        "excerpt":"今時target=”_blank”なんてやってると笑われるので、JavaScriptで実装する方法。 ぐぐると色々なやり方があるようだけど、例えばRailsのerbだと [html] &lt;%= link_to(“新しいウィンドウで開く”, “http://blog.larus.jp/”, :popup =&gt; true) %&gt; [/html] のようにhelperが用意されてて、出力されるのは以下のようなhtmlになる。 [html] 新しいウィンドウで開く [/html] もちろんJavaScriptが無効になってるとそのウィンドウで開いてしまうのだけど、リンクが機能しないわけでもないからいいか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/08/target_blank.html",
        "teaser":null},{
        "title": "rubykaigi.days.first",
        "excerpt":"   タイトルはタイムテーブルのパクリ。 会場案内図はrubykaigi.map(&amp;:guide)とか書いてあった。 なお、なぜか毎回ある「map vs collectアンケート」では今回もmapが圧勝してました。   さて、rubykaigi１日目の感想。     オープニング基調講演 Jeremy Kemper氏が急に来れなくなったとのことで、急遽座談形式に。どうなることかと思ったけど、これはこれでほのぼのしてて良かった。 要約すると、Rails3は層の分離が進んでいるため、Acrive*だけ使うとかいうこともできる。あと、ruby1.9使えと。   [nicodo]sm11901600[/nicodo]   Jpmobile on Rails3 前述の層の分離を活かして、一部機能をRackに組み込むことができたため、Sinatraでも利用できる。 Jpmobileに関してはそれほど目新しい話はなかったが、開発の過程でRailsのソースを読む話が面白かった。   [nicodo]sm11901698[/nicodo]   オープンソーシャルアプリケーションの開発 acts_as_opensocialプラグインの紹介など。あとスケールアウトの助けとして、acts_as_multi_connection、ec2tools等も開発。 オープンソーシャルは以前調べたけどよく分からなかったので、acts_as_opensocialのソースを読んでみようと思う。 Rubyとは関係ないけど、ノウハウとしてメンテ開けはどっと来るのでIDの下一桁で区切って段階的にログインできるようにしていくって話が面白かった。   [nicodo]sm11902001[/nicodo]   リアルタイムウェブができるまで 昔々、TCP over HTTPってジョークRFCがあったのを思い出した。ついに時代が追いついたか… コネクション数とか平気なんだろうか。後でちょっと調べてみよう。   [nicodo]sm11902134[/nicodo]   Head First 普通のシステム開発 アジャイル開発（スクラム）を実際にやり、時間内に実際に公開しているサービスに新機能を実装してしまうというライブ。 今回最高に面白かったセッション。本で読むよりも遙かに分かりやすいし、テーマの選び方も秀逸（見ている人が何をやっているかすぐ分かる）。 恥ずかしながら、bundlerを初めて知りました。次から使って見よう。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/rubykaigi-days-first.html",
        "teaser":null},{
        "title": "rubykaigi.days.last",
        "excerpt":"   Rubykaigi３日目の感想。 ちなみに会期中、ちょうどつくばのお祭りでした。夜店がたくさん出ていたけど、人手が足りないのかデイズタウンがシャッター街に…     ニフティクラウド まだ色々未実装なのね… 止めても状態を維持する（けど停止中も課金）ってのがEC2との最大の違いか。あんまruby関係ないっすね。   [nicodo]sm11932651[/nicodo]   RWiki とにかくものすごい力業の連続で笑った。けど、それだけロバストってことだよなぁ。 「小手先の解決策より正攻法の力業が良い」といつも思ってるので勇気づけられました（大げさ）。いや、いつも小手先の技が思いつかないだけだけど。   [nicodo]sm11932774[/nicodo]   るりまサーチ 転置索引ってのがちょっと分からなかった…。無知でごめんなさい。 groonga（rroonga）自体は簡単に利用できそう。何かに組み込んでみるか。   Post Rails 面白かったけど感想を書くのは難しい… symbolとかenumlatorを使いまくると今風っぽいとか、githubでオレってばスゲー感を共有しようとか。   There is no spoon キャーカクタニサーン   [nicodo]sm11930436[/nicodo]   基調講演 Chad Fowlerさん初日からいたのに気付きませんでした。だって！一昨年とは別人だよ！ Daily Hitかー。身につまされるものがあるなぁ。明日から実践しよう。（明日かよ）   [nicodo]sm11930550[/nicodo]  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/rubykaigi-days-last.html",
        "teaser":null},{
        "title": "rubykaigi.days.second",
        "excerpt":"   タイムテーブルにdays.secondって書いてあって、「そんなメソッドねーよ！」と突っ込もうとしたらその上に  require 'active_support/core_ext/array'  って小さく書いてあった。脱帽。   というわけでrubykaigi２日目の感想。     基調講演 まつもとさんはいつもの調子でした。 2.0は1.9からさほど変わらない（マイナーチェンジ）らしい。もしかしたら1.9.3は出ずに2.0になるかも？なんて話も。   [nicodo]sm11914317[/nicodo]   M-x ruby-and-emacs-workshop 超絶技巧とどっちに出るか悩んだけど、Emacsとの付き合いはRubyより長いのでこっちへ。 ido-modeなんてクソ、とか叩かれると思ってこそこそ使ってたけど、なんか絶賛お勧めされたのでこれからは堂々と使おう。 anything.elは相変わらずよく分からなかったので、帰ってからるびきちさんの本を買いました。   [amazon-product]4774143278[/amazon-product]   なお、超絶技巧の方は動画が公開されてます。もう何が何だか分からないくらいすごいです。   [nicodo]sm11914507[/nicodo]   Cucumber Hands-On 前日のHead FirstでCucumberに興味が出たので飛び込みで参加したものの、会場のネットが輻輳してgemのインストールに苦戦している間に終わってしまった。ぎゃふん。 資料は貰ったので、帰ってから復習。   Lightning Talks LTのテンプレみたいのが何となく確立してきたり、ツールの進化（Rabbitとか）のせいでドラ鳴らされることも減ってきましたね。むしろ「いかにギリギリまでやってドラと同時に終了するか」が芸になってる気がする。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/rubykaigi-days-second.html",
        "teaser":null},{
        "title": "Rubykaigi2010",
        "excerpt":"帰ってきてから色々と忙しくて間が開いてしまったけど、rubykaigiに行ってきました。 今年はまたつくばに戻り、参加者もさらに増えていましたが、セッションの豊富さに呆れ…いや感心しました。聴きたいセッションが二重三重に重なってて全部参加できないよ！ メイン会場のセッションに関しては動画が配信されているので、rubykaigi日記の方でどうぞ。 なお、次回rubykaigi2011が「ファイナル」だそうで。えーっ。   以下、面白かったセッションの感想を日にちごとに書きます。     ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/rubykaigi2010.html",
        "teaser":null},{
        "title": "続・攻性防壁",
        "excerpt":"以前書いたエントリの続き。 管理しているサーバの１つが、同一IPから1000回以上のアタックを受けていたので、今度こそ自動的に拒否リストに追加する仕組みを考えてみる。 rubyで実装するとして、デーモンとして常駐するとかhosts.allowから呼び出すとかも考えたけど、あんま激しく呼び出されるとそれ自体が負荷をかけてしまう（ruby自体がけっこう重たいし）ということで、ヌルくcronから呼び出すことにする。 と言うわけで、要件はこんな感じ。 一定時間ごとにcronで起動 /var/log/messagesを解析してアタックを行っているIPアドレスを抽出し、deny.listに追加する 回数が閾値以下の場合は追加しない（自分で間違ってアクセスしたとたんにBANとかは避けたい） ターンオーバーして圧縮されたログも解析できるようにする IPアドレスは重複して登録しない、またできればdeny.listは毎回ソートする ホワイトリストに登録されているIPアドレスは登録しない 半日くらいで書けた。名前はギブスンにあやかってIcewallとしてみた。すごくなんかと被ってそうです。 以下、工夫したこととか。 せっかくなのでoptparse使ってみた。 実は初めて。PerlでGetopt::Longとか使った朧気な記憶が。 opt = OptionParser.new opt.on('-d', '--deny=DENY_ADDRESSES', String, 'specify IP addresses to deny.') {|var| @denyaddr &lt;&lt; var } opt.on('-q', '--quiet', 'quiet mode.') { @quiet = true } opt.parse!(ARGV) とかやると、–helpを付けて起動すればそれっぽいヘルプを表示してくれる。 でもなんか複数のパラメタをちゃんと取れてない気がする。 IPアドレスの正規表現は、一発でマッチするように str.scan(/(\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])/) としてみたけど、なんか誤動作する（^$でくくれば一致するんだけど）。あれこれ悩んだけど面倒になったので、 str.scan(/\\b(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3}\\b)/).select{|a| a.all?{|b| (0..255).include?(b.to_i)}}.map{|a| a.join('.')} という超強引な方法で解決。ほ、ほら全部正規表現で書くより短いよ！...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/e7-b6-9a-e3-83-bb-e6-94-bb-e6-80-a7-e9-98-b2-e5-a3-81.html",
        "teaser":null},{
        "title": "続々・Gitメモ",
        "excerpt":"リポジトリを特定の時点に戻すには２つの方法がある。 まずgit logで戻したいコミットのハッシュを取得して、  git reset [ハッシュ値]  または  git revert [ハッシュ値]  resetは戻した時点より後のコミットを全て無かった事にする。 revertは「その時点に戻す」差分を作成して現在のコミットの上に積んでくれる。   どっちをやった場合も、  git reset --hard HEAD  を実行するまで実際のファイルはリセットする前のままなので注意。 ちなみに  git checkout HEAD^  でも戻れるが、上記と逆に実際のファイルのみでリポジトリには反映されない。 （形式上、無名のブランチに切り替わる） そこから編集してコミットすれば、revert＋αになる…と思う。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/09/e7-b6-9a-e3-80-85-e3-83-bbgit-e3-83-a1-e3-83-a2.html",
        "teaser":null},{
        "title": "今さらRails2.3.8",
        "excerpt":"いやまぁ2.x系列では2.3.9が最新なんだけどね。 masterブランチが2.3.5のままになってたアプリがあったのでマージついでに2.3.8に上げたところ、mime typeがおかしくなった。text/plainで送られてしまってhtmlソースがでてる… 応急処置としてhttpd.confのVirtualhostでDefaultTypeをtext/htmlにして対応したものの、今度はセッションが正しく維持されてないことが判明。Firebugで確認するとCookieが全く送られていない。あちゃあ。 多分ヘッダだな。2.3.8でRackになったからだろうか。最初から2.3.8のアプリは問題ないような気がするんだけど…（詳しく調べてない） 開発環境では発生せず、mongrel_cluster+apacheで運用してる本番環境でのみ発生するのですぐには原因を追えない。とりあえずヤバいので2.3.5にロールバック。 うーん、さすがにもうmongrelはダメなのかな…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/e4-bb-8a-e3-81-95-e3-82-89rails2-3-8.html",
        "teaser":null},{
        "title": "TDD",
        "excerpt":"トゥアハー・デ・ダナンではありません。 rspecで開発する際、今までruby script/spec なんちゃらかんちゃら…と手でいちいち実行してたけど、autospecを教えてもらったらとても便利だったのでメモ。 autospecはrspecかrspec-railsに入っているので、gemを入れてパスを通しておけば特に設定不要。RAILS_ROOTで  autospec  とやっておけば、modelやspecの変更を検知して勝手にテストが走る。 （あんまりこまめにセーブする人や、オートセーブにしてる人だとエラーが出まくって鬱陶しいかも） screenを使っているので、  screen -t spec 5 autospec  とかやって新しいscreenで動かしてみた。 さらにgrowlやubuntuのnotifyに通知も可能だけど、autotestを入れないといけないようだ。（ZenTestをインストールすれば入る） こっちはまだちゃんと設定してないので後日。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/tdd.html",
        "teaser":null},{
        "title": "all your base are belong to us\r\n",
        "excerpt":"あらすじ： git commit、git pushして作業終了 ↓ 翌日、最後のcommitが気に入らなくなってgit checkout HEAD^ ↓ そのまま作業終了、commit ↓ fast-forwardでpushできない！ ↓ 昨日のことを忘れてmergeしたらconflictの嵐 ↓ ＼(^o^)／ 解決編： git branch dummy origin/working git checkout dummy git revert xxxxxxxx git checkout working git rebase dummy working git push origin working 現在のorigin/workingを元にdummyブランチを切り、戻したい段階に戻ってからworkingにrebase。 教訓： むやみにpull originしたりmergeするのはやめて、rebaseを使うべし。 最後に、origin/masterの変更をworkingに適用する手順をまとめておく。 git checkout master git pull origin master...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/all-your-base-are-belong-to-us.html",
        "teaser":null},{
        "title": "autotestの結果をOSDで表示",
        "excerpt":"開発環境はLinuxなのでgrowlはないんだけど、gnomeの通知システムにメッセージを送るnotify-sendというツールがある。 libnotify-binをインストールしておけば、 notify-send '送信したいメッセージ' -i \"アイコン\" で通知を送ることができる。なお、アイコンは/usr/share/pixmaps/に置き、拡張子を除いて記述する。 （多分~/.usr/あたりにも置けると思う） あと、Autotest:Growlというrubyのモジュールが必要なんだけど、これはZenTestに入ってると思う。 でもって~/.autotestに以下の記述をすれば、growlっぽくtest結果を表示してくれる。 module Autotest::Growl def self.growl(title, msg, img, pri=0, sticky=\"\") msg += \" at #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}\" system \"notify-send '#{title}' '#{msg.inspect}' -i #{img}\" end Autotest.add_hook :ran_command do |at| results = [at.results].flatten.join(\"\\n\") output = results.slice(/\\d+\\s+examples?,\\s*(\\d+)\\s+failures?/) if output if $~[1].to_i &gt; 0 growl \"Tests Failed\",...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/autotest-e3-81-ae-e7-b5-90-e6-9e-9c-e3-82-92osd-e3-81-a7-e8-a1-a8-e7-a4-ba.html",
        "teaser":null},{
        "title": "printfデバッグ",
        "excerpt":"rubyだとppデバッグとかputsデバッグだけど。 便利なモジュールが紹介されてたので使ってみる。 どっちもgemで入ります。    colored Stringを拡張し、  puts \"messages\".bold.red  とかやると色つきで表示してくれる。railsのlogや、script/consoleを色々拡張して出力が見づらくなった時に便利。   clipboard eval(Clipboard.paste)とかClipboard.copy(‘message’)とかできる。 emacsのshell-modeがあまり気に入らず普通のターミナル使ってるのでとても便利…と思ったけど編集できないので結局普通のペーストの方が良かったりした。   ついでにscript/consoleで実行されたSQLを表示する設定。 .irbrcに以下を記述。  if ENV.include?('RAILS_ENV') &amp;&amp; !Object.const_defined?('RAILS_DEFAULT_LOGGER')   require 'logger'   RAILS_DEFAULT_LOGGER = Logger.new(STDOUT) end  さらに  if ENV.include?('RAILS_ENV')   require 'spec_helper' end  も入れておくと、script/consoleでmachinistのmakeメソッドとか使えて便利。 machinistについてはそのうち。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/printf-e3-83-87-e3-83-90-e3-83-83-e3-82-b0.html",
        "teaser":null},{
        "title": "可能性の獣",
        "excerpt":"mongrelで動かしていたRailsアプリをUnicornに切り替えた。 nginxの方が情報は多いんだけど、今回は他のWebアプリも動いてるので敢えてApacheにする。 若干ハマったのでメモ。 まず、Unicornのインストール。 ついでにRailsもアップデートしておく。 予めenvironment.rbのRAILS_GEM_VERSIONを変更しておき、 gem install unicorn gem install -v 2.3.10 rails cd /path/to/rails_app rake rails:update で完了。 次にunicornの設定。 設定ファイル名は任意だが、RAILS_ROOT/config/unicorn.conf.rbとする。 例ではポート5001、ユーザ名unicornで子プロセスは５つ立ち上げている。 user 'unicorn' group 'unicorn' shared_path = \"/path/to/rails_app/shared\" pid \"#{shared_path}/pids/unicorn.pid\" stderr_path \"#{shared_path}/log/unicorn.stderr.log\" stdout_path \"#{shared_path}/log/unicorn.stdout.log\" processes = 5 timeout = 75 listen = 5001 rails_env = ENV['RAILS_ENV'] || 'production' worker_processes...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/e5-8f-af-e8-83-bd-e6-80-a7-e3-81-ae-e7-8d-a3.html",
        "teaser":null},{
        "title": "zzz",
        "excerpt":"acをコマンドラインからスリープさせる方法。 なぜそんなことをするかと言うと、   \tリッドクローズで使ってる時にスリープさせたい \tマウスでスリープを選んでも、マウスに触れただけで起きてしまう \tかと言ってBluetoothで起きないように設定すると、リッドクローズのまま起こす方法がない \t事前にマウスの電源を切ってからスリープさせたい（つまりマウスを使わずにスリープさせたい） \tでもショートカットキーは覚えられない（Option＋Command＋Ejectらしい）  という訴求を満たすため。   前置きが長かったけど、スリープ自体は  osascript -e \"tell app \\\"Finder\\\" to sleep\"  でOK。BSD nomadだった頃を思い出して、.zshrcに  alias zzz=\"osascript -e \\\"tell app \\\\\\\"Finder\\\\\\\" to sleep\\\"\"  とか書いてzzzで寝るようにした。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/10/zzz.html",
        "teaser":null},{
        "title": "右プロンプト",
        "excerpt":"zshには右プロンプトというものがある。 何に使うの？と思ってたけど、パスとかを表示させておくと便利（左に表示させるのと比べてカラムがずれないとか）なようなので試してみた。 ついでに、うっかりmasterをいじり回してしまう事故を防ぐために、gitのブランチも表示させてみる。 基本的にこちらの記事を参考、というかコピペ。 パスが長い時に省略するように最後だけ変えてみた。 autoload -Uz VCS_INFO_get_data_git; VCS_INFO_get_data_git 2&gt; /dev/null function rprompt-git-current-branch { local name st color gitdir action if [[ \"$PWD\" =~ '/\\.git(/.*)?$' ]]; then return fi name=`git branch 2&gt; /dev/null | grep '^\\*' | cut -b 3-` if [[ -z $name ]]; then return fi gitdir=`git rev-parse...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/e5-8f-b3-e3-83-97-e3-83-ad-e3-83-b3-e3-83-97-e3-83-88.html",
        "teaser":null},{
        "title": "続・右プロンプト",
        "excerpt":"zshで右プロンプトにgitの状態を表示させてみたが、zshの最近のバージョン（4.3.10）のvcs_infoは、いちいちgitを呼ばなくてもリポジトリの状態を把握できるらしい。 毎回gitが走ると当然遅いので、vcs_infoに切り替えてみた。 # right prompt autoload -Uz add-zsh-hook autoload -Uz vcs_info zstyle ':vcs_info:*' enable git svn hg bzr zstyle ':vcs_info:*' formats '[%b]' zstyle ':vcs_info:*' actionformats '[%b|%a]' zstyle ':vcs_info:(svn|bzr):*' branchformat '%b:r%r' zstyle ':vcs_info:bzr:*' use-simple true autoload -Uz is-at-least if is-at-least 4.3.10; then zstyle ':vcs_info:git:*' check-for-changes true zstyle ':vcs_info:git:*' stagedstr \"+\" zstyle...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/e7-b6-9a-e3-83-bb-e5-8f-b3-e3-83-97-e3-83-ad-e3-83-b3-e3-83-97-e3-83-88.html",
        "teaser":null},{
        "title": "Gitメモ（第何弾か忘れた）",
        "excerpt":"毎日、作業開始時に git checkout master git pull origin master git checkout my-work-branch git rebase master とやってたんだけど、なんか妙なマージコミットが混ざってるよ、と注意された。 git pullはfetch+mergeらしいので、それでかなぁ。 git pull origin masterの代わりにgit pull –rebase origin masterにすればOK。 –rebaseの位置をよく間違える。 ついでにいくつかメモ。 non-fast-forwardでpushできないとき rebaseしまくってるとよくなる。 git push origin :my-work-branchでリモートブランチを削除、もう一度pushすればOK。 作業中に別のブランチをいじる必要に迫られた時 commitしたくない場合、git stash saveで現在の作業コピーを保存してくれる。 戻ってきたらgit stash popで復元。一応、その間にmergeだのrebaseしても平気らしい（なるべくやりたくないけど） rebaseの途中でconflictした ファイルを修正して衝突を取り除いてから、git addでstagingしてgit rebase –continue addだけでcommitはいらない（しちゃダメ） rebaseの最中にわけがわからなくなった git rebase –abortでrebaseする前に戻る...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/git-e3-83-a1-e3-83-a2-ef-bc-88-e7-ac-ac-e4-bd-95-e5-bc-be-e3-81-8b-e5-bf-98-e3-82-8c-e3-81-9f-ef-bc-89.html",
        "teaser":null},{
        "title": "しつこくGitメモ",
        "excerpt":"origin/masterにnon-fast-forwardでpushできなくなった！ さすがにmasterを削除することはできない（元々削除できないが）ので何とかしてみる。   まずローカルのmasterをリネーム（masterは削除できない）  git branch -m master temp  次にリモートのブランチを全て取得  git fetch  そしてリモートのmasterと同じものをローカルに構築  git branch master origin/master  masterに入って  git checkout master  ワークブランチをrebase  git rebase my-work-branch  そしてpush  git push origin master   しかしstageが無かったらどうやって作業したらいいのか分からなくなってしまった。 今さらsvnに戻れとか言われたら発狂する。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/e3-81-97-e3-81-a4-e3-81-93-e3-81-8fgit-e3-83-a1-e3-83-a2.html",
        "teaser":null},{
        "title": "縦分割screen",
        "excerpt":"screenを縦に分割して2画面で作業する方法。 Ubuntuの場合： 既にパッチの当たったscreenが入っているので、修飾キー（C-zとか）→｜（パイプ）で分割 acの場合： macportsのものだとうまく動かないので、tscreenをソースから入れ、.screenrcを.tscreenrcに書き換えて  bind v split -v  とか書いておく   ログやautospecを流しながら作業ができて便利ではあるんだけど、とにかく遅い。script/serverみたいにコンソールと同期するものは動作が止まったりする。ついでにマウスでコピペができなくなる（左右まとめて選択してしまう）のも厄介。実用性は微妙かも知れない…     ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/e7-b8-a6-e5-88-86-e5-89-b2screen.html",
        "teaser":null},{
        "title": "font-spec",
        "excerpt":"cocoa-emacsのフォント設定の決定版？ font-specを使うといいらしい。    (when (&amp;gt;= emacs-major-version 23) (setq fixed-width-use-QuickDraw-for-ascii t) (setq mac-allow-anti-aliasing t) (create-fontset-from-ascii-font \"Consolas-15:weight=normal:slant=normal\" nil \"consolasjp\") (set-fontset-font \"fontset-consolasjp\" 'unicode (font-spec :family \"Hiragino Maru Gothic ProN\" :size 14) nil 'append) (add-to-list 'default-frame-alist '(font . \"fontset-consolasjp\")) )  こんな感じで簡単に設定できる。 詳しくはこちらのサイトを参照。他にも色々有用な記事があります。   縦分割したスクリーンとemacsを全画面にして、spacesで切り替えて運用してみてるけど、初代MacBookだと切り替えが非常に遅い。もうMacBookAir買おうそうしよう。     ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/11/font-spec.html",
        "teaser":null},{
        "title": "メタプログラミングRuby",
        "excerpt":"読了。 興味深くて楽しい本でした。 良かったところ:   \tストーリー仕立てで楽しい \tテクニックのネーミングが秀逸で覚えやすい。（nilガードとか） \t一度出てきたテクニックが再出した時に、前回の解説のページ数が併記されている \t最後に簡潔にまとめたリファレンスがついている  ところどころフリーダムな翻訳（ジャッジメントですの）は賛否両論かも知れない。 図が手書きなのも見づらいと感じる人がいるかも。（個人的には気に入ったけど） まぁ、分量も少ないし、デザパタ本みたいにコードだらけというわけでもないので気軽に読めるんじゃないでしょうか。   [amazon-product]4048687158[/amazon-product]   ってamazon品切れかよ！  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/12/e3-83-a1-e3-82-bf-e3-83-97-e3-83-ad-e3-82-b0-e3-83-a9-e3-83-9f-e3-83-b3-e3-82-b0ruby.html",
        "teaser":null},{
        "title": "Cocoa Emacsの近況",
        "excerpt":"Cocoa Emacsになってからどうにもinline patchの調子が悪く、日本語入力時にしょっちゅうクラッシュしていた。 これはもうinline patchなしの方がましなのでは？と思って素のEmacsをビルドしてみることに。    どうせ素でビルドするなら新しい方がいいので、23.3のpretestである23.2.90を選択。 先端にしなかったのはbazaarがめんどくさいので・・・   手順はいつも通り。 ftp://alpha.gnu.org/gnu/emacs/pretest/emacs-23.2.90.tar.gz からソースパッケージを落として  ./configure --with-ns --without-x make bootstrap make make install  でnextstep/Emacs.appをApplicationsへ。 動かしてみたけど、モードラインにIMEステータスが出ないだけで、特に日本語入力や表示に問題はなし。 ただし、シフトキーがEmacsに取られてしまい、記号などが入力できない不具合がある。 幸い、カヤックの中の人がパッチを作ってくれているので、github https://github.com/typester/emacs/downloads から頂く。ついでにフルスクリーンパッチも当ててみる。   patch -p1 &amp;lt; ../feature-fullscreen.patch patch -p1 &amp;lt; ../fix-shiftmodifier-with-ime.patch ./configure --with-ns --without-x make bootstrap make make install   若干古いパッチだけど問題なく当たった。動作も問題なし。 フルスクリーンは -x ns-toggle-fullscreen で切り替わる。なかなか快適。 Dockやメニューも表示されるし。iTermのフルスクリーンだとされないんだよね… あとは縦分割できるTerminalがあれば完璧なんだけど。 デフォルトのTerminalを大きくしてtscreenで分割してるけど、重いんだよね。     ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/12/cocoa-emacs-e3-81-ae-e8-bf-91-e6-b3-81.html",
        "teaser":null},{
        "title": "MacBookAirを買った",
        "excerpt":"   acBookAir 11.6inchを購入しました。 メインメモリ4G、SSD64G。CTOなので一週間ほどかかった。 以下インプレッション。    小さいと言っても幅は以前使っていたiBookより若干大きい（iBookG4用の鞄にぎりぎり入る）。 奥行きがないので持つとかなり小さく感じるが、ピッチが広いので電車の中等では広げにくい。 重量は軽いが、大きさの割にはずっしりという感じ。剛性が高いので開け閉めに不安がない。 表面がざらざらしているので、うっかりUSB端子で引っ掻いたりすると鳥肌が立つ。 USBは２つあるものの、左側はMagSafeで隠れるので（逆さに刺せば隠れないが）主に右側しか使わないかも。 キーボードはピッチは十分だが、ストロークが浅すぎて最初は少し違和感があった。 CPUは遅いがSSDとビデオカードのお陰か、体感速度は初代MacBookよりだいぶ早い。Emacsのコンパイルもすぐだった。 可動部分がなく、ファンレス？なのでとてつもなく静か。キーもクリック音がしないので、静かな店内などで使うにはぴったりだと思う。 そのうちMacMiniあたりを買って母艦的に使おうと思ってたけど、もうこれがメインでもいいなぁ。   ところでマニュアルあけたら扉にこんな殺し文句が。      [amazon-product]B00485CHK4[/amazon-product]   Amazonは全部入りも買えるのね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2010/12/macbookair-e3-82-92-e8-b2-b7-e3-81-a3-e3-81-9f.html",
        "teaser":null},{
        "title": "あけましておめでとうございます",
        "excerpt":"年末年始でしばらく放置してしまったけど、今年もよろしく。   さて、Webアプリ作ってる人は大抵、開発時間の大半をエディタとターミナル（とFirefox）の行き来に費やしてると思うけど、EmacsのシェルはANSIカラーとかscreenとかで案外めんどくさい。 上手い方法はきっとあるんだろうけど（あったら教えて下さい）、結局Spacesで切り替えつつやってたりする。 そこで、Visorというツールを使うと、どこからでもターミナルが呼び出せるので、ちょっとgrepしたいとかirbで試したいといった作業の際に切り替えなくて済んで便利。もちろん通常のターミナルと同等なので、screenに繋いでがっつり作業してもいい。 インストールはSIMBLを入れなきゃならなかったりでちょっとだけ厄介かも。   ホットキーを押すとこんな感じにみょいーんとターミナルが生えてきます。 上からにしてるけど、左右とか下からでもOK。     ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/e3-81-82-e3-81-91-e3-81-be-e3-81-97-e3-81-a6-e3-81-8a-e3-82-81-e3-81-a7-e3-81-a8-e3-81-86-e3-81-94-e3-81-96-e3-81-84-e3-81-be-e3-81-99.html",
        "teaser":null},{
        "title": "Emacsいろいろ",
        "excerpt":"設定を共通化してメンテナンスしやすくなったので、「Emacsテクニックバイブル」に書いてあった設定のうち気に入ったものを試してみる。   以下、auto-installで入れたもの。    sequential-command 行末（C-e）等を連続して実行すると行末→文末→現在位置に戻るとかやってくれる。 uniquify ファイル名がかぶった場合にバッファ名を適当に変えてくれる。 recentf-ext 最近使ったファイル一覧。 tempbuf 使ってないバッファを適当に閉じてくれる。 point-undo カーソルがぶっとんだ時に元の場所に戻る…んだけど自分で移動させた場合はだめみたい。マウスに触れてぶっ飛ぶことが多いので、そっちの対策がしたかった… bm 現在行にしおりを挟み、しおり間でジャンプできる。 地味に便利だけど、MacだとS-SPCとかが効かないのでs-SPC（Option押しながらスペース）にしてみた。 goto-chg 直前に変更した場所に戻る。UndoしてRedoとかしてました。 open-junk-file 適当なファイルを自動的に作成する。メモ取る時とかに。 ipa ファイルにメモを付ける。まだ使ってません。   詳しい内容は書かないので本を買いましょう。   [amazon-product]4774143278[/amazon-product]   なお、auto-installのデフォルトの.emacs.d/auto-installはDropboxで管理していないので、  (setq auto-install-directory \"~/elisp/auto-install/\")  でelisp以下に変更。   あと、ブログの方で紹介されていたauto-sync-byte-compileも入れてみた。 lispを編集してセーブすると自動的にバイトコンパイルしてくれるというもの。（非同期で！） すっげぇ便利です。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/emacs-e3-81-84-e3-82-8d-e3-81-84-e3-82-8d.html",
        "teaser":null},{
        "title": "Emacsの設定をDropboxに置く",
        "excerpt":"emacsの設定はプラットフォームごとにまちまちで、統合したいなーといつも思っていた。 一時期gitで管理したりもしたんだけど、設定をいじる→リポジトリに登録→push→各プラットフォームでpullという作業があまりにも煩わしく、ついついおろそかになってしまう。 ここらへんを自動化すべく、elisp群をDropboxに置いてみた。 Mac/Linux .emacs.dをsymlinkにすると動作がおかしいので、~/elispとか適当なディレクトリを読みに行くようにして、ln -s Dropbox/elisp ~/elispとしておく。 Windows symlinkの代わりにショートカットを置いても動作しないので（このへん実に融通が効かない）、代わりにWindows7のハードリンクを使ってみる。Vista以前の人は自分で考えて下さい、すいません。 mklink /d C:\\Users\\name\\Dropbox\\elisp %HOME%\\elisp こんな感じ。 なお、分岐部分はこんな感じにした。 ;; プラットフォームを判定して分岐する (cond ((string-match \"apple-darwin\" system-configuration) (load \"~/elisp/etc/cocoa.el\") (load \"~/elisp/etc/unix.el\") ) ((string-match \"linux\" system-configuration) (load \"~/elisp/etc/linux.el\") (load \"~/elisp/etc/unix.el\") ) ((string-match \"freebsd\" system-configuration) (load \"~/elisp/etc/freebsd.el\") (load \"~/elisp/etc/unix.el\") ) ((string-match \"mingw\" system-configuration) (load \"~/elisp/etc/windows.el\") ) )...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/emacs-e3-81-ae-e8-a8-ad-e5-ae-9a-e3-82-92dropbox-e3-81-ab-e7-bd-ae-e3-81-8f.html",
        "teaser":null},{
        "title": "NTEmacs",
        "excerpt":"Windows上では長年Meadowを使ってるんだけど、さすがに古すぎて他のプラットフォームと設定を共通化できず、色々面倒になってきた。 23.2のビルドを探してみたところ、gnupackに含まれているNTEmacsが良さそうなので入れてみる。 gnupackは入れても入れなくても良い。（たぶん） 日本語入力も問題ないし、透過もきく。 cmigemoだけちょっと面倒だけど、問題になるのはそこくらい。あ、環境変数%HOME%はちゃんと設定しておこう。 まぁ、基本Windows上で開発はしないから、エディタの用途もあんまりないんだけどね。     ちなみにフォントと透過の設定は以下のような感じ。  ;; フォント (set-face-attribute 'default nil         :family \"MeiryoKe_Console\"         :height 110) (set-fontset-font \"fontset-default\"         'japanese-jisx0208         '(\"MeiryoKe_Console\" . \"jisx0208-sjis\")) ;; 透過 (set-frame-parameter nil 'alpha 85) (add-to-list 'default-frame-alist '(alpha . (0.85 0.75)))  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/ntemacs.html",
        "teaser":null},{
        "title": "rspec2と1の共存？",
        "excerpt":"勢いでrspec2をインストールしてしまったんだけど（ついでにRails3も入った）、その状態だとrspec1由来のspecがrspec2のgemを読み込もうとしてエラーになる。 解決するには、spec（/usr/bin/specとか、rvm環境なら~/.rvm/gems/ruby-*/bin/spec）を直接書き換えて  version = \"&lt; 2.0.0\"  を指定してしまえばいい。 しかし、もう全然別物と言ってもいいんだからgem名も変えてほしかったなぁ…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/rspec2-e3-81-a81-e3-81-ae-e5-85-b1-e5-ad-98-ef-bc-9f.html",
        "teaser":null},{
        "title": "ruby1.9.2",
        "excerpt":"せっかくrvmを入れたので、ruby1.9.2をインストールしてみた。  rvm install 1.9.2  で終わり。 ついでに、ちょうどWindows環境をWindows7に移行したので、Windowsのrubyも1.9.2(x64)にしてみる。 と言ってもWindows上で開発はやらないんだけど。    さて、自作のスクリプトを1.9.2で動かしていて、Floatの扱いでちょっとハマった。 超既出っぽいけど、1.9.2はFloatの精度が違うので、例えば  puts (32.3-26.8)/2 #=&gt; 2.7499999999999982  になったりする。  require \"bigdecimal\" x = BigDecimal::new(\"32.3\") y = BigDecimal::new(\"26.8\") z = (x-y)/2 puts z.to_f  で従来通りの精度になるけど、なんか間違ってる気がする… すいません、数字苦手なんで間違ってたら指摘して下さい。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/ruby1-9-2.html",
        "teaser":null},{
        "title": "rvm",
        "excerpt":"acBookAirにruby開発環境を構築する際に、元から入っているrubyとMacPortsで入れたrubyでgemがごっちゃになってしまい、訳が分からなくなってしまった。 まぁ、今時sudo gem installとかやってるのはアレですよね。 と言うわけでrvmをインストールしてユーザ環境以下で管理することにした。    gemで入れてもいいけど、システムに食い込まないのでソースからの方がむしろ簡単かと。 まず、適当なディレクトリにrvmのリポジトリをcloneしてからインストール。  git clone git://github.com/wayneeseguin/rvm.git cd rvm/ ./install  rvmの正体はシェルスクリプトなので、後は.zshrcの最後に  [[ -s \"$HOME/.rvm/scripts/rvm\" ]] &amp;&amp; source \"$HOME/.rvm/scripts/rvm\"  を追加。sourceで読み込んで、  rvm install 1.8.7 rvm use ruby-1.8.7  でとりあえず1.8.7を使うようにする。 念のため、.zshrcの最後にもrvm use ruby-1.8.7を入れておいた。   以後はgemが~/.rvm/gems以下に入るようになるので、デフォルトで入っているrubyが〜とか悩まなくて良い。 1.9.2環境との併用とかについては後でまた。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/rvm.html",
        "teaser":null},{
        "title": "続rvm",
        "excerpt":"先日の記事のように、何もオプションを付けずにrvm install ruby-1.8.7とかやるとopensslやreadlineなしでインストールされてしまう。 このへんのライブラリが入ってないと動かないgemが出てくるので、改めて入れ直した。 rvm package install opensslとか個々に指定してもいいけど、rvmが用意するパッケージを全部入れるにはRuby Enterprise Edition向けのオプションを利用すると楽。   rvm remove ruby-1.8.7 rvm package install ree_dependencies rvm install 1.8.7 -C --with-readline-dir=$rvm_path/usr --with-iconv-dir=$rvm_path/usr --with-zlib-dir=$rvm_path/usr --with-openssl-dir=$rvm_path/usr   Linuxならlibreadline-devあたりのパッケージを入れておいた方が安全かも。 gemは入れ直さないでも大丈夫でした。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/e7-b6-9arvm.html",
        "teaser":null},{
        "title": "rspec-mode",
        "excerpt":"rails-modeは使ってない（rinari派）ので入れてなかったんだけど、ふと思い直してrspec-modeを入れてみたら便利すぎた。 describeとかitにカーソルを持って行ってC-c , s とやるだけでそのエクスペクテーションが実行される。 今までターミナルに移っていちいちspec -lineとかやってたのが馬鹿みたいだ。 ただし、デフォルトだとrake specが走るので、   (require 'rspec-mode) (custom-set-variables '(rspec-use-rake-flag nil))   とやって無効にしておくと良い。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/rspec-mode.html",
        "teaser":null},{
        "title": "RAMBACK",
        "excerpt":"Firefoxのタブを開いたり閉じたりしているとメモリ消費量が膨れあがっていくのは周知の事実。 適当なところでFirefoxを再起動して解決していたが、再起動することなくメモリを解放してくれるというプラグインRAMBACKというのがあったので試してみた。   こんな感じにメニューにClear Cachesというのが入るので選択するだけ。       とりあえずMacで試す。      減って…る…？ Windows7でも試した。      ↓      減って…   結論：気休め   再起動ボタンの方がお勧め。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/01/ramback.html",
        "teaser":null},{
        "title": "gitの履歴を消す",
        "excerpt":"正確には「履歴を消した新しいリポジトリを作る」 滅多にやらないと思うけどメモ。 forkしたリポジトリを公開する時とか？ リモートに空のリポジトリを作る mkdir /git/new_repository.git cd /git/new_repository.git git init --bare --shared=true ローカルにcloneして内容をコピー git clone remote://git/new_repository.git cd ~/old_repository git checkout-index -a -f --prefix=export/ cp -r ~/old_repository/export/* ~/new_repository/ cd ~/new_repository git add . git commit -m 'moved to new repository' git push origin master master以外のブランチも移動するには cd ~/old_repository git checkout my_branch git...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/02/git-e3-81-ae-e5-b1-a5-e6-ad-b4-e3-82-92-e6-b6-88-e3-81-99.html",
        "teaser":null},{
        "title": "gnomeで規定のブラウザを起動",
        "excerpt":"xdg-open [URL]   Emacsからbrowse-urlで「規定のブラウザ」を呼び出すには   (setq browse-url-browser-function 'browse-url-generic       browse-url-generic-program \"xdg-open\")   何も設定してないとfirefox-binを呼び出してるっぽい？それともどっかで設定したかな…  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/02/gnome-e3-81-a7-e8-a6-8f-e5-ae-9a-e3-81-ae-e3-83-96-e3-83-a9-e3-82-a6-e3-82-b6-e3-82-92-e8-b5-b7-e5-8b-95.html",
        "teaser":null},{
        "title": "shell-pop.el",
        "excerpt":"新年の記事でVisor便利！と書いたけど、Emacs上で同じようなことをするelispがあった。 shell-pop.elを使うと、Emacsのどこからでもホットキーでshell-modeあるいはansi-termを呼び出し、もう一度ホットキーを押すと閉じることができる。 ちょっとだけコマンド実行したい時に便利。 こんな感じで設定している。   ;; shell-pop with ansi-term (require 'shell-pop) (shell-pop-set-internal-mode \"ansi-term\") (shell-pop-set-internal-mode-shell shell-file-name)  (defvar ansi-term-after-hook nil) (add-hook 'ansi-term-after-hook (function (lambda () (define-key term-raw-map \"\\C-z\" 'shell-pop)))) (defadvice ansi-term (after ansi-term-after-advice (arg)) \"run hook as after advice\" (run-hooks 'ansi-term-after-hook)) (ad-activate 'ansi-term)  (global-set-key \"\\C-z\" 'shell-pop)   C-tに設定する人が多いようだけど（Terminalだろう）、C-tは分割フレーム間の移動に割り当てているのでC-z（Zsh）にした。 デフォルトのC-z（Minimize）は使わない、と言うかうっかり触って最小化することが多いので無効にしてるし。ああでも-nwで起動した時はScreenとぶつかって邪魔だから何か考えないと…   なお、Cocoa Emacsだとなぜか画面半分くらいで折り返されてしまって使いにくい。 font spacingの問題っぽいんだけど、解決策は今のところ不明。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/02/shell-pop-el.html",
        "teaser":null},{
        "title": "git commitの統合",
        "excerpt":"gitで過去のcommitを統合する方法。 直したつもりで直ってなかった時や、やむなく作業途中でcommitしたのを消した いときに便利。 これ使えばこないだの履歴消去は不要だった気がする…   git rebase -i HEAD~5   とするとエディタが開いて、こんな一覧が出てくる。    pick xxxxxxx 新機能追加！ pick xxxxxxx なんか動かないので修正 pick xxxxxxx やっぱり動かないのでもう一度修正 pick xxxxxxx 今度こそ修正完了！ pick xxxxxxx コメントにtypoがあったぞコラ   一番下が最新のcommitなので注意。 これを   pick xxxxxxx 新機能追加！ squash xxxxxxx なんか動かないので修正 squash xxxxxxx やっぱり動かないのでもう一度修正 squash xxxxxxx 今度こそ修正完了！ squash xxxxxxx コメントにtypoがあったぞコラ   に変更してエディタを終了すると、通常のcommitと同様に再度エディタが開くの で、何食わぬ顔で   新機能を追加 バグはありません！   とか書いてcommit完了すれば、悪戦苦闘した歴史は抹消される。素晴らしい。 なお、pickをeditにするとコメント書き換えになります。git commit –amendの過去バージョン？  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/02/git-commit-e3-81-ae-e7-b5-b1-e5-90-88.html",
        "teaser":null},{
        "title": "ディスククラッシュ日記 いちにちめ",
        "excerpt":"サーバのHDDがまたおかしくなったらしく、messagesにI/Oエラーが大量に流れ始めた。 って去年交換したばっかじゃん…Seagateまで俺を裏切るのかっ！ まぁ作業ログはここにあるので余裕だ、と思ったらapacheも応答がない…    幸いmixiにもメモを残していたので、それを元に応急処置を開始。 まず、ログからエラーブロックを特定、32で割って該当のセクタを調べると、えらく手前だった。  dd if=/dev/ad4s1a of=/dev/null skip=224 count=32 conv=noerror =&gt; dd: /dev/ad4s1a: Input/output error  場所は特定できたが、去年のようにアクセスしても代替処理が行われない。 仕方ないのでbadsectのお世話になる。 １つずつずらしてddした結果、254セクタ目が壊れているようだったので、  badsect BAD 254 =&gt; block 254 in non-data area: cannot attach  なん…だと… どうやらディレクトリノードか何かが入っている場所が壊れたようで、badsectが通用しない。 しかもどうやら、壊れたのは/homeらしい…なんてついてない。 もっとも、不幸中の幸いというべきか、FreeBSDの流儀に沿って、homeは/usr/homeへのsymlinkなので、homeの内容そのものは無事だ。 /homeにアクセスすると固まるので、とりあえずvipwでhomeを/usr/homeに書き換え、apacheのDocumentRootも/usr/homeに変更。これで当面の停止は免れた。 本格的な修復は週末に行うことにした。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/03/e3-83-87-e3-82-a3-e3-82-b9-e3-82-af-e3-82-af-e3-83-a9-e3-83-83-e3-82-b7-e3-83-a5-e6-97-a5-e8-a8-98-e3-81-84-e3-81-a1-e3-81-ab-e3-81-a1-e3-82-81.html",
        "teaser":null},{
        "title": "ディスククラッシュ日記 ふつかめ",
        "excerpt":"新品のHDDを持ってNOCを訪れ、交換作業開始。 空いたPCを利用して、HDDには予めFreeBSD8.2をインストールしておいた。   まずサーバをシャットダウンし、持ってきたHDDをSATA0、今までのHDDをSATA1に繋いで起動。 でもって旧HDDの各スライスをマウント。 しかし、ここにきて壊れた旧HDDの/をマウントするとkernel panicするということが明らかになった。なんてこった…   いかんともしがたいので、/usr以下をバックアップして一時作業中止。 またもや不幸中の幸いで、一年前に交換した旧々HDDがそのままになっていたため、passwd等を復旧することができた。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/03/e3-83-87-e3-82-a3-e3-82-b9-e3-82-af-e3-82-af-e3-83-a9-e3-83-83-e3-82-b7-e3-83-a5-e6-97-a5-e8-a8-98-e3-81-b5-e3-81-a4-e3-81-8b-e3-82-81.html",
        "teaser":null},{
        "title": "ディスククラッシュ日記 みっかめ",
        "excerpt":"持ち帰ってきたHDDをUSBケース（と言うかむき出しのクレードル）に納め、EeePC（Ubuntu Linux）に接続。こいつはクラッシュしようが何でもいいので、強引にマウントする。 UFSのオプションでちょっと悩んだけど、  sudo mount -t ufs -r -o ufstype=ufs2 /dev/sdb1 /mnt/temp  これでマウント成功。    途中USBが狂って再起動が必要になったりしたものの、幸い特に問題なくサルベージに成功。 復元が一番面倒だと思っていたBINDの設定は、Sandboxで/var/named以下にまとまってるので、実は/etcをサルベージする必要はそれほどなかったのだった。まぁいいか。 これを機に色々古いまま使っていた設定をモダンにした。 Railsアプリもrvm＋Bundlerに切り替えたいなぁ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/03/e3-83-87-e3-82-a3-e3-82-b9-e3-82-af-e3-82-af-e3-83-a9-e3-83-83-e3-82-b7-e3-83-a5-e6-97-a5-e8-a8-98-e3-81-bf-e3-81-a3-e3-81-8b-e3-82-81.html",
        "teaser":null},{
        "title": "Disaster",
        "excerpt":"震災の犠牲になられた方のご冥福と、被災された方が一刻も早く元の生活に戻れることをお祈りしております。 しかし、電気が寸断されるような状態でもインターネットはさほどの機能低下を起こすこともなく、さすが全面核戦争を想定しただけのことはあるなぁと思ってしまいました。 被災地でもある程度は使えていたようだし、災害時の利用について普段から考えておくべきかも。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/03/disaster.html",
        "teaser":null},{
        "title": "Heroku",
        "excerpt":"ちょっと仕事でデザイナーに使って貰うアプリを書く必要が生じたので、昔ちょっと試したきりのHerokuを使ってみた。 ステージング程度なら自鯖で動かせるので、今まであんま触れる必要がなかったんだよね。まぁ職場に自鯖を知られたくないので仕事に不安定な自鯖はよろしくないので。  なお、小さなアプリなのでフレームワークはsinatraを利用した。    herokuのアカウントや鍵は取得済みとする。 まずgem install heroku、後はいつも通りgitのリポジトリを作成して、  heroku create sample-app  メールアドレスとパスワード入力が求められ（初回のみ？）git remoteにherokuが追加される。 次にアプリ側の対応。 まず以下の内容でconfig.ruを作成。  require 'server' ; run Sinatra::Application  次にGemfileを作成。  source :gemcutter gem 'sinatra', '1.2.0'  で、commitしてpush  git commit -m 'herokuで動くようにした' git push origin heroku  終わり。難しくありませんね。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/03/heroku.html",
        "teaser":null},{
        "title": "再開",
        "excerpt":"あまりにも放置しすぎたので、手近な話題から再開します。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/e5-86-8d-e9-96-8b.html",
        "teaser":null},{
        "title": "静的ファイルの処理はhttpdに任せる",
        "excerpt":"ロードバランサを置いている時、バックエンドのアプリケーションサーバはなるべくタイトな構成にしたくなるのが人情というもの。 ところが、unicornだけ走らせているはずのアプリケーションサーバに比べて、フロントエンドのhttpd(nginx)が走っているテスト用サーバの方が何倍も早いという現象が発生した。 条件を色々変えて確かめた結果、意外な結果になった。   とりあえず結論から書くと、unicornだけを走らせてLBから直接叩くのに比べて、間にhttpd(nginx)を挟んだ方が何倍も速い。    ab（apache benchmark）でベンチマークを取って比較してみた結果が以下の通り。 なお、計測対象にはDBのロードもなくビジネスロジックも最小限しかないアクションを選んだ。   unicorn直（クライアント→ロードバランサ→unicorn(TCP)） 平均397ms 最大17213ms   nginx経由（クライアント→ロードバランサ→nginx(TCP)→unicorn(sock)） 平均65ms 最大300ms   nginxが間に入ると圧倒的に高速になる。（なお、この段階ではnginxにキャッシュはさせていない） さらにvarnishを挟んでみる。   varnish経由（クライアント→ロードバランサ→varnish(TCP)→nginx(TCP)→unicorn(sock)） 平均59ms 最大173ms   うーん・・・静的ファイルならまだしも、動的なコントローラでここまで差が出るとは思わなかった。 nginxは静的なファイルをキャッシュできるので、public以下をキャッシュさせればレスポンスは向上し、unicornも無駄なリクエストを処理しないで済むのでサーバ負荷も減少する。 ここまで考えて気づいたんだけど、Rails3のproduction環境は  config.serve_static_assets = false  がデフォルトになっていて、public以下が自動的にルーティングされないようになっている。 なんでこんな設定になってるんだろうと不思議に思っていたけど、httpd側で静的にルーティングするのが前提だったのね。なるほど・・・   [amazon-product]4048702270[/amazon-product]   入門と題してるけどだいぶ詳しいです。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/e9-9d-99-e7-9a-84-e3-83-95-e3-82-a1-e3-82-a4-e3-83-ab-e3-81-ae-e5-87-a6-e7-90-86-e3-81-afhttpd-e3-81-ab-e4-bb-bb-e3-81-9b-e3-82-8b.html",
        "teaser":null},{
        "title": "Rails3いろいろ",
        "excerpt":"震災後くらいからいじり初めて、Rails3の案件を一つやって、今はRails3.1の案件が進行中。   何と言ってもArel最高。Perl/DBIの頃作ろうとしてうまくできなかったものが実現されている感じ。 オブジェクト志向にどっぷり浸かっている時にSQLで突然手続き志向に戻されるのが嫌だったんだよね。 極力SQL書かないようにしてやってるけど、NOT INとか!=とか否定が入るとどうしてもSQLの断片を書かなくちゃならないのが不満ではあります。    以下、よくハマるところ。   scopeを使って  scope :recent, where(\"created_at &gt; ?\", 1.day.ago)  とかやりたくなるんだけどこれは罠。scopeは生成された時点で評価されるので、production環境だと起動時の1日前になってしまう。 lambdaを使って  scope :recent, lambda { where(\"created_at &gt; ?\", 1.day.ago) }  が正解。   あとdefault_scopeはよく考えてから使った方がいい。 明示的に外さない限り外れないので、むしろ「うっかりロードしたらまずいデータの排除（論理削除とか）」に使うのが正解な気がする。軽い気持ちでorderとか付けておくとfirstとlastがごっちゃになってわけ分からなくなる。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/rails3-e3-81-84-e3-82-8d-e3-81-84-e3-82-8d.html",
        "teaser":null},{
        "title": "ensure_authorizedって必要？",
        "excerpt":"RestGraphを使ってFacebookアプリを書いていて、ドキュメントを参考にしつつ rest_graph_setup(:app_id =&amp;gt; API_ID, :secret =&amp;gt; API_SECRET, :canvas =&amp;gt; CANVAS_NAME, :auto_authorize =&amp;gt; true, :auto_authorize_scope =&amp;gt; 'publish_stream', :auto_authorize_options =&amp;gt; {}, :ensure_authorized =&amp;gt; true, :write_session =&amp;gt; true, :write_cookies =&amp;gt; true, :write_handler =&amp;gt; nil, :check_handler =&amp;gt; nil, :auto_decode =&amp;gt; true, ) とか初期設定しているんだけど、これだとスマートフォン版Facebook（アプリ、ブラウザ共に）で開くと延々とリダイレクトループになってOAUTHが通らない。 ログによると、APIのレスポンスは [javascript] { “error”: { “type”: “OAuthException”, “message”: “Error validating verification...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/ensure_authorized-e3-81-a3-e3-81-a6-e5-bf-85-e8-a6-81-ef-bc-9f.html",
        "teaser":null},{
        "title": "scss-mode",
        "excerpt":"Rails3.1からscssが標準になったので、scss-modeを入れてみる。  (autoload 'scss-mode &amp;quot;scss-mode&amp;quot;) (add-to-list 'auto-mode-alist '(&amp;quot;\\\\.scss\\\\'&amp;quot; . scss-mode)) (setq scss-compile-at-save nil)  Railsだとcssへのコンパイルはいらないので無効にした。 scss-compile-at-saveをtにしてるとセーブするごとにコンパイルが走って鬱陶しい。 これだとsass（ややこしい）も要らないはず。 scssは実に分かりやすいのでデザイナーさんにも啓蒙したい・・・  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/scss-mode-2.html",
        "teaser":null},{
        "title": "delayed_job",
        "excerpt":"Railsで非同期実行する際の定番、delayed_job。 ドキュメントが今一分かりにくかったりforkされまくっててどれがオリジナルか分からなかったりするので、メモしておく。 起動・終了・再起動 bundle exec script/delayed_job start # 起動 bundle exec script/delayed_job stop # 終了 bundle exec script/delayed_job restart # 再起動 restartはプロセスが無いと起動してくれないので、stop→startの方が無難。 capistranoのレシピ namespace :delayed_job do desc &amp;quot;Start delayed_job process&amp;quot; task :start, :roles =&amp;gt; :job do run &amp;quot;cd #{current_path}; RAILS_ENV=#{stage} bundle exec script/delayed_job start&amp;quot; end desc &amp;quot;Stop delayed_job process&amp;quot; task...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/delayed_job.html",
        "teaser":null},{
        "title": "git reset",
        "excerpt":"あちこちいじったけど直近のcommitに戻したい時ってありますよね。   １ファイルだけ元に戻したい時: （うっかり削除した時もこれで戻せる）  git checkout HEAD /path/to/file   全部戻したい時:  git reset --hard   おまけ git管理下にないファイルを一覧する （git statusでも出てくるけど）  git clean -n   削除したファイルをまとめてgit rmする  git add -u   参考:gitでアレを元に戻す108の方法  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/git-reset.html",
        "teaser":null},{
        "title": "Rails3.1+capistrano",
        "excerpt":"Rails3.1でasset pipelineが導入された関係で、3.0のままのレシピでデプロイするといくつか問題が出る。   まずpublic/images、public/stylesheets、public/javascriptsがないというエラー。 エラーが出ても実害はないが、赤文字がずらずら流れるので心臓によろしくない。 これの解決は簡単で、deploy.rbに  set :normalize_asset_timestamps, false  を追加するだけでＯＫ。   ちょっと悩ましいのが、rake assets:precompileをいつ実行するかということ。 ヒューマンエラーをなくすために、まずはdeploy時に実行するようにしてみる。 （deploy.rbではなく）Capfileに  require &amp;quot;deploy/assets&amp;quot;  Gemfileに  gem 'execjs'  を追加。さらにサーバ側にnode.jsをインストールしておく。 これでcap deployすると自動的にrake assets:precompileが実行される・・・んだけど、実はassets:precompileはかなり遅い。appサーバが複数あると全部で実行されるし、大変に効率が悪い。node.jsが簡単にインストールできない環境だとそれも面倒だし。（Ubuntuならapt-getするだけだが） というわけで、assets:precompileはローカルで実行してリポジトリに含めておくことにした。    ついでにcapistranoではないけど、nginxの設定。 unicornに投げる部分は省略して、assetsまわりのみはこんな感じ。          location ~ ^/assets|system/ {                 expires 1y;                 add_header Cache-Control public;                 add_header Last-Modified \"\";                 add_header ETag \"\";         }  例によって静的ファイルはrailsを通さずに処理されるので、圧倒的に早い。   [amazon-product]4797363827[/amazon-product]   必携。電書版はこちら。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/rails3-1capistrano.html",
        "teaser":null},{
        "title": "nginx+fastcgi+APC",
        "excerpt":"このサーバのフロントエンドをapacheからnginxに入れ替えた。 passenger経由で動かしていたredmineがとても遅いというクレームがあったのと、最近apacheいじってなくて設定にちょっと不安が出てきたので。つーかnginxのが設定項目が少なくて楽だし。 参考にしたのはこことこことここ。init scriptとかまんまコピペですいません。 まず、wordpressを動かすためにfastcgiを入れる。fastcgiはubuntuだとphp5-cgiパッケージに入っている。 php周りが入れ替わるのでphp5-mysqlと、ついでにphp-pear、php5-devも入れておく。 でもってapacheなしでfastcgiだけを起動するため、/etc/init.d/php5-fastcgiを書く。 #!/bin/bash BIND=127.0.0.1:8888 USER=www-data PHP_FCGI_CHILDREN=2 PHP_FCGI_MAX_REQUESTS=1000 PHP_CGI=/usr/bin/php5-cgi PHP_CGI_NAME=`basename $PHP_CGI` PHP_CGI_ARGS=&amp;quot;- USER=$USER PATH=/usr/bin PHP_FCGI_CHILDREN=$PHP_FCGI_CHILDREN PHP_FCGI_MAX_REQUESTS=$PHP_FCGI_MAX_REQUESTS $PHP_CGI -b $BIND&amp;quot; RETVAL=0 start() { echo -n &amp;quot;Starting PHP FastCGI: &amp;quot; start-stop-daemon --quiet --start --background --chuid &amp;quot;$USER&amp;quot; --exec /usr/bin/env -- $PHP_CGI_ARGS RETVAL=$? echo &amp;quot;$PHP_CGI_NAME.&amp;quot; } stop() { echo -n...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/nginxfastcgiapc.html",
        "teaser":null},{
        "title": "railsのアップデート",
        "excerpt":"Rails3.1.1のプロダクトをRails3.1.3にアップグレードした時のメモ。   1.Gemfileを書き換える  gem 'rails', '3.1.3' gem 'rack' , '1.3.5'  しかしrackの最新が幾つなのか分かりにくいな。gem outdatedで出てこないから1.3.5で合ってるんだろうけど。   2.bundle update rails bundle updateだけだと本体はアップデートされない。   必要なのはここまで。以下は必要なら。   3.rake rails:update config以下の変更を自動的にやってくれるけど、大抵の場合必要ないと言うか、マイナーアップデートなら手でやった方がいいと思う。   4.rake doc:rails APIドキュメント生成。いらなければ別に。       [amazon-product]4274068668[/amazon-product]   Agile Web Development with Rails第4版の翻訳がやっと出ますね。楽しみ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2011/11/rails-e3-81-ae-e3-82-a2-e3-83-83-e3-83-97-e3-83-87-e3-83-bc-e3-83-88.html",
        "teaser":null},{
        "title": "controller_specでcookieのテスト",
        "excerpt":"メモ。 controller_specでcookie付きのリクエストをテストするには、   controller.stub!(:cookies).and_return(:some_cookie =&gt; { :value =&gt; 'cookie_is_here', :expires =&gt; 1.hour.from_now })   みたいにstubしてからgetすればＯＫ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/controller_spec-e3-81-a7cookie-e3-81-ae-e3-83-86-e3-82-b9-e3-83-88.html",
        "teaser":null},{
        "title": "Facebookアルバムへの投稿",
        "excerpt":"Facebookアプリからアルバムに投稿する方法。 通常のwall postと違って目立つので、アルバムに投げるのが流行ってたりする。 ちなみにpermissionはpublish_streamでＯＫ。   FBGraphにはアルバムに投げるメソッドがあるようだけど、RestGraphにはないため自分で実装しなければならない。 既にやってる人がいるので真似させてもらった。以下のURL参照。   http://forrst.com/posts/post_a_photo_to_the_fb_graph_api_with_ruby-CSa   multipart-postとmyme-typesのgemが必要。 なお、URLを投げても拾ってくれないので、動的に生成される画像についてはローカルにいったん保存してアップロードする必要がある。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/facebook-e3-82-a2-e3-83-ab-e3-83-90-e3-83-a0-e3-81-b8-e3-81-ae-e6-8a-95-e7-a8-bf.html",
        "teaser":null},{
        "title": "favicon",
        "excerpt":"faviconを設定してないとログに404がずらずら並んで鬱陶しいですね。   そんな時はfaviconを適当に作って、headerに &lt;%= favicon_link_tag ‘favicon.ico’ %&gt; とか書いておけばＯＫ。 rails3.1ならファイルはapp/assets/imagesに置く。   なお、faviconのために毎回インスタンス食われるのはもったいないので、前の記事を参考にnginxで静的ファイルを返すようにしておくのが良いかと。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/favicon.html",
        "teaser":null},{
        "title": "Ominauthでtwitter/facebook認証",
        "excerpt":"あけましておめでとうございます。 TwitterとFacebookのどちらでも認証できて、なおかつログイン後にもう一方のアカウントを紐付けできるようにしてみた。 まずOmniauthの設定。1.0になって色々変わってるので、こちらの記事を参考に。 まぁproviderごとのgemを追加して、user_infoをinfoにするだけなんだけどね。 次にモデル。UserとAuthenticationを用意した。 rails g model User nickname:string rails g model Authentication user_id:integer uid:string provider:string screen_name:string access_token:string access_secret:string class User &lt; ActiveRecord::Base has_many :authentications class &lt;&lt; self def create_with_omniauth(auth) user = User.create! do |user| user.nickname = auth[\"info\"][\"nickname\"] end user.authentications.create! do |authentication| authentication.set_attributes auth end user end end def...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/ominauth-e3-81-a7twitterfacebook-e8-aa-8d-e8-a8-bc.html",
        "teaser":null},{
        "title": "unscopedとkaminari",
        "excerpt":"default_scopeを外そうとしてunscopedしてからkaminariのpageオブジェクトにすると奇妙なことになる。 class Item &amp;lt; ActiveRecord::Base default_scope where(:closed =&amp;gt; nil) paginates_per 20 end &amp;gt; Item.scoped.to_sql # =&amp;gt; &amp;quot;SELECT `items`.* FROM `items` WHERE `items`.`closed` IS NULL&amp;quot; &amp;gt; Item.scoped.page.to_sql # =&amp;gt; &amp;quot;SELECT `items`.* FROM `items` WHERE `items`.`closed` IS NULL LIMIT 20 OFFSET 0&amp;quot; &amp;gt; Item.unscoped.to_sql # =&amp;gt; &amp;quot;SELECT `items`.* FROM `items`&amp;quot; # ここまでは想定通り...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/unscoped-e3-81-a8kaminari.html",
        "teaser":null},{
        "title": "Rails3.1へのアップグレード",
        "excerpt":"諸事情からRails3.0のアプリケーションを3.1にアップグレードした。 「簡単」と書かれていることが多く、Railsの流儀に則っていれば実際簡単なんだけど、それ以外の部分についてだいぶ手間取ったので書いておく。 まず、アプリケーション本体についてはASCIIcastの記事の通りにやれば問題ない。 ざっと書いておくと、 rails31ブランチを作成し、Gemfileを更新。 railsだけでなく、mysql2も最新にしておく。 # gem 'rails', '3.0.10' gem 'rails', '3.1.3' # gem 'mysql2', '&amp;lt; 0.3' gem 'mysql2' bundle updateしてdevelopment.rbの # config.action_view.debug_rjs = true をコメントにするだけでとりあえず動く。 もちろん、これだけでは肝心のassets pipelineを使っていないので、3.1の真価は発揮できない。 むしろ大変なのはここから。 今回のアプリケーションの場合、cssは全てデザイナーの作成したものをそのままpublic/stylesheetsに放り込んで使っていた。が、ご存じの通りassets pipelineを有効にするとstylesheetsやjavascriptsは単一のファイルに固められ、パスが変わるのでそのままでは運用できない。 まず、上記のASCIIcastにも書いてある通り、public/images、public/stylesheets、public/javascriptsをそれぞれapp/assets以下に移動する。 まずjavascriptsから。 読み込み順が指定されているものがあるので、application.jsの [javascript] //= require_tree . [/javascript] を [javascript] //= require_directory . [/javascript] に変更、後から読み込むものをapp/assets/javascripts/contrib/以下に配置して [javascript] //= require...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/rails3-1-e3-81-b8-e3-81-ae-e3-82-a2-e3-83-83-e3-83-97-e3-82-b0-e3-83-ac-e3-83-bc-e3-83-89.html",
        "teaser":null},{
        "title": "AASMでInvalidTransitionが出る件",
        "excerpt":"AASMをアップデートしたら、テストで例外が出るようになった。 正しくない状態遷移を行うと例外を返すようになったらしい。 AASMの初期化オプションに:whiny_transitions =&gt; falseを与えてやればいい。 以下は例。   aasm :column =&amp;gt; :aasm_status, :whiny_transitions =&amp;gt; false do   state :prepared, :initial =&amp;gt; true   state :queued 　state :accepted ...   event :accept do     transitions :to =&amp;gt; :accepted, :from =&amp;gt; [:queued]   end ... end   この例だと、whiny_transitionsがtrueならpreparedから直接accept!とかすると例外を投げる。 以前は単に遷移せずpreparedのままだった。   まぁ、例外を投げるのが正しい動作だとは思う。作者もそう言ってるみたい。 あくまで既存のコードをいじりたくない場合ってことで。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/01/aasm-e3-81-a7invalidtransition-e3-81-8c-e5-87-ba-e3-82-8b-e4-bb-b6.html",
        "teaser":null},{
        "title": "ドラッグ＆ドロップでアップロード",
        "excerpt":"Rails3.2でドラッグ＆ドロップするとファイルをアップロードできるようにしてみた。   大体のところは http://kray.jp/blog/rails3-fileupload/ を参考にさせて頂きました。以下、いくつかハマった所だけ。    Webrickやmongrelなら問題ないが、unicornで走らせようとするとrequest.body.lengthがNoMethodErrorを返すので、request.body.sizeに変更する。 さらにtemp_fileの保存時にEncoding::UndefinedConversionErrorが発生するのでforce_encoding(‘utf-8’)を付ける。 以上を修正した_store_uploadメソッドはこんな感じ。  400: Invalid request    あと、元記事ではわざと単純にしてあるのだと思うけど、アップロード完了時のコールバックをlocation.reload();にすると複数ファイルをアップロードした時に中断してしまうので、ajaxで何かしら書く。こんな感じにした。  400: Invalid request    complete_actionにajaxで書き換えるアクションを指定しておいてevalするだけ。   Paperclip初めて使ったけど便利。DBへのblob保存に対応してないけど、確かにS3（+Cloudfront？）使う方が賢い気がするのでいいか。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/e3-83-89-e3-83-a9-e3-83-83-e3-82-b0-ef-bc-86-e3-83-89-e3-83-ad-e3-83-83-e3-83-97-e3-81-a7-e3-82-a2-e3-83-83-e3-83-97-e3-83-ad-e3-83-bc-e3-83-89.html",
        "teaser":null},{
        "title": "assets:precompile問題",
        "excerpt":"Rails3.1+capistranoの続き的なもの。 しばらくローカルでassets:precompileする運用をやっていたが、色々問題があった。具体的には以下のような感じ。   \tデザインの細かな修正ごとにprecompileするので、コミットがassets:precompileだらけになる。 \tprecompileした状態でdevelopment環境をロードすると、coffeescriptで書いた関数が2回実行されたりおかしなことになる。 \tRails3.2だとprecompile時にデフォルトでproductionデータベースに接続しようとするので、そのままのdatabase.ymlのままローカルで実行するとエラーになる。（これは一応RAILS_ENV=development rake assets:precompileで解決可能）    と言うわけで改善を試みた。 参考にしたのはstackoverflowのこのスレ。   まず、Capfileにload ‘deploy/assets’を追加する。この時、必ずload ‘config/deploy’よりも先にすること。そうしないと後述のnamespaceが有効にならない。 次にdeploy.rbに以下のnamespaceを定義。   400: Invalid request    これでassetsのnamespaceが上書きされ、app/assets以下に変更があった時のみリモートでassets:precompileが行われるようになる。 万事解決良かった良かった。   のはずが、環境によってはprecompileが失敗することがある（この問題？）。ソースを追っかけたけどよく分からなかった。3.2.2で解決したかなぁ。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/assetsprecompile-e5-95-8f-e9-a1-8c.html",
        "teaser":null},{
        "title": "続assets:precompile問題",
        "excerpt":"先日のエントリは色々間違ってました。   まず、Rails3.2でDBに接続しに行く問題はapplication.rbにconfig.assets.initialize_on_precompile = falseを追加することで回避できるみたい。RailsGuidesくらいちゃんと読めって話ですよね。このへんは先日の勉強会で教えて貰いました。    あとdeploy.rbでnamespaceを定義して更新時だけprecompileするコードだけど、multistageを使っているとパスがデフォルトになってしまったりでうまく動作しない。（multistageしてない時には正常動作するはず） こちらはちょっと考え直す必要がありそう。うまく行ったらまた紹介します。  上記、別の問題とごっちゃになってました。そのままのコードで問題なしです。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/e7-b6-9aassetsprecompile-e5-95-8f-e9-a1-8c.html",
        "teaser":null},{
        "title": "capistrano/multistageとdeploy_to",
        "excerpt":"前回のエントリでnamespaceに起因すると勘違いした不具合。 capistranoのmultistageでdeploy_toにstageごとに異なるパスを指定すると変になるという話。   multistageを使っている時に、config/deploy/staging.rbに以下のように書いたとする。   400: Invalid request    が、これは期待した動作をしない。deploy:symlinkの時にオーバーライドしたはずのdeploy_toが復活する。もしdeploy.rbでdeploy_toを指定していなければ、デフォルトの/u/apps/#{application}が使われる。   これを回避するには、staging.rbに以下を追加する必要がある。   400: Invalid request    これならdeploy_toが呼び出された時点で評価される。   しかし、全てのrails_envについて（staging.rb,production.rbなど）同じ内容を書かないといけないのでよろしくない。 ぱっと見だと難しそうなので、ゆっくりソースを追って考えてみます。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/capistranomultistage-e3-81-a8deploy_to.html",
        "teaser":null},{
        "title": "真空断熱マグ",
        "excerpt":"真空断熱マグがへこんだので買い換えた。 何となく毎回別々のメーカーのを買っているので、ここらでちょっとレビューしてみる。 保温性能とか重量とかはだいたい一緒なので、その他を中心に。   サーモス「ケータイマグ」 [amazon-product]B001EJNTKY[/amazon-product]   少し太めで持ちにくいが、その分高さは低い。 塗装がはげやすく、すぐボロボロになる。リペイントとか楽しめる人にはいいかも。 蓋のロックはあけやすく、ゆっくり開くのも良い。 飲み口のパーツが掃除しにくく汚れる。   TIGER「サハラマグ」 [amazon-product]B004L2KQFW[/amazon-product]   蓋のロックが固くて開けにくい。勢いよく開く上に、角度が足りず鼻にぶつかる。（サイズや人によるかもしれない） 飲み口は一体化されていて掃除しやすい。 ボディがコーティングされているので塗装がはげない。   象印「ステンレスマグ」 [amazon-product]B005FT3HDI[/amazon-product]   容量が少しだけ少ないが、その分細身で持ちやすい。 底面がわずかに膨らんでいて安定する。 蓋のロックが独特で、開けにくい人もいるかも知れない。勢いよく開くが角度がつけられていて飲みやすい。 飲み口は一体化されていて掃除しやすく、簡易な空気弁がついている。 ボディはコーティングされているようだ。塗装は今のところはげてないが、時間が経ってないのでまだ不明。 なお、たまたまかも知れないけど買ったばかりは妙な匂いがあってなかなか取れなかった。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/e7-9c-9f-e7-a9-ba-e6-96-ad-e7-86-b1-e3-83-9e-e3-82-b0.html",
        "teaser":null},{
        "title": "Emacs23.4",
        "excerpt":"久々にEmacsをビルドした。もちろんCocoa Emacs。 手順はほぼこの通りでOK。   久しぶりにinline patchを当ててみたが、やはりauto-saveとぶつかった時に落ちる。 （auto-save-buffersは使っていないんだけど） これを回避するパッチがmacemacs-jpで流れていたので当てる。   一応、patch -p0で当てられるパッチを作ったので置いておく。  400: Invalid request    一通りパッチを揃えたら以下の手順でビルド。   patch -p1 &lt; ../emacs-23-lion-fullscreen-test.patch patch -p0 &lt; ../inline_patch-svn/emacs-inline.patch patch -p1 &lt; ../fix-shiftmodifier-patch-for-emacs-inline-patch.diff patch -p0 &lt; ../fix-auto-save-crash.patch ./configure --with-ns --without-x make bootstrap make install   ac Mini(Core2Duo 2.4GHz/8G/SSD)でビルド所要時間13分くらい。 思ったよりも速くなってないけど、まぁCore2Duoだしこんなもんか。i7のMiniかiMac出たら欲しいな。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/emacs23-4.html",
        "teaser":null},{
        "title": "varnish&amp;nginx",
        "excerpt":"varnishとnginxを使っているサーバをマイグレーションすることになり、今まで外部のLBを通していたのを直接処理することになった。 そこで問題になるのはSSLの扱い。varnishはSSLを扱えないため（作者はopensslのコードはクソだ、と一刀両断している）、httpsのフロントエンドとしては使えない。 そこで順序を入れ替え、nginxをフロントエンドに、varnishを挟んでunicornに投げるようにした。 具体的には以下の通り。 旧構成:LB→varnish→nginx→unicorn 新構成:nginx→varnish→unicorn varnishはUNIX socketに対応していないので（予定はあるようだが）、unicornを適当なポートで待ち受けさせてやらなければならない。 静的ファイルはフロントエンドのnginxで直接捌くためvarnishにキャッシュさせることはできなくなるが、nginx単体で充分なパフォーマンスが出るので考えなくていいだろう。 nginxを80で待ち受けさせて、静的ファイル以外をバックエンドのvarnishに投げ、varnishがさらにバックエンドのunicornに投げる。 これで問題なく動作しているかに見えたが、実は大きな罠があった。 varnishはGETリクエストしかキャッシュしないため、POSTについてはそのままバックエンドに丸投げになるはずが、間にnginxが挟まったことで全てのリクエストがGETになってしまう現象が発生した。 恐らくvclの記述がまずいのだと思うが、とりあえずnginxの方でGETリクエストのみをvarnishに投げ、それ以外は直接unicornに投げるように変更して解決した。 以下はその設定。 /etc/nginx/sites-available/default upstream varnish { server localhost:8080; } upstream unicorn-rails { server localhost:3000; } server { listen 80; server_name rails-app-sample.larus.jp; root /var/www/rails-app/current/public; error_log /var/www/rails-app/current/log/nginx-error.log; location ~ ^/assets|system/ { expires 1y; add_header Cache-Control public; add_header Last-Modified \"\"; add_header...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/03/varnishnginx.html",
        "teaser":null},{
        "title": "続々assets:precompile問題",
        "excerpt":"先日のエントリの最後に書いたprecompileが失敗する問題の続き。 Rails3.2.3でも解決していなかったので本腰入れて調べてみた。    具体的には、rake assets:precompileを実行すると以下のようなエラーで中断する。   [text] rake aborted! undefined method []' for nil:NilClass   (in /path/to/rails_app/app/assets/stylesheets/application.css) /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-rails-3.2.5/lib/sass/rails/helpers.rb:32:in resolver’ /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-rails-3.2.5/lib/sass/rails/helpers.rb:22:in image_path' /path/to/.rvm/gems/ruby-1.9.3-p125/gems/sass-3.1.15/lib/sass/script/funcall.rb:88:in _perform’ 以下略 [/text]   railsをstableにすると発生しなくなったり3.2.3で復活したり長らく原因不明だったが、githubのこのissueを追っかけてようやく原因が分かった。   cssのurlをassetsに対応させるため、erbを埋め込んで以下のようにしていた。   400: Invalid request    これはprecompileしない環境（development）だとうまく行くが、assets:precompileを実行すると上記のエラーになる。 どうやらasset_pathヘルパが[:custom]オプションを要求するのに対し、sassエンジンが[:custom]オプションなしで初期化されるのが原因らしい。 erbのasset_pathを諦め、styles.css.scssにリネームした上で、以下のように書き換えて解決。   400: Invalid request    asset_pathがsassではasset-pathになるのが分からなくてハマった。RailsGuideに書いてはあるんだけど例が分かりづらい。 sprocketのドキュメントの方が分かりやすいかも。 なお、asset-pathだとimageオプションが必要だが、文字列を生で書くのが気持ち悪い場合、image-pathにするとオプションが不要になる。   400: Invalid request    胸のつかえが取れたー。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/04/e7-b6-9a-e3-80-85assetsprecompile-e5-95-8f-e9-a1-8c.html",
        "teaser":null},{
        "title": "JOINは遅い？",
        "excerpt":"ySQLのJOINが遅いというのはよく言われるが、複数回SQLを発行するのとJOINするのがどちらがましなのか疑問だったので、実際どのくらい遅いのか試してみた。 Rails3.2のプロジェクトを作成し、適当なモデルを作ってconsoleでSQLの実行時間を見る。 サンプルコードはgithubに置いた。 モデルはUser -&lt; Item -&lt; Extraで、Userは100、Itemは10ずつで1000、Extraは10ずつで合計10000のレコードを作成することにする。 seed_fuのフィクスチャを使い、rake db:seed_fuで一気にレコードが作成されるようにした。 この状態（commit:830f6dae26189d4ea83b8753471a166712d50568）で全てのエントリを取得させてみた。 User全件(100件) &gt; User.all.count # SELECT `users`.* FROM `users` =&gt; 1.0ms Item全件(100*10件) 1.JOINした場合 &gt; User.joins(:items).all.count # SELECT `users`.* FROM `users` INNER JOIN `items` ON `items`.`user_id` = `users`.`id` =&gt; 3.2ms 2.JOINせず複数回SQLした場合 &gt; Item.where(:user_id =&amp;gt; User.where(:id =&amp;gt; {:not =&amp;gt; nil}).pluck(:id)).all.count # SELECT...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/04/join-e3-81-af-e9-81-85-e3-81-84-ef-bc-9f.html",
        "teaser":null},{
        "title": "tmux new-windowで環境変数が読み込まれない件",
        "excerpt":"ここのところqiitaの方ばっかり書いていて放置していたけど、たまにはこちらへ。 .tmux.confにnew-window -n pry pryと書いて自動的にpryのウィンドウを開いてたが、brew upgradeとかやってるうちに正常に起動しなくなった。 エラーメッセージが一瞬で消えてしまうので分かりにくいが、tmux new-window \"pry;read v\"とやればじっくり見ることができる。 それによるとどうやらrvmで入れたpryがインタプリタとして/usr/bin/rubyを起動しようとしてSEGVしているらしい。 Twitterで呟いて悩んでいたらサジェストを貰った。 @nysalor tmux showenv -g PATH で tmux が持っている PATH 環境変数を調べられます。 &mdash; 坂口和彦 (@pi8027) November 24, 2012 @nysalor では tmux neww &#39;echo $PATH ; read v&#39; だとどうですか &mdash; 坂口和彦 (@pi8027) November 24, 2012 おお？PATHの先頭に/usr/binが入っているので、rvmのrubyではなくシステムのrubyが呼び出されているようだ。 tmux内のプロンプトでecho $PATHすると正常なんだけど、これは @nysalor なるほど。因みに tmux...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2012/11/tmux-new-window-e3-81-a7-e7-92-b0-e5-a2-83-e5-a4-89-e6-95-b0-e3-81-8c-e8-aa-ad-e3-81-bf-e8-be-bc-e3-81-be-e3-82-8c-e3-81-aa-e3-81-84-e4-bb-b6.html",
        "teaser":null},{
        "title": "東京Ruby会議10",
        "excerpt":"                東京Ruby会議10（#tkrk10）に行ってきました。 ちょっと・・・いや半端なく遠かったですが楽しかったです。 以下、いくつかセッションの感想などを。         Rubyと過ごした半年間（@ihara2525さん）   「一行のアクセスログの向こうには一人のユーザがいる」は感動しました。名言ですな。 あ、そこ「ユーザ一人でもリクエストは複数飛ぶじゃん？」とか言ってはいけない。   Rubyistのためのデザイン講座（#p4dの皆さん）   p4dという勉強会を主催されている方々によるワークショップです。 Twitter Bootstrapを使いつつ、Bootstrapぽくないデザインの方法などを教えていただきました。 デザイナーの発想と言うか、「まず何から見るか？」「何から考えるか？」という着眼点が非常に面白く参考になりました。 p4dもいずれ参加してみたいと思います。   Jenkinsと分散ビルド（@shishi4twさん）   ぼっち開発者なのもあってCIは使っていなかったのですが、分散ビルドのメリットが理解できました。 やってみようかな？   How to change the world（Matz）   参加者の頭の中に直接語りかけるという斬新な方法での講演でした。 小さな世界から変えていこう、モチベーションを大事にしよう、といういつもの（そして大事な）お話。   DELUXURY TORUBY TYO 2013（#torubyの皆さん）   torubyの咳さんによるDRubyとDripのハンズオン。 Dripの仕組みを理解することで、KVS全般に対する理解も深まった気がします。 Dripはもっと流行ってもいいと思うんだ・・・   ブログのススメ（@netwillnetさん）   最近、鳥とか小人に吸い取られてちゃんとブログ書いてませんでしたが、書く理由みたいのを再発見できました。 ちゃんと書こう。うん。   あと、Twitterでなにかと構って下さってる@kazuhisa1976さんとお話しできたのが嬉しかったです。 Jenkinsの話はとても参考になりました。ありがとうございます。   最後は大雪で中止になってしまいましたが、これもまた良い思い出になるかと。 スタッフ及び発表者、スポンサーの皆様どうもありがとうございました。 次はThe Rubykaigiでお会いしましょう！ え・・・グンマーはちょっと・・・   ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2013/01/e6-9d-b1-e4-ba-acruby-e4-bc-9a-e8-ad-b010.html",
        "teaser":null},{
        "title": "繋がらないWiFi",
        "excerpt":"東京Ruby会議に参加して、ネットが繋がらない！と嘆いている人を大勢見ました。 Ruby会議に限らず、最近の勉強会やイベントは公式のハッシュタグがあり、Twitterで感想や突っ込みを入れるのがお約束になっていますが、参加者の多いイベントではネットが繋がりにくくなることが増えています。 なぜ繋がりにくくなるのか、繋がるようにするにはどうすればいいのか、自分の経験を交えて少し考察してみます。 なお、無線通信の専門家ではないので、間違っていることを書いていたら指摘していただけると幸いです。    移動体通信とポータブルルータもかなり普及してきて、エンジニアなら大抵持っているどころか、２つ以上持っているという人も割と多いのではないでしょうか。いわゆるテザリングも原理としては同じです。 こうしたルータとPC等の機器の間は、多くの場合WiFiで接続されます。ほとんどのルータはIEEE802.11g/n規格になっていて、これは2.4GHz〜2.5GHzの帯域を利用します。 WiFiの電波は「チャンネル」という分け方をされていますが、これは周波数帯を20MHzで区切って「ここからここまでの周波数帯は何チャンネル」という意味です。もし、一つのチャンネルをいくつもの無線機器が利用しようとすると、電波がお互いに干渉を起こし、伝送エラーが頻発します。TCP/IPはエラーパケットがあれば再送を要求するため、混雑は爆発的に増大し、やがて輻輳（通信要求が過大になって繋がらなくなること）を起こします。   チャンネルをうまく棲み分けできれば問題は発生しにくくなるように思えますが、実はチャンネル同士は完全に独立しているわけではなく、スペクトラム拡散によって前後のチャンネル（で確保している周波数）にも電波が飛んでいます。 WiFiアナライザーのようなツールを使って調べると、電波が指定したチャンネルを中心に山形になっているのが分かると思います。 隣接するチャンネル同士が混雑すると、やがて同様に輻輳が発生すると思われます。   加えて、多くの人はルータのチャンネル設定を「自動」にしていると思いますが、これが曲者で、「自動」は「ルータを起動した時に空いているチャンネルを探す」ようになっています。家庭やオフィスで固定して使っている場合にはそれでも問題ないことがほとんどですが、ポータブルルータはずっと電源を入れっぱなしということも多く、「起動した時に空いていたチャンネル」を頑なに維持するため、空いているチャンネルを使うとは限りません。と言うかアナライザーで調べてみると分かるのですが、ほとんどのポータブルルータはチャンネル「1」を利用しています。起動した時に周囲にWiFi機器が存在しなかったのでそのままなのでしょう。              全く繋がらなくなっていた東京Ruby会議メインホールのWiFi状況。  また、ここでは詳しく述べませんが、携帯やスマートフォンで利用する3GやLTE回線も大勢の人が集まれば輻輳します。（LTEの方が速度が速い分輻輳しにくいと思われます）   3Gが輻輳すると、携帯は空いている周波数を探し始めるので、電池が急速に消耗するという副次的な問題も発生します。   さて、それではイベント等で大勢の人が集まる時、輻輳を回避するにはどうすればいいかを考えてみます。   まず大原則として、各自が持参するポケットルータの電源は切ってもらいましょう（スマートフォンはテザリングを無効にする）。たまに「回線を使わせて貰うのは申し訳ない」と言ってわざわざ自前の回線を使おうとする人がいますが、百害あって一利なしです。周波数帯は有限の資源ということを忘れないようにしましょう。   次に、なるべく同時接続数の多い無線LANアクセスポイントを用意します。家庭用のブロードバンドルータ等は同時接続数が少なく、チャンネルが輻輳するより遥かに前に接続障害が起きてしまいます。法人向けのモデルでは50〜100クライアントが接続可能なものもあります。接続数の少ないルータを多数持ち寄るなどの場合、チャンネルをうまくずらし、設置する場所を検討するなどして干渉を避けるべきです。後述するRubykaigiの実例が参考になると思います。   複数のアクセスポイントを設置する場合、理想的には使用しているチャンネルの前後２チャンネルずつを空けて、５チャンネルずつ利用するのが最も干渉が少なくなると思われます。すると実質的に利用できるのは1/5/9/13の４チャンネルになります。若干の干渉を許容するなら1/4/7/10/13の５チャンネルでも良いかも知れません。参加者の人数、WiFi利用率、会場の広さなどを検討し、最適な配置を考えると良いかと思います。また、アクセスポイントが均等に利用されるような工夫も必要です。                 ネットワーク設計を手伝った某イベント会場のWiFi状況。 ４つのアクセスポイントを干渉しないように設置。会場収容限度が200人程度なので、この位で十分と判断した。 ４つの大きな山以外は近隣のWiFi。  さらに巨大なイベントになると、キャッシュサーバの利用、TCPセッションのタイムアウトを極小にするなどの工夫が必要になります。これについては、素晴らしいネットワーク環境を提供していただいた2011年のRubykaigiについて、構築を担当した小岩さんがるびまに寄稿した記事を読んでいただくのが良いと思います。大変参考になる記事です。  ","categories": [],
        "tags": [],
        "url": "http://localhost:4000/2013/01/e7-b9-8b-e3-81-8c-e3-82-89-e3-81-aa-e3-81-84wifi.html",
        "teaser":null}]
