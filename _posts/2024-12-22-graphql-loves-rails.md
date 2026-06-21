---
layout: post
title: "graphql loves rails"
date: 2024-12-22
---
この記事は[リサーチ・アンド・イノベーション 開発者ブログ](https://rni-dev.hatenablog.com/) のアドベントカレンダーに掲載した記事を一部手直ししたものです。

## graphql

皆さんgraphqlしてますか？
今を去ること3年弱(＊git blame調べ)私の所属するサーバサイド開発チームはgraphqlを今後の技術として選択しました。
当時gprc or graphqlで議論したのですが、Ruby(Rails)でgrpcはどうも厳しそうだったこと、アプリ開発チームがgraphqlの方を好んだことなどからgraphqlを選んでいます。
Rest APIからgraphqlにシフトした理由としては、以下のような目論見がありました。

- APIの開発終了を待たずに同時進行でアプリの開発を進めたい(mockがしやすい)
- schemaという形で自動的に仕様書が作成される
- 引数やレスポンスを追加してもアプリの実装を大きく変更しないで済む

一方でいくらかのconsがあることも理解しており、一度に全てを移行せず**まずは新規開発する機能についてgraphqlで開発しつつ、既存のRest APIについては徐々に切り替えて行く**方針に決まりました。

## graphql-ruby

https://graphql-ruby.org/

現在、railsでgraphqlを使うならこれ一択だと思います。
開発も活発ですし、一通りの機能が揃っていて、使っている人も多いため情報もすぐ見つかります。
かゆいところに手が届かない場合はプラグインも書けます。
以下、簡単にgraphqlの実装方法と、陥りがちな問題などについて書いてみようかと思います。
なおgraphqlの基本的な思想などについては割愛します。

## 基本的な実装

まずいつもの通り、Gemfileに以下を追加してbundle installします。

```ruby
gem 'graphql'
group :development do
  gem 'graphiql-rails'
end
```

graphiqlはブラウザ上でgraphqlクエリを実行できるUIです。
必須ではありませんが、開発環境で `http://localhost:3000/graphiql` にアクセスして試すことができます。

次に前準備を行います。

```sh
rails g graphql:install
```

これでコントローラ `app/controllers/graphql_controller.rb` と `app/graphql/` 以下のファイルが生成されます。

## query_type(resolver)にfieldとqueryを書く

最初にすることはfieldとqueryの追加です。
`app/graphql/types/query_type.rb` に以下を追加します。

```ruby
## app/graphql/types/query_type.rb

module Types
  class QueryType < Types::BaseObject
  field :item, Types::ItemType, null: false, description: 'fetch item' do
    argument :item_id, ID, required: true
  end
  def item(item_id:)
   Item.find item_id
  end
end
```

`Item` というモデルがあると仮定して、それを1つ持ってくるクエリです。
**fieldに指定したシンボルと同じ名前のメソッド**を作り、引数は `argument` で設定したのと同じ名前にします。
次にレスポンスの型を `app/graphql/types/item_type.rb` として作成します。

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
```

たったこれだけでgraphqlで以下のクエリが実行できるようになります。

```graphql
query getItem($itemId: ID!) {
  item(itemId: $itemId) {
    id
    name
    price
  }
}
variables {
    "itemId": 1234
}
```

注意する点として、フィールド名(=関数名)や引数はrailsで設定した `snake_case` を `camelCase` に変換したものになるということです。
この場合 `item_id -> itemId` `item -> item` (lowerCamelCaseなのでそのまま) になっています。
変換ルールが分からない場合はrails consoleで `'item_id'.camelize(:lower)` とやれば得ることができます。

ちなみにレスポンスは以下のようになります。

```json
{
  "data": {
    "item": {
      "id": "1234",
      "name": "コンデンススープクリームパンプキン",
      "price": "1500"
  }
}
```

### nullable or not nullable

良い点として、 `argument` や `field` に `null: false` を付けておくことで、graphql上でもnot nullableとして扱われるため、**クライアント(アプリ)の実装時にnullableかどうかはっきり分かる**ようになります。
ruby側でも簡単なテスト(後述)で判定できるようになるためかなり便利です。
`rubyらしくなくなる` という違和感はややありますが、あくまでgraphqlの実装中だけに限定されるのでモデルのロジックに入れたりするよりは気が楽だと思います。

## attributeに手を加えたい場合

[draper](https://github.com/drapergem/draper)や[active_decorator](https://github.com/amatsuda/active_decorator)のようにDBの値そのままでなく、手を加えた値を返したいことがあります。
その時は単にtypeクラスのメソッドでオーバライドしてやればOKです。

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end

  # Item#priceがオーバライドされる
  # Itemモデルのインスタンスはobjectに格納されている
  def price
    "#{object.price}JPY"
  end
end
```

attributeを追加したい場合はfieldも追加します。

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :price_with_currency, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end

  # graphql上ではpriceWithCurrencyになる
  def price_with_currency
    "#{object.price}JPY"
  end
end
```

## アソシエーション

関連モデルを一度に取得することもできます。
ただし単純に実装すると**N+1問題が発生しやすくなる**ので注意です。(後述)
`Category` というモデルがあると仮定します。
`Category` モデルは `Item` モデルから `belongs_to` で紐付いています。

```ruby
## app/graphql/types/category_type.rb

module Types
  class CategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
```

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :category, Types::CategoryType
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end
end
```

fieldにカスタムスカラー( `Types::CategoryType` )を追加するだけです。
これでitemクエリでcategoryも取得できるようになります。

```graphql
query getItem($itemId: ID!) {
  item(itemId: $itemId) {
    id
    name
    price
    category {
        id
        name
    }
  }
}
variables {
    "itemId": 1234
}
```

レスポンスは以下のようになります。

```json
{
  "data": {
    "item": {
      "id": "1234",
      "name": "コンデンススープクリームパンプキン",
      "price": "1500",
      "category": {
        "id": "567",
        "name": "インスタント食品"
      }
  }
}
```

## ページネーション

複数の `Item` を取得するクエリは以下のように実装します。
fieldのtypeが `[]` に入って配列であることを示しています。

```ruby
## app/graphql/types/query_type.rb

module Types
  class QueryType < Types::BaseObject
  field :items, [Types::ItemType], null: false, description: 'fetch items' do
    argument :category_id, ID, required: true
  end
  def items(category_id:)
   Items.where(category_id:)
  end
end
```

当然ですが、これだと全てのitemが取得されてしまいます。
[kaminari](https://github.com/kaminari/kaminari) みたいにページネーションさせたいですよね。
組み込みの `connection_type` というのがあるのでそれを使います。

```ruby
## app/graphql/types/query_type.rb

module Types
  class QueryType < Types::BaseObject
  field :items, Types::ItemType.connection_type, null: false, description: 'fetch items' do
    argument :category_id, ID, required: true
  end
  def items(category_id:)
   Items.where(category_id:)
  end
end
```

これだけでページネーションを実現できますが、方式は `Relay Cursor Connections` というgraphql特有の形式になるので注意です。
クエリは次のような形式になります。

```graphql
query getItems($categoryId: ID!) {
  items(categoryId: $categoryId, first: 10) {
    edges {
      cursor
      node {
        id
        name
        price
        category {
          id
          name
         }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      startCursor
      hasPreviousPage
    }
}
variables {
    "categoryId": "567"
}
```

レスポンスは以下のようになります。

```json
{
  "data": {
    "items": {
      "edges": [
        {
          "cursor": "AA",
          "node": {
            "id": "1234",
            "name": "コンデンススープクリームパンプキン",
            "price": "1500",
            "category": {
              "id": "567",
              "name": "インスタント食品"
            }
          }
        },
        {
          "cursor": "AB",
          "node": {
            "id": "1238",
            "name": "コーンクリームスープ",
            "price": "1100",
            "category": {
              "id": "567",
              "name": "インスタント食品"
            }
          }
        },
        ...
        {
          "cursor": "BB",
          "node": {
            "id": "1421",
            "name": "野菜入り味噌汁",
            "price": "600",
            "category": {
              "id": "567",
              "name": "インスタント食品"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "AA",
        "endCursor": "BB"
      }
    }
  }
}
```

`cursor` の値は不定です。(たぶん)

## Dataloader

上記の `items()` クエリは `Item` モデルと関連する `Category` モデルを一度に持って来れますが、このままの実装だとN+1問題が発生します。
具体的には取得する `Item` の数だけ `categories` テーブルへのSELECTが行われてしまいます。
Rest APIの場合、N+1問題は `includes` や `preload` を使って解決するのがセオリーでした。
graphqlの場合でも、 `query_type.rb` で以下のようにすることでN+1は防げます。

```ruby
## app/graphql/types/query_type.rb

module Types
  class QueryType < Types::BaseObject
  field :items, Types::ItemType.connection_type, null: false, description: 'fetch items' do
    argument :category_id, ID, required: true
  end
  def items(category_id:)
   Items.includes(:category).where(category_id:)
  end
end
```

ただしこの方法にも問題はあります。
まず、graphqlのメリットとして**モデルのどの要素が呼び出されるかクエリで指定されている＝不要なアソシエーションを解決しなくて良い**というのがありますが、includes(preload)はそのメリットを潰してしまいます。
この例だとcategoryを要求してない場合でもテーブルをjoinしてしまい、パフォーマンスが悪化します。
(ただしgraphql-rubyでは指定された要素＝カラムだけをSELECTするような実装にはなっていない)

この問題を解決するために利用されるテクニックを**バッチローディング**と言います。
簡単に言うと、親子関係になっているtypeをクエリが発行される際に遅延ローディングにしておき、全てのtypeを取得し終わる時にまとめてローディングする仕組みです。
graphql-rubyで使えるいくつかの実装がありますが、最近のgraphql-rubyにはdataloaderがバンドルされているのでそれを使います。
なおdataloaderはFiberを使っているため、ruby3以降ではノンブロッキングI/Oになります。なるはず。きっとなってる。

dataloaderを使うには以下のようにします。

```ruby
## app/graphql/sources/category_by_id.rb

module Sources
  class CategoryById < GraphQL::Dataloader::Source
    def initialize
      @model_class = ::Category
    end

    def fetch(ids)
      records = @model_class.where(id: ids)
      ids.map { |id| records.find { |r| r.id == id } }
    end
  end
end
```

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :category, Types::CategoryType
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
  end

  def category
    dataloader.with(::Sources::CategoryById).load(object.category_id)
  end
end
```

これだけで自動的に遅延ローディングが行われて、 `Category.where(id: ids)` が最後に一度だけ実行され `category` が読み出されます。
コードを読めば分かる通り、結果はidsと同じ並びの配列に入るシンプルな設計になっています。
自分で実装するとハッシュを使ってしまいそうですが、速度やメモリ効率を考えると配列の方が良いのでしょうね。

## queryとmutation

graphqlで対象のデータを作成したり、変更を加える場合には `query` の代わりに `mutation` を定義します。

```ruby
## app/graphql/types/mutation_type.rb

module Types
  class MutationType < Types::BaseObject
  field :create_item, Types::ItemType, null: false, description: 'creeate item' do
    argument :name, ID, required: true
    argument :price, Integer, required: true
    argument :category_id, Integer, required: true
  end
  def create_item(name:, price:, category_id:)
    item = Item.new(name:, price:, category_id:)
    item.save!
    item
  end
end
```

リクエストは以下のようになります。

```graphql
mutation newItem($name: String, $price: Integer, $categoryId: Integer) {
  item(name: $name, price: $price, categoryId: $categoryId) {
    id
    name
    price
    category {
        id
        name
    }
  }
}
variables {
    "name": "インスタントカレー",
    "price": 980,
    "categoryId": 567
}
```

実のところ、graphql-rubyではqueryとmutationにあまり違いはなく、queryで実装しても問題なく動きます。
機能を明確にするためにはもちろん分けた方が良いと思います。

## その他のTips

### queryからtypeに値を渡したい

ヘッダ情報を参照したい場合など、queryからtypeに値を渡す場合は `context` を使います。

```ruby
## app/graphql/types/query_type.rb

module Types
  class QueryType < Types::BaseObject
  field :item, Types::ItemType, null: false, description: 'fetch item' do
    argument :item_id, ID, required: true
  end
  def item(item_id:)
    context[:message] = 'some message'
   Item.find item_id
  end
end
```

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
    fiels :message, String
  end

  def message
    context[:message]
  end
end
```

### type内でargumentsを参照したい

contextを経由しても良いですが、次のような方法でも参照できます。

```ruby
## app/graphql/types/item_type.rb

module Types
  class ItemType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :price, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime
    field :updated_at, GraphQL::Types::ISO8601DateTime
    fiels :message, String
  end

  def message
    context.query.provided_variables[:item_id]
  end
end
```

いざとなったらできますが、あまりやらない方が良さそうですね。

## ファイルアップロード

ところで、httpでgraphqlをどう実現しているかと言うと、決められたendpoint(デフォルトで `/graphql`)にクエリをPOSTするようになっています。
クエリの文法はDSLで決まっており、引数(variables)はJSONですが、**仕組みとしては単なるhttp POST**です。
難しいのが画像などのバイナリファイルをアップロードする場合です。
すぐ思いつくのは、例えばBASE64などでエンコードしてvariablesに含めることでしょう。
実装は簡単ですが、ファイル名や拡張子を渡せないのと、**JSONのパースはオンメモリで行われる**ため、大きなファイルだと落ちてしまう恐れがあります。

## GraphQL multipart request specification

やはりRESTと同様にmultipartでファイルを送りたいところですが、graphqlだと一工夫必要になります。
それが `GraphQL multipart request specification` です。
この仕組みはmultipartでリクエストを3パート(以上)に分け、

- graphql(mutationとvariables)
- 引数とパートのマッピング
- エンコードされたバイナリ

とします。
ポイントは2つ目のマッピングで、 `{ "0": "variables.images" }` のようなJSONでパートと引数のマッピングをします。
具体的な実装は以下のようになります。
Itemモデルには `has_many_attached` で `images` 属性が追加されているものとします。

```ruby
## app/graphql/types/mutation_type.rb

module Types
  class MutationType < Types::BaseObject
  field :create_item, Types::ItemType, null: false, description: 'creeate item' do
    argument :name, ID, required: true
    argument :price, Integer, required: true
    argument :category_id, Integer, required: true
    argument :images, [ApolloUploadServer::Upload], required: true
  end
  def create_item(name:, price:, category_id:, images:)
    item = Item.new(name:, price:, category_id:)
    images.each do |image|
      item.images.attach key: 'path', io: image.to_io
    end
    item.save!
    item
  end
end
```

リクエストはgraphiqlでは再現できず、chrome拡張の [Altair GraphQL Client](https://chromewebstore.google.com/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja?hl=ja&pli=1) 等を使う必要があります。
多くの場合、クライアントの実装ではApolloのライブラリを使うことになるでしょう。
Altairではこのようなリクエストになります。
(Add filesのところに `images.0` を入力して `select files` でファイルを選択)

<figure class="figure-image figure-image-fotolife" title="altair">[f:id:r-n-i:20241222000327j:plain]<figcaption>altair</figcaption></figure>

rails側の実装は簡単ですが、クライアント側との意識合わせが必要となるでしょう。
もちろん、ややこしいのでアップロードだけはRESTで、という選択肢もあると思います。

## テスト

最後にgraphqlのテストの書き方です。
ビジネスロジックはユニットテストでカバーして、受け入れテスト(request spec)はリクエストとレスポンスを検証するだけにしています。
variablesのところを変数にすれば `null: false` について正しいかどうかのテストもできると思います。

```ruby
## spec/requests/graphql/query/item_spec.rb

Rspec.describe 'item query', type: :request do
  subject { post graphql_path, params: { query: } }
  let(:item) { create(:item) }
  let(:query) do
    <<~QUERY
      query getItem($itemId: ID!) {
        item(itemId: $itemId) {
          id
          name
          price
        }
      }
      variables {
          "itemId": 1234
      }
    QUERY
  end

  before { subject }

  it { response.parsed_body['id'].to eq(item.id) }
```

## schemaファイルを出力する

クライアント開発チームと共有する場合など、現在のschemaをファイルに出力したい場合があります。
ビルトインのrakeタスクがあるので簡単に追加できます。

```ruby
## Rakefile
require 'graphql/rake_task'

GraphQL::RakeTask.new(schema_name: 'CodeRailsSchema', directory: './graphql')
```

```sh
bundle exec rake graphql:schema:dump
```

github actionsに定義して自動的に更新させておくと便利です。

```yml
##.github/workflows/rspec.yml

jobs:
  rspec:
    steps:
      - name: Update Graphql Schema
        env:
          RAILS_ENV: test
        run: bundle exec rake graphql:schema:dump

      - name: Commit Graphql Schema Changes
        run: |
          if ! git diff --exit-code --quiet -- graphql/;
          then
            git config --local user.name "$(git --no-pager log --format=format:'%an' -n 1)"
            git config --local user.email "$(git --no-pager log --format=format:'%ae' -n 1)"
            git add graphql/
            git commit -m 'update graphql schema'
            git checkout .
            git fetch origin
            git rebase origin/${{ github.head_ref }}
            git push
          fi
        continue-on-error: true
```

## introspection query

graphql-rubyはデフォルトでintrospection queryが有効になっており、以下のクエリでschemaを得ることができます。

```graphql
{
	__schema {
		types {
			name
		}
	}
}
```

クライアント開発には非常に便利ですが、一方で**悪意のある相手には定義済みのqueryや属性を全て知られてしまうリスク**があります。
ユーザのクライアント開発をオープンにするサービス以外では塞いでおいた方が無難でしょう。
初期設定の `rails g graphql:install` の時に作成されたファイルに一行書くだけで塞げます。(伏線回収)

```ruby
## app/graphql/sample_server_schema.rb

class SampleServerSchema < GraphQL::Schema
  disable_introspection_entry_points unless Rails.env.local?
end
```

この例ではdevelopment, test環境以外でintrospection queryを無効にしています。

## 課題

graphqlの実装にはだいぶ慣れてきましたが、課題がいくつかあります。

### N+1問題

上でも触れましたが、実装によってはN+1問題が発生しやすくなります。
特にアソシエーションが複雑にネストしている場合など、dataloaderで解決するのも難しいことがあります。

### デバッグのしづらさ

httpのエンドポイントが `/graphql` に全てまとまってしまうため、**例外が発生した場合にログから該当のリクエストを探すのが大変**です。
パラメータをunescapeしてDSLをパースして・・・とやらなければなりません。
またパフォーマンスを計測する場合にも、queryごとにレスポンスを分析するのが手間になります。
newrelic, datadogといったツールはgraphqlに対応していてqueryごとに分けてくれるのですが、RESTと混在している場合は別々のページを参照しなければならないなどの問題がありました。

## おわりに

graphqlの採用により、サーバサイド開発では一手間増えたかな？という体験が多いのですが、一方でアプリ(クライアント)開発チームとのコミュニケーションは非常にスムーズになりました。
属性の追加などについても気軽にできるようになり、特にアプリ側ではバージョンの古いアプリの動作に影響を与える心配なく取得する情報を変更できるという大きなメリットがあります。
一方で、先にschemaを決めておいてサーバとアプリの開発を同時進行する、という目論見がありましたが、実装を始めてみると事前に決めたschemaでは不備があるといったケースがしばしばあるため、これは必ずしもうまく行っていません。
しかし、CIで自動的にschemaが生成され、githubでいつでも参照できるというのは大きなメリットだと思います。
今後のチャレンジとしては、Reactを使ったクライアントも書いてみたいと思っています。
