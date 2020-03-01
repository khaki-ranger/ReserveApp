# ReserveApp
会議室の空き状況を確認して、予約するためのWEBシステム

## サービスの特徴
1. 空き状況の確認や予約する日付は、１日ごとに変更する他、カレンダーから直接指定することもできます
2. 開始時間以降の複数の時間帯の予約が可能です
3. 予約が完了したら入力されたメールアドレスに確認メールが送信されます
4. 管理者アカウントでログインすると、管理ページを開くとこができます
5. 管理者は各スペース毎に日付、期間、曜日でお休みの設定ができます

## 利用イメージ

#### ユーザーサイド

![ユーザーサイド](https://github.com/khaki-ranger/Assets/blob/master/ReserveApp/userSide.jpg?raw=true "ユーザーサイド")

#### 管理者サイド

![管理者サイド](https://github.com/khaki-ranger/Assets/blob/master/ReserveApp/ownerSide.jpg?raw=true "管理者サイド")

## 機能一覧

#### ユーザーサイド
- ユーザー認証
- オフィス、スペース一覧表示
- 空き状況の表示
- 予約機能
- 予約キャンセル機能
- メール送信機能

#### 管理者サイド
- オフィス、スペース編集機能
- お休み管理機能
- 画像アップロード機能

## 使用言語

- javascript / Node.js

## フレームワーク

- Express

## データベース

- PostgreSQL

## 使用技術一覧
 
| 内容 | 実現方法 |
----|----
|ユーザー認証 |passport |
|メール送信 |nodemailer |
|ファイルアップロード |multer |
|画像ストレージ |AmazonS3 |
|CDN |AmazonCloudFront |
|モジュールハンドラ |webpack |
|ORM |sequelize |
