---
layout: post
title: "ActiveRecordからfixtureを作る"
date: 2010-05-21
---

稼働中のDBからfixtureを生成したくなって色々調べてみた。 （csvでエクスポートすればいいじゃんとかいうのは却下） ar_fixturesプラグインが有名だけど、最近のRailsでは色々とめんどくさいらしい。 というわけで[こちらの記事](<http://d.hatena.ne.jp/elm200/20070928/1190947947>)を参考に（というか丸写しで）やってみた。 実行するとschema_migrationsテーブルにidカラムがないよ、というエラー。 そりゃそうだよな、と思って改めてextract_fixtures.rakeを読むと（先に読めよ）
    
    
    skip_tables = ["schema_info"]
    

という行がある。Rails2.1でschema_infoはschema_migrationsに変わっているので、この行を
    
    
    skip_tables = ["schema_migrations"]
    

に変更すればおｋ。 あとはrake db:fixtures:extractで自動的に抽出してくれる。
