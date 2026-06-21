---
layout: post
title: "NTFS volume with Snow Leopard"
date: 2010-06-25
---

ac（Snow Leopard）でNTFSボリュームをrwでマウントするために、[mount_ntfsのラッパーを書く方法](<http://blog.larus.jp/?p=22>)を使っていたが、アップデートによってできなくなったようだ。 同じ方法を使うとmountされず、system.logに diskarbitrationd[13]: unable to mount /dev/disk1s1 (status code 0x00000040). のようなエラーが残る。 % sudo mount_ntfs -o rw /dev/disk1s1 /Volumes/temp とかやるとマウントはされるので、diskarbitrationdの仕様が変わってオプションを渡してくれなくなったのだろうか。

/etc/fstabを書こうか迷ったが、管理が面倒になるので[NTFS-3G](<http://macntfs-3g.blogspot.com/>)を入れてしまった。 NTFS-3Gはいつのまにか[Tuxera NTFS](<http://www.tuxera.com/>)とかいう商用プロダクトに変わっていたのね。オープンソースの方はCommunity Editionとして提供されているけど、今後どうなるか不透明ではある。 ちなみに商用だと他に[Paragon NTFS](<http://www.paragon-software.com/jp/home/ntfs-mac8/>)なる製品も出てますね。
