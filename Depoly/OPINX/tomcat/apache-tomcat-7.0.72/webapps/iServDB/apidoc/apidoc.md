    
Create Index
----
  新增索引資料庫

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/create?

   2. Method: `GET`
  
   3. URL Params:
 
   `index_name: 索引資料庫名稱 (只允許輸入小寫英文字母及數字)`

   `index_type: 索引資料表名稱 (與index_name同)`
   
   `analyzer: ik_max_word ,ik_smart ,mmseg_simple ,mmseg_complex ,mmseg_maxword`,
   

* **Reponse**

JSON

    {
       "status": true/false(成功與否),
       "err_msg": 錯誤訊息,	  
       "index_List": 列出所有index清單
    }
    
JSON 

    {
        "status": true,
        "err_msg": "",
        "response_time": "494",
        "index_List": [
          "taiwannews20222",
          "taiwannews2013",
          "taiwannews2016",
          "taiwannews2014",
          "taiwannews2015"
        ],
        "index_Mappings": "",
        "inserted_Data_info": "",
        "updated_Data_info": "",
        "deleted_Data_info": "",
        "searched_Data_info": ""
    }

Drop Index
----
  刪除索引資料庫

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/drop?

   2. Method: `GET`
  
   3. URL Params:
 
   `index_name: 索引資料庫名稱`
   
   
* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息
	}
   
JSON

    {
        "status": true,
        "err_msg": "",
        "response_time": "59",
        "index_List": "",
        "index_Mappings": "",
        "inserted_Data_info": "",
        "updated_Data_info": "",
        "deleted_Data_info": "",
        "searched_Data_info": ""
    }
    
  
Get Mappings
----
  查詢索引資料庫映射

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/get?

   2. Method: `GET`
  
   3. URL Params:
 
   `index_name: 索引資料庫名稱`
   
   
* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息,
       "index_Mappings": index的mapping資訊
	}
    
JSON

    {
        "status": true,
        "err_msg": "",
        "response_time": "72",
        "index_List": "",
        "index_Mappings": {
            "_all": {
            "analyzer": "ik_max_word"
            },
            "properties": {
                "content": {
                    "type": "string",
                    "boost": 8,
                    "term_vector": "with_positions_offsets",
                    "analyzer": "ik_max_word",
                    "include_in_all": true
                },
                "timestamp": {
                    "type": "date",
                    "format": "strict_date_optional_time||epoch_millis"
                } 
            }
        },
        "inserted_Data_info": "",
        "updated_Data_info": "",
        "deleted_Data_info": "",
        "searched_Data_info": ""
    }

Insert Data
----
  新增索引資料

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/insert

   2. Method: `POST`

   3. Data Params:

JSON

    {
       "index_Name": 索引資料庫名稱,
       "id_Num": 插入資料之編號,
       "content_text": 資料內容,
	   "timeStamp":插入資料之時間(format: yyyy-MM-dd)
    }
	
JSON

	範例:
	
	{
       "index_Name": "test",
       "id_Num": "1",
       "content_text": "just test",
	   "timeStamp":"2016-01-01"
    }
	
* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息,
       "inserted_Data_info": 插入資料的詳細資訊
	}	
    
JSON
	
    {
        "status": true,
        "err_msg": "",
        "response_time": "294",
        "index_List": "",
        "index_Mappings": "",
        "inserted_Data_info": {
            "inserted_type": "taiwannews2014",
            "inserted_id": "1",
            "inserted_index": "taiwannews2014"
        },
        "updated_Data_info": "",
        "deleted_Data_info": "",
        "searched_Data_info": ""
    }
    
Update Data
----
  修改索引資料

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/update

   2. Method: `POST`

   3. Data Params:

JSON

    {
       "index_Name": 索引資料庫名稱,
       "id_Num": 更新資料之編號,
       "content_text": 資料內容,
	   "timeStamp":修改日期時間(format: yyyy-MM-dd)
    }
	
JSON

	範例:
	
	{
       "index_Name": "test",
       "id_Num": "1",
       "content_text": "just test",
	   "timeStamp":"2016-01-01"
    }
	
  
* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息,
       "updated_Data_info": 更新資料的詳細資訊
	}
    
JSON

    {
        "status": true,
        "err_msg": "",
        "response_time": "191",
        "index_List": "",
        "index_Mappings": "",
        "inserted_Data_info": "",
        "updated_Data_info": {
            "updated_id": "1",
            "updated_index": "taiwannews2014",
            "updated_type": "taiwannews2014"
        },
        "deleted_Data_info": "",
        "searched_Data_info": ""
    }

Delete Data
----
  刪除索引資料

* **Request**

   1. URL: /OpenIndex_BackEnd/restAPI/delete?

   2. Method: `GET`
  
   3. URL Params:
 
   `index_name: 索引資料庫名稱`
   
   `id_Num: 欲刪除索引資料之編號`

* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息,
       "deleted_Data_info": 刪除資料的詳細資訊
	}	
    
JSON

    {
        "status": true,
        "err_msg": "",
        "response_time": "115",
        "index_List": "",
        "index_Mappings": "",
        "inserted_Data_info": "",
        "updated_Data_info": "",
        "deleted_Data_info": {
            "deleted_index": "taiwannews2014",
            "deleted_id": "1",
            "deleted_type": "taiwannews2014"
        },
        "searched_Data_info": ""
    }
    
Search Data
----
  查詢索引資料

* **Request**

   1. URL:/OpenIndex_BackEnd/restAPI/select?

   2. Method: `GET`
  
   3. URL Params:
 
   `index_name: 索引資料庫名稱`
   
   `filter: 查詢索引關鍵字，運算子有AND(&&),OR(||),NOT(!),+,-，範例A AND B表示取A跟B都符合的資料(交集)，A OR B表示取A或者B符合的資料，+與-則放在查詢的詞前面，表示一定要有或者一定沒有`
   
   `＊優先順序由左至右，NOT>AND>OR，+,-只影響右邊的詞且可以使用"ABC"定義為一個詞`
   
   `limit_start: 查詢起始資料編號(至少為0)`
   
   `limit_num: 查詢資料結果筆數(至少為1)`
   
   `timestamp_start: 時間查詢條件(起始時間點)，格式為yyyy-MM-dd`
   
   `timestamp_stop: 時間查詢條件(終止時間點)，不輸入則為"now"，格式為yyyy-MM-dd`
   
   `＊ timestamp_start與timestamp_stop皆不輸入，則為查詢全部資料`
   
   
* **Reponse**

JSON

    {
       "status": true/false(成功與否),	
       "err_msg": 錯誤訊息,
       "searched_Data_info": {
            "Total Hits":"符合的資料筆數",
            "Data":"符合的資料內容"
       }
	}	
    
JSON

    {
        "status": true,
        "err_msg": "",
        "response_time": "1993",
        "index_List": "",
        "index_Mappings": "",
        "inserted_Data_info": "",
        "updated_Data_info": "",
        "deleted_Data_info": "",
        "searched_Data_info": {
            "Total Hits": 132255,
            "Data": [
                  "{ 
                      "content": "2014年04月21日 12:47 14 旺報即時 450 張雅雲 對於黨內初選期...",
                      "timestamp": "2014-04-21" 
                  }"
            ]
        }
    }   

  