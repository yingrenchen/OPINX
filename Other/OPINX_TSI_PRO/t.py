#!/usr/bin/python
# -*- coding: utf-8 -*-
from os import walk
from os.path import join
from influxdb import InfluxDBClient
import csv
import psycopg2
import time

def insertDataToPG(d,RC_price,Current_transaction,AC_transaction,code):
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	#print "Opened database successfully"
	#open,high,low,close,capacity,turnover,transaction = map(lambda x: x if x is not None else -1, [open,high,low,close,capacity,turnover,transaction])
	#if change is None :
		#change = 9999.0	
	#t=time.strftime('%Y-%m-%d')7777777777777777777777777777777777777777788888888888888888888888888
	cur = conn.cursor()
	#print (type(RC_price))
	# print (type(open))
	# print (type(high))
	# print (type(low))
	# print (type(close))
	# print (type(capacity))
	# print (type(turnover))
	# print (type(transaction))
	# print (type(change))
	# print (type(code))
	cur.execute('CREATE TABLE IF NOT EXISTS tw_'+code+'(d timestamp,RC_price double precision NOT NULL,Current_transaction double precision NOT NULL,AC_transaction double precision NOT NULL,code TEXT NOT NULL);')
	#cur.execute('CREATE INDEX index_d on tw_'+code+' (d);')
	cur.execute("INSERT INTO tw_"+code+"(d,rc_price,current_transaction,ac_transaction,code)VALUES(%s,%s,%s,%s,%s)",(d,RC_price,Current_transaction,AC_transaction,code))
	conn.commit()
	#print "Records created successfully";
	conn.close()

def insertDataToInflux(d,t,RC_price,Current_transaction,AC_transaction,code):
	tt=d+" "+t
	timeArray = time.strptime(tt, "%Y-%m-%d %H:%M:%S")
	timeStamp = int(time.mktime(timeArray))
	json_body = [
		{
			"measurement": "tw_"+code,
			"tags": {
				"RC_price":RC_price,
				"t":code
			},
			"time":tt,
			"fields": {
				"RC_price_f":RC_price,
				"Current_transaction": Current_transaction,
				"AC_transaction": AC_transaction
			}
		}
	]
	client = InfluxDBClient('140.92.143.180', 8086, 'root', 'root', 'example')

	#client.create_database('example')
	#client.create_retention_policy('tw_2330_rp','INF','1','example','false')	
	client.write_points(json_body)
	client.close()
	#time.sleep(0.5)
	#result = client.query('select value from cpu_load_short;')

	#print("Result: {0}".format(result))




def main():
	a=0.0
	b=0.0
	tc=0
	# 指定要列出所有檔案的目錄
	mypath = "/es_data/20150226_20150812"
	# 遞迴列出所有檔案的絕對路徑
	for root, dirs, files in walk(mypath):
		for f in files:
			fullpath = join(root, f)
			fresult = open(fullpath,'r')
			code=fullpath[-8:-4]
			
			if code == '2330':
				continue
			#print(fullpath)
			for row in csv.DictReader(fresult, ["時間", "最近成交價", "當盤成交量", "累積成交量"]):
				#print (row['時間']+row['最近成交價'])
				#print (fullpath[-8:-4])
				#print (type(row['時間']))
				#print (type(row['最近成交價']))
				d=(fullpath[-17:-9])[0:4]+"-"+(fullpath[-17:-9])[4:6]+"-"+(fullpath[-17:-9])[6:8]
				#print (d)
				t=row['時間']
				RC_price=row['最近成交價']
				Current_transaction=row['當盤成交量']
			#	print (type(float(Current_transaction)))
				AC_transaction=row['累積成交量']
				
				start = time.time()
				insertDataToInflux(d,t,float(RC_price),float(Current_transaction),float(AC_transaction),code)
				end = time.time()
				a=a+(end-start)
				start = time.time()
				insertDataToPG(d+" "+t,float(RC_price),float(Current_transaction),float(AC_transaction),code)
				end = time.time()
				b=b+(end-start)
				tc=tc+1
				if tc==1:
					print ("插入1筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/1))
					print ('PostgreSQL:'+str(b/1))
					print ("=======================")
				if tc==10:
					print ("插入10筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/10))
					print ('PostgreSQL:'+str(b/10))
					print ("=======================")
				if tc==50:
					print ("插入50筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/50))
					print ('PostgreSQL:'+str(b/50))
					print ("=======================")
				if tc==100:
					print ("插入100筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/100))
					print ('PostgreSQL:'+str(b/100))
					print ("=======================")					
				if tc==1000:
					print ("插入1000筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/1000))
					print ('PostgreSQL:'+str(b/1000))
					print ("=======================")
				if tc==10000:
					print ("插入10000筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/10000))
					print ('PostgreSQL:'+str(b/10000))
					print ("=======================")
				if tc==100000:
					print ("插入100000筆資料，累積時間")
					print ('influxDB:'+str(a))
					print ('PostgreSQL:'+str(b))
					print ('influxDB:'+str(a/100000))
					print ('PostgreSQL:'+str(b/100000))	
					print ("=======================")
			fresult.close()
	print ('influxDB:'+str(a))
	print ('PostgreSQL:'+str(b))
	print (tc)
if __name__== '__main__':
	
	main()
	
