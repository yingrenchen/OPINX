2017-05-16
----
* **前端 Rev: 17208**

  1. 更新UI顯示頁面
  
  2. index management頁面移除 index status狀態
  
  3. index management頁面移除 operation項中edit選項
  
* **後端 Rev: 17129**

  1. 移除set api(reindex功能)
  
  2. 移除token機制
  
  3. 更新sample code
  
2016-09-19
----

* **前端 Rev: 17127**

  1. 新增當reindex失敗顯示錯誤訊息
  
  2. index顯示列表的Docs欄位改為除以2(去掉replica)

* **後端 Rev: 17128**

  1. 修正set api 造成 memory 無法正常relase的bug，加入時間限制，單一index於半小時內僅能進行一次set api 呼叫(reindex)

2016-09-02
----

* **前端 Rev: 17110**

  1. 資料更新頁面增加Timestamp輸入框

* **後端 Rev: 17113**

  1. 修改insert & update data API文件說明
  
  2. 修正insert & updata API 輸入時間BUG，時間格式為yyyy-MM-dd，可選擇輸入或者不輸入(使用當下時間輸入)
  
  3. 修改select API使用ES查詢語句，使查詢運算子能正常作用
  
  4. 修正select API輸入查詢筆數(limit_num)與查詢起點(limit_start)無法正常代入查詢條件BUG
  
  5. 修正select API時間查詢條件，無法正常代入BUG
  
  6. 匯入正確對應欄位(content,timestamp)的真實資料，當作範例資料demo系統

2016-08-31
----

* **前端 Rev: 17100**

  1. 資料查詢頁面增加Time Start及Time Stop輸入框

* **後端 Rev: 17092**

  1. 增加查詢時可選擇加入時間點過濾查詢結果，timestamp＿start與timestamp＿stop，兩者皆有輸入時，為起迄時間查詢，若只有timestamp＿start則為查詢至現在的時間，兩者皆無則為查詢全資料

2016-07-18
----
 Release list:
  
* **前端 Rev: 16932**

  1. 新增變更其他分詞器UI對話框
  
  2. 顯示進行re-index的進度百分比

  3. 新增下載Sample Code連結

* **後端 Rev: 16935**

  1. 增加變更其他分詞器的功能，變更分詞器選項後會進行re-index並顯示百分比

  2. 分詞器採用字典修正為由原本的簡體修正為繁體
  
2016-06-16
----
 Release list:
  
* **前端 Rev: 16796**

  1. 新增顯示前後端系統SVN版本號碼
  
  2. 新增建立索引下拉式選單mmseg分詞器
  
  3. 新增查詢筆數與查詢起始點輸入表單

* **後端 Rev: 16785**

  1. 加入查詢筆數與查詢起始點功能
  
  2. 加入mmseg分詞器，支援simple,complex & maxword三種模式
  
  3. 更新API Document
  
2016-06-03
----
 Release list:
  
* **前端 Rev: 16738**

  1. 加入非同步處理，等待API資料回傳
  
  2. 加入顯示查詢資料的ID
  
  3. 版面優化調整，對話框改為頁籤顯示
  
  4. 加入API document，縮放型查閱，內容為暫時簡易版
  
  5. 修正查詢結果頁面，不暫存上次內容
  
  6. search result table加入timestamp欄位
  
  7. search key word加入建議搜尋提示字樣
  
  8. search content加上縮放功能

* **後端 Rev: 16758**

  1. 修正創建新的index時，使用大寫字母輸入名稱當機問題:修改說明，禁止使用大寫字母命名index name
  
  2. 加入API token驗證，登入帳號密碼取得token，呼叫API時帶入token並檢查是否過期:(缺文件說明)
  
  3. 修正效能，呼叫listIndex API取的index資訊時，會因memory leak導致系統逐漸延緩
  
  4. Elasticsearch版本更新至2.3.3，搭配使用的IK一併更新至1.9.3