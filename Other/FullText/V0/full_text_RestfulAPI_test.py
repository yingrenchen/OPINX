from flask import Flask,request
from elasticsearch import Elasticsearch
from flask_restful import reqparse
from flask import jsonify
app = Flask(__name__)


def es_work_manage(es_op,es_index_name):
    es = Elasticsearch('http://140.92.143.91:9200')
    if es_op =='create':
          es.indices.create(es_index_name,ignore=400)
    elif es_op =='drop':
          es.indices.delete(es_index_name,ignore=400)
    elif es_op =='set':
          return "set"
    elif es_op =='get':
          return "get"

def es_work_operation(es_op,es_index_name,es_type,es_id,es_contents,es_timestamp):
    es = Elasticsearch('http://140.92.143.91:9200')
    if es_op =='insert':
        es.index(index=es_index_name,doc_type=es_type,id=es_id,body={"content":es_contents, "timestamp":es_timestamp })
    if es_op =='update':
        es.index(index=es_index_name,doc_type=es_type,id=es_id,body={"content":es_contents, "timestamp":es_timestamp })
    if es_op =='delete':
        es.delete(index=es_index_name,doc_type=es_type,id=es_id)
@app.route("/create",methods=['GET'])
def Create_index():
    para_search_type=request.args.get('search_type')
    para_index_name=request.args.get('index_name')
    para_options=request.args.get('options')
    if para_search_type=='textsearch':
            es_work_manage("create",para_index_name)
            return "creat index\n"
    elif para_search_type==None:
            return "creat index faild,please check search_type\n"

@app.route("/drop",methods=['GET'])
def Drop_index():
    para_search_type=request.args.get('search_type')
    para_index_name=request.args.get('index_name')
    para_options=request.args.get('options')
    if para_search_type=='textsearch':
            es_work_manage("drop",para_index_name)
            return "drop index\n"
    elif para_search_type==None:
            return "drop index faild,please check search_type\n"

@app.route("/set",methods=['GET'])
def Set_index():
    para_index_name=request.args.get('index_name')
    es_work_manage('set',para_index_name)

@app.route("/get",methods=['GET'])
def Get_index():
    para_index_name=request.args.get('index_name')
    es_work_manage('get',para_index_name)

@app.route("/insert",methods=['POST'])
def Insert_data():
    jsonData =request.get_json()
    para_index_name=jsonData['index_name']
    para_doc_type=jsonData['index_name']
    para_id=jsonData['id']
    para_contents=jsonData['contents']
    para_timestamp=jsonData['timestamp']
    es_work_operation('insert',para_index_name,para_doc_type,para_id,para_contents,para_timestamp)
    #print para_index_name+para_doc_type+para_id+para_contents+para_timestamp
    return "insert scucces\n"
@app.route("/update",methods=['POST'])
def Update_data():
    jsonData =request.get_json()
    para_index_name=jsonData['index_name']
    para_doc_type=jsonData['index_name']
    para_id=jsonData['id']
    para_contents=jsonData['contents']
    para_timestamp=jsonData['timestamp']
    es_work_operation('update',para_index_name,para_doc_type,para_id,para_contents,para_timestamp)
    #print para_index_name+para_doc_type+para_id+para_contents+para_timestamp
    return "update scucces\n"

@app.route("/delete",methods=['GET'])
def Delete_data():
    #es = Elasticsearch('http://140.92.143.91:9200')
    #para_search_type=request.args.get('search_type')
    para_index_name=request.args.get('index_name')
    para_id=request.args.get('id')
    es_work_operation('delete',para_index_name,para_index_name,para_id,None,None)
    return "delete scucces\n"

@app.route("/select",methods=['GET'])
def Select_data():
    es = Elasticsearch('http://140.92.143.91:9200')
    para_index_name=request.args.get('index_name')
    para_filter=request.args.get('filter')
	#es.search(index=para_index_name,q="content:"+para_filter)
    print es.search(index=para_index_name,q="content:"+para_filter)
    #es_work("select",para_index_name)
    return "select scucces\n"
if __name__ == "__main__":
	app.run(host='140.92.143.91',port=5000,debug=True)
