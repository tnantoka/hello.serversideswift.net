# サーバーサイドSwiftをはじめてみよう

2015年12月3日、約束通りSwiftはオープンソース化され、翌2016年にはLinux対応版が正式にリリースされました。  
それまではApple製品用のアプリ開発にしか使えなかったSwiftが、他のプラットフォームでも動くようになったのです。  
この記事はそのSwiftを使ったWebアプリ開発（＝**サーバーサイドSwift**）の入門編です。

もちろんこのサイト自体もSwiftで動いています。

<table>
  <tr>
    <th>更新日</th>
    <td>2016/1/3</td>
  </tr>
  <tr>
    <th>Xcode</th>
    <td>8.2.1</td>
  </tr>
  <tr>
    <th>Swift</th>
    <td>3.0.2</td>
  </tr>
  <tr>
    <th>Vapor</th>
    <td>1.0.3</td>
  </tr>
  <tr>
    <th>OS X</th>
    <td>10.11.6</td>
  </tr>
</table>

## なぜサーバサイドSwiftか

これは、[Swift、Java、Node.js、Ruby、どれを使いますか？サーバーサイドSwiftの優れた点について](https://realm.io/jp/news/tryswift-chris-robert-end-to-end-application-development-swift-backend/)など様々なところで語られています。  
主な利点として挙げられているのは、パフォーマンスや省メモリ、isomorphic、タイプセーフなどです。

これらの他に個人的にサーバーサイドSwiftのメリットだと思っているのが、**iOSアプリしか書いたことのない人にとって学習のハードルが低い**という点です。

僕はNode.jsでサーバーサイドを勉強しましたが、jQueryしかまともに書いてなかった僕にとって言語的な障害がなく学べるというのは本当に救いでした。  
PerlやJavaなどは見事に挫折しましたが、NodeとExpressでサーバーサイドに慣れた後、今はRubyを少し書けるようになりました。

やはり、2つのことを同時に学ぶより、1つに集中して学ぶほうが圧倒的に楽でした。

## 実世界のサーバーサイドSwift

ご存知の通り、サーバーサイドSwiftは世に出たばかりです。  
実際に使われているのでしょうか。

Googleで検索してみると、以下の事例が見つかりましたが、まだ広く使われているとは言えないようです。

- [サーバーサイドSwiftを実運用してみた | カメリオ開発者ブログ](http://aial.shiroyagi.co.jp/2016/02/serverside-swift-in-production/)
- [サーバサイド Swift でウェブページを運用している話 - Qiita](http://qiita.com/mokumoku/items/9d2f41bdd1795c718e55)

そんな状況ですが、僕が好きな2つのサービス（オープンソース）があります。

- [nsdateformatter.com](https://github.com/subdigital/nsdateformatter.com)
- [nsregularexpression.com](https://github.com/wojteklu/nsregularexpression.com)

このNS*.comシリーズは`NSDateFormatter`や`NSRegularExpression`を実際にSwiftで動かし、その結果をブラウザ上で見ることができるものです。  
これらを僕は**Server-side Swift as Live Example**と勝手に呼んでいて、この分野はわりと価値があるのではないかと考えています。  
Playgroundや[IBM Swift Sandbox](https://swiftlang.ng.bluemix.net/#/repl)は確かに手軽ですが、コードを打たずにブラウザ上でさっと確認できるのはやはりいいものです。

これらの影響を受けて、拙作の[StringFilter](https://github.com/tnantoka/StringFilter)というライブラリは、[オンラインで試せる](https://stringfilter.herokuapp.com/)ようにしています。  
UIKitに依存しないライブラリの作者さんには是非やってみてほしいと思っています。

さて前置きはこれぐらいにしておきます。  
サーバーサイドSwiftに興味が湧いたという方は、次から早速手を動かしてみましょう。

## 作ってみよう

### 作るもの

NS*.comシリーズを参考に、NSURLをオンラインで確認できるものを作ってみましょう。  
[NSURLで取得出来るURL(URI)のパラメータ一覧 - 強火で進め](http://d.hatena.ne.jp/nakamura001/20110421/1303404341)を任意なURLに対して見れるようなものです。

[ドキュメント](https://developer.apple.com/reference/foundation/nsurl)やRFCを見れば仕様はわかりますが、それがSwift（特にLinux版）で正しく実装されているかは別問題です。  
なのでブラウザ上で試せることに一定の価値はあるでしょう。

### 完成イメージ

最終的にはこのような画面を目指します。

![](/images/index/goal.png)

### Webフレームワーク

[たくさんのプロジェクト](https://github.com/search?o=desc&q=swift%20web&s=stars&type=Repositories)がありますが、特に人気があるのは以下の3つでしょうか。  
[Server APIs Project](https://swift.org/server-apis/)という動きもあり気になるところですが、メジャーなものは公式APIに合わせた形でメンテナンスが続くと思われるので、好みで選んでよいでしょう。

- [Perfect](https://github.com/PerfectlySoft/Perfect)
- [Vapor](https://github.com/vapor/vapor)
- [Kitura](https://github.com/IBM-Swift/Kitura)

この記事では手軽に使えて、公式ツールでHerokuに簡単にデプロイできるVaporを使います。  
ちなみに、このサイトはKituraで動いています。

Perfectはちょっとがっつりしているので今回は遠慮しておきます。

### Vaporの導入

[Vapor Toolbox](https://vapor.github.io/documentation/getting-started/install-toolbox.html)というコマンドラインツールが提供されているので、それを利用します。

```
$ swift --version
Apple Swift version 3.0.2 (swiftlang-800.0.63 clang-800.0.42.1)
Target: x86_64-apple-macosx10.9

$ curl -sL toolbox.vapor.sh | bash
✅  Compatible
Downloading...
Compiling...
Installing...
Vapor Toolbox v1.0.3 Installed
Use vapor --help and vapor <command> --help to learn more.

$ vapor version
Vapor Toolbox v1.0.3
Use --name to manually supply the package name.
Cannot print Vapor Framework version, no project found.
```

Toolboxをアップデートしたい時は、以下のコマンドを実行します。

```
$ vapor self update
Updating [Done]
```

### プロジェクトの作成

先程導入したToolboxで`NSURL`プロジェクトを作成します。

```
$ vapor new NSURL
Cloning Template [Done]

$ cd NSURL/

$ vapor build
No Packages folder, fetch may take a while...
Fetching Dependencies [Done]
Building Project [Done]

$ vapor run
Running NSURL...
No command supplied, defaulting to serve...
No preparations.
Server 'default' starting at 0.0.0.0:8080
```

この状態で、`http://localhost:8080/`にアクセスすると、以下のような画面が表示されます。

![](/images/index/localhost.png)

#### Xcodeを使う

Vapor ToolboxにはXcodeプロジェクトを生成する機能もあります。

```
$ vapor xcode -y
Fetching Dependencies [Done]
Generating Xcode Project [Done]
Select the App scheme to run.
Open Xcode project?
y/n>yes
Opening Xcode project...
```

これでいつものXcode上で作業ができるようになりました。  
Appスキームを選択して実行すれば、`$ vapor run`したのと同じ結果になります。

### 不要なファイルの削除

今回は単純なプロジェクトなので、RESTfulな構成を想定しているデフォルトのファイルを消します。

- Sources/App/Controllers/
- Sources/App/Controllers/PostController.swift
- Sources/App/Models/
- Sources/App/Models/Post.swift

#### Sources/App/main.swift

以下の`PostController`を使っている部分を削除します。

```
drop.resource("posts", PostController())
```

### `/parse`の追加

`?url=`というクエリストリングで渡されたURLを解析する`/parse`というRouteを追加します。

main.swiftに色々書くと自動テストがしづらくなるので、分割します。  
ここではDropletにExtensionとして追加することにします。  
なお、ファイルを追加する時にデフォルトで選択されている`Core`ターゲットを選ばないように注意しましょう。

#### Sources/App/Droplet+Setup.swift

```
import Vapor
import Foundation

public extension Droplet {
    public func setup() {
        let drop = self

        drop.get { req in
            var context = self.context()
            return try drop.view.make("welcome", context)
        }

        drop.get("parse") { req in
            var context = self.context()
            context["parsed"] = []
            // `req.query?["url"]?.string` does not work with complex URL
            if let urlString = req.uri.query?.replacingOccurrences(of: "\\Aurl=", with: "", options: .regularExpression),
                let url = URL(string: urlString) {
                context["url"] = .string(urlString)
                context["parsed"] = url.parsed
            }
            return try drop.view.make("welcome", context)
        }
    }

    private func context() -> [String : Node] {
        return [ "url" : "" ]
    }
}
```

### parse処理の実装

こちらもURLのExtensionとして実装します。  
parseした結果を配列に格納します。  
VaporではViewに渡す値（context）を`Node`というenumに入れる必要があるので、その形式で返しています。

#### Sources/App/URL+Parse.swift

```
import Vapor
import Foundation

extension URL {
    var parsed: Node {
        guard let url = NSURL(string: absoluteString) else { return .array([]) }
        var array = [
            parse(key: "isFileURL", value: url.isFileURL),
            parse(key: "absoluteString", value: url.absoluteString),
            parse(key: "absoluteURL", value: url.absoluteURL),
            parse(key: "fragment", value: url.fragment),
            parse(key: "host", value: url.host),
            parse(key: "lastPathComponent", value: url.lastPathComponent),
            parse(key: "parameterString", value: url.parameterString),
            parse(key: "password", value: url.password),
            parse(key: "path", value: url.path),
            parse(key: "pathComponents", value: url.pathComponents),
            parse(key: "pathExtension", value: url.pathExtension),
            parse(key: "port", value: url.port),
            parse(key: "query", value: url.query),
            parse(key: "relativePath", value: url.relativePath),
            parse(key: "relativeString", value: url.relativeString),
            parse(key: "resourceSpecifier", value: url.resourceSpecifier),
            parse(key: "scheme", value: url.scheme),
            parse(key: "standardized", value: url.standardized),
            parse(key: "user", value: url.user),
            parse(key: "filePathURL", value: url.filePathURL),
            parse(key: "deletingLastPathComponent", value: url.deletingLastPathComponent),
            parse(key: "deletingPathExtension", value: url.deletingPathExtension),
            // parse(key: "resolvingSymlinksInPath", value: url.resolvingSymlinksInPath),
            parse(key: "standardizingPath", value: url.standardizingPath),
            // parse(key: "hasDirectoryPath", value: url.hasDirectoryPath),
        ]

        #if os(OSX)
            array.append(contentsOf: [
                parse(key: "isFileReferenceURL()", value: url.isFileReferenceURL()),
                parse(key: "fileReferenceURL()", value: url.fileReferenceURL()),
            ])
        #endif

        return .array(array)
    }

    private func parse(key: String, value: String?) -> Node {
        return .object(["key" : .string(key), "value" : .string(value ?? "nil")])
    }

    private func parse(key: String, value: Bool) -> Node {
        return parse(key: key, value: String(value))
    }

    private func parse(key: String, value: URL?) -> Node {
        return parse(key: key, value: value?.absoluteString)
    }

    private func parse(key: String, value: [String]?) -> Node {
        return parse(key: key, value: value?.joined(separator: ", "))
    }

    private func parse(key: String, value: NSNumber?) -> Node {
        return parse(key: key, value: value?.stringValue)
    }
}
```

一部のAPIがLinuxで実装されていないため、`#if os(OSX)`で分岐しています。  
サーバーサイドSwiftを書いていると、Linuxだけうまくいかないということがあるため、`#if os(Linux)`と共にお世話になることが多い分岐です。

### Viewの実装

[Bootstrap](http://getbootstrap.com/)を追加し、URL入力欄などを表示できるようにViewを変更します。  
CSSなどは本来`base.leaf`に追加して共通化すべきでしょうが、ここでは`welcom.leaf`で全て済ませることにします。

#### Resources/Views/welcome.leaf

```
#export("head") {
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">

  <title>NSURL</title>

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" integrity="sha384-AysaV+vQoT3kOAXZkl02PThvDr8HYKPZhNT5h/CXfBThSRXQ6jW5DO2ekP5ViFdi" crossorigin="anonymous">
}

#export("body") {
    <div class="container text-xs-center">
        <h1 class="display-3 mt-3 mb-2"><a href="/">NSURL</a></h1>
        <form action="parse">
            <div class="form-group">
                <input type="text" name="url" class="form-control form-control-lg" placeholder="http://example.com/" autofocus value="#(url)">
            </div>
            <button type="submit" class="btn btn-secondary btn-lg btn-block">Parse</button>
        </form>
        <div class="card mt-2">
            <div class="card-header">#(url)</div>
            <table class="table text-xs-left mb-0">
                <tbody>
                    #loop(parsed, "p") {
                        <tr>
                            <th>.#(p.key)</th><td><code>#(p.value)</code></td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
}
```

### 動作確認

フォームから`http://example.com/`を送信してみます。

![](/images/index/parse.png)

どうやらうまくいっているようです。

### 細かい調整

公開するために細かい部分を修正します。

- スタイルの調整
- `/`にExamplesを追加
- GitHub Corner設置
- AnalyticsやAdsenseの追加

ここはサーバーサイドSwiftにあまり関係ない部分ですので詳細は割愛します。  
完成版のソースコードを御覧ください。

### 自動テスト

せっかくなのでテストを追加しておきましょう。  
「こうした方がもっとSwiftらしいかなぁ」といった時に、テストがあると気軽にリファクタリングができます。

[ドキュメント](https://vapor.github.io/documentation/testing/basic.html)のまま進めるとうまく行かず困りましたが、以下を参考に、`NSURLFramework`にソースを分けるとうまくいきました。  
[Package support for testing by jakerockland · Pull Request #7 · jakerockland/Swisp](https://github.com/jakerockland/Swisp/pull/7/)

#### Package.swift

`Tests`が`exclude`されてるので削除しておきます。  
また、各ターゲットの`dependencies`に`NSURLFramework`を追加します。

```
import PackageDescription

let package = Package(
    name: "NSURL",
    targets: [
        Target(name: "AppTests", dependencies: ["NSURLFramework"]),
        Target(name: "App", dependencies: ["NSURLFramework"]),
    ],
    dependencies: [
        .Package(url: "https://github.com/vapor/vapor.git", majorVersion: 1, minor: 3)
    ],
    exclude: [
        "Config",
        "Database",
        "Localization",
        "Public",
        "Resources",
    ]
)
```

#### Sources/NSURLFramework/

以下のファイルを`Sources/NSURLFramework/`に移動します。

- Droplet+Setup.swift
- URL+Parse.swift

#### Sources/App/main.swift

NSURLFrameworkをインポートします。

```
import NSURLFramework
```

#### Tests/AppTests/AppTests.swift

テストを書きます。  
`http://example.com/`を`/parse`に渡して、`host`と`scheme｀が正しく返ってきていることを確認しています。


```
import XCTest
import HTTP
@testable import Vapor
import NSURLFramework

class AppTests: XCTestCase {
    static let allTests = [
        ("testParse", testParse),
    ]

    func makeTestDroplet() throws -> Droplet {
        let drop = Droplet(arguments: ["dummy/path/", "prepare"])
        drop.setup()
        try drop.runCommands()
        return drop
    }

    func testParse() {
        let drop = try! makeTestDroplet()
        let req = try! Request(method: .get, uri: "/parse?url=http%3A%2F%2Fexample.com%2F")
        let res = try! drop.respond(to: req)
        let body = res.body.bytes!.string
        XCTAssertTrue(body.contains("<th>.host</th><td><code>example.com</code></td>"))
        XCTAssertTrue(body.contains("<th>.scheme</th><td><code>http</code></td>"))
    }
}
```

テストの実行はコマンドラインで行います。（設定すればXcodeでも可能です）  
`$ vapor test`はテストのエラーがわかりづらいので、僕は`$ swift test`を使っています。

```
$ swift test
Test Suite 'All tests' started at 2017-01-01 22:46:28.248
Test Suite 'NSURLPackageTests.xctest' started at 2017-01-01 22:46:28.249
Test Suite 'AppTests' started at 2017-01-01 22:46:28.249
Test Case '-[AppTests.AppTests testParse]' started.
No preparations.
GET /parse
Test Case '-[AppTests.AppTests testParse]' passed (0.055 seconds).
Test Suite 'AppTests' passed at 2017-01-01 22:46:28.305.
         Executed 1 test, with 0 failures (0 unexpected) in 0.055 (0.056) seconds
Test Suite 'NSURLPackageTests.xctest' passed at 2017-01-01 22:46:28.305.
         Executed 1 test, with 0 failures (0 unexpected) in 0.055 (0.056) seconds
Test Suite 'All tests' passed at 2017-01-01 22:46:28.305.
         Executed 1 test, with 0 failures (0 unexpected) in 0.055 (0.057) seconds
```

### CI

Vaporのテンプレートには元々`.travis.yml`が用意されているので、[Travis CI](https://travis-ci.org/)でのBuildも簡単にできます。

#### .swift-version

[swiftenv-install.sh](https://gist.github.com/kylef/5c0475ff02b7c7671d2a/)を使うためSwiftのバージョンを指定します。

```
3.0.2
```

#### Tests/LinuxMain.swift

Linux上で実行するテストを指定します。

```
import XCTest
@testable import AppTests

XCTMain([
    testCase(AppTests.allTests),
])

```

実際のBuild結果は、<https://travis-ci.org/tnantoka/NSURL>で確認できます。

### Herokuにデプロイ

事前に[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)を入れておきます。

```
$ heroku --version
heroku-toolbelt/3.43.14 (x86_64-darwin10.8.0) ruby/1.9.3
heroku-cli/5.5.1-cf2de15 (darwin-amd64) go1.7.3
You have no installed plugins.

$ heroku login

$ vapor heroku init
Would you like to provide a custom Heroku app name?
y/n>y
Custom app name:
>nsurl
https://nsurl.herokuapp.com/ | https://git.heroku.com/nsurl.git

Would you like to provide a custom Heroku buildpack?
y/n>n
Setting buildpack...
Are you using a custom Executable name?
y/n>n
Setting procfile...
Committing procfile...
Would you like to push to Heroku now?
y/n>y
This may take a while...
Building on Heroku ... ~5-10 minutes [Done]
Spinning up dynos [Done]
Visit https://dashboard.heroku.com/apps/
App is live on Heroku, visit
https://nsurl.herokuapp.com/ | https://git.heroku.com/nsurl.git
```

これで、`http://nsurl.herokuapp.com/`でアクセスできるようになります。

コードを更新した時は以下のコマンドで再度デプロイします。

```
$ git push heroku master
```

#### 独自ドメインの設定

```
$ heroku domains:add nsurl.serversideswift.net
Adding nsurl.serversideswift.net to ⬢ nsurl... done
 ▸    Configure your app's DNS provider to point to the DNS Target nsurl.serversideswift.net.herokudns.com.
 ▸    For help, see https://devcenter.heroku.com/articles/custom-domains

The domain nsurl.serversideswift.net has been enqueued for addition
 ▸    Run heroku domains:wait 'nsurl.serversideswift.net' to wait for completion
```

記載されているとおりに、CNAME設定します。

これで、`http://nsurl.serversideswift.net/`上でローカルと同じ物が動くようになりました。（os分岐した部分を除く）
 
全体のコードはこちらにあります。  
[tnantoka/NSURL](https://github.com/tnantoka/NSURL)

長々とお付き合いいただきありがとうございました。  
2017年はサーバーサイドSwiftをはじめてみませんか。

### おまけ

このサイトの作り方もまとめてみました。目次は以下のとおりです。

- Kitura-Starter
- Xcode
- Markdownでコンテンツを書けるようにする
  - Package.swift
  - Sources/Kitura-Starter/Controller.swift
- Textlintの導入
  - package.json
  - .textlintrc
  - 細かい調整
- デプロイ
  - 準備
- クレジットカード情報の登録
- スペースの作成
  - 公開
    - ログイン
    - buildpacksの確認
    - manifest.yml
    - push
  - 独自ドメインの設定

Gumroadで0円からダウンロードできますので、興味があれば是非お試しください。

<script src="https://gumroad.com/js/gumroad.js"></script>
<a class="gumroad-button" href="https://gum.co/JMCd" target="_blank">ダウンロード</a>

この記事を含め原稿はGitHub上にありますので、お気軽にPull RequsetやIssue登録してください。  
日本語で問題ありません。  
[tnantoka/serversideswift.net](https://github.com/tnantoka/serversideswift.net)


