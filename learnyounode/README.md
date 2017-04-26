02. `process.argv`

03. `fs.readFileSync`

04. **async** `fs.readFile`

05. **async** `fs.readdir()`
 
06. module export

07. HTTP GET 請求

08. HTTP GET 請求(2)

09. 管理非同步（async）

10. 撰寫一個 TCP 時間伺服器 ！

11. 撰寫一個 HTTP 伺服器 ，可以提供 text 檔案給所有收到的請求。 


```
var net = require('net')
var server = net.createServer(function (socket) {
  // socket handling logic
})
server.listen(8000)
```