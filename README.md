# Workshop

## DeepFoundationsJS

```ruby
學習 Kyle Simpson 進階 JS 課程的練習 
```
1. ex1
  - value types and coercions
  - validation logic

## PTTMailer

```ruby
使用npm模組化設計，做到"自動排程" -> "爬文" -> "儲存" -> "寄到信箱"４個功能
```
## coursera

1. basic-auth

***
*注意, 在測試所有功能之前 MongoDB server 都必須先打開*
// 安裝所有相依包
*npm install*

***

```ruby
  1. server.js
  實做一個要求輸入"帳號密碼"的簡易認證功能。
  2. server2.js
  用戶端輸入"帳號密碼" -> Server端傳送"Signed cookie"給使用者 -> 用戶端爾後的req.headers都會帶cookie
  3. server3.js
  成功登入後，Server端儲存在session紀錄的資料，並傳輸給用戶端的 cookie，
  用戶端的記憶體會儲存這些資料，用戶端在後續的req會帶著session資訊供Server端查詢。
```

2. rest-server-passport

```ruby
利用Express framework開發REST API，
Routing "GET"、"POST"、"DELETE"、"PUT" 四個動作，
對應"查詢"、"新增"、"刪除"、"更新" 四個功能
Models: Mongoose schemas （ORM）和 MongoDB database (no-SQl DB)

+ 權限管理：admin用戶才可以做"POST"、"DELETE"、"PUT"、"GET"（查詢）有login的用戶都能操作
+ Population：利用ObjectIds做到不同collections互相參考（如SQL中的JOIN）的功能。
- OAuth
  - 新增 Passport’s Facebook Strategy
  - 加入２條 routes: one for FB authentication and one for handling the FB callback.

-. 6/14 複習
  - 新增1條 routes:/favorites，並加入相對應的routing，以及RESTful API。
```


