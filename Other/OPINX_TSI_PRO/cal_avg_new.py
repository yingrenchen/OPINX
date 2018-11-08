#!/usr/bin/python
# -*- coding: utf-8 -*-

from influxdb import InfluxDBClient
import psycopg2
import sys
from datetime import datetime, timedelta
import time
import random
def main():
	if len(sys.argv) !=3: 
		print ("error")
		sys.exit(1)
	else:
		num=int(sys.argv[2])
		p_avgt=0.0
		f_avgt=0.0
		for i in range(num):
			a1=(2015,7,1,0,0,0,0,0,0)              #设置开始日期时间元组（1976-01-01 00：00：00）
			a2=(2016,6,31,23,59,59,0,0,0)    #设置结束日期时间元组（1990-12-31 23：59：59）
			start=time.mktime(a1)    #生成开始时间戳
			end=time.mktime(a2)      #生成结束时间戳
			t=random.randint(start,end)    #在开始和结束时间戳中随机取出一个
			date_touple=time.localtime(t)          #将时间戳生成时间元组
			date=time.strftime("%Y-%m-%d %H:%M:%S",date_touple)  #将时间元组转成格式化字符串（1976-05-21）
			print("-----------------------------------")
			print('SELECT DATE :'+str(date))
			tr=read_PG_tName()
			i=random.randint(0,len(tr)-1)
			print ('SELECT STOCK :'+str(tr[i][0]))
			#InfluxDB
			start = time.time()
			SEC_DataFromInflux(date,sys.argv[1],tr[i][0])
			end = time.time()
			f_avgt=f_avgt+(end-start)
			#PG
			start = time.time()
			SEC_DataFromPG(date,sys.argv[1],tr[i][0])
			end = time.time()
			p_avgt=p_avgt+(end-start)
			print ("-----------------------------------")
		print ("執行"+sys.argv[1]+"天區間移動平均計算"+sys.argv[2]+"次，InfluxDB平均耗時"+str(f_avgt/num)+"ms，PostgreSQL平均耗時"+str(p_avgt/num))
		print (str(f_avgt/num)+","+str(p_avgt/num))
		
		
def SEC_DataFromInflux(d,num,tn):
	datetime_object = datetime.strptime(d,'%Y-%m-%d %H:%M:%S')
	datetime_object_b7=datetime_object-timedelta(days=int(num))
	#i=random.randint(0,len(tr))
	#print ('SELECT STOCK :'+str(tr[i][0]))
	client = InfluxDBClient('140.92.143.180', 8086, 'root', 'root', 'example')
	#for i in range(0,int(num)):
		#t=str(time.mktime(datetime_object.timetuple()))
		#print (t)
	result = client.query("select MEAN(\"RC_price_f\") from "+tn+" WHERE time <= '"+str(datetime_object)+"' AND time >='"+str(datetime_object_b7)+"';")
	#result = client.query("select MEAN(\"RC_price_f\") from tw_2330 ;")
	print("InfluxDB"+str(result))
	#Cal_avg_influx(list(result)[0])
		#datetime_object=datetime_object-timedelta(days=1)
	client.close()
		
		
def SEC_DataFromPG(d,num,tn):
	datetime_object = datetime.strptime(d,'%Y-%m-%d %H:%M:%S')
	datetime_object_b7=datetime_object-timedelta(days=int(num))
	#i=random.randint(0,len(tr))
	#print ('SELECT STOCK :'+str(tr[i][0]))
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	cur = conn.cursor()
	cur.execute("SELECT AVG(rc_price) from "+tn+" where d<='"+str(datetime_object)+"' AND d>='"+str(datetime_object_b7)+"';")
	rows = cur.fetchall()
	print ("PostgreSQL"+str(rows))
	#	Cal_avg_PG(list(rows))
	#	datetime_object=datetime_object-timedelta(days=1)
	conn.close()
	
def read_PG_tName():
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	cur = conn.cursor()
	cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';");
	rows = cur.fetchall()
	tr=rows
	#print (type(rows))
	conn.close()
	return tr
	
def read_InfluxDB_tName():
	client = InfluxDBClient('140.92.143.180', 8086, 'root', 'root', 'example')
	result = client.query("SHOW MEASUREMENTS")
	#print("InfluxDB"+str(result))
	client.close()
	return result
if __name__== '__main__':
	#read_PG_tName()
	#read_InfluxDB_tName()
	main()