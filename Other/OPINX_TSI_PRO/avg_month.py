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
		delta_d=[31,31,30,31,30,31,31,29,31,30,31,30]
		a1=(2015,7,1,0,0,0,0,0,0)              #设置开始日期时间元组（1976-01-01 00：00：00）
		for x in range(num):
			#aaa=time.mktime(a1)
			#date_touple=time.localtime(aaa)          #将时间戳生成时间元组
			#date=time.strftime("%Y-%m-%d %H:%M:%S",a1)  #将时间元组转成格式化字符串（1976-05-21）
			#datetime_object = datetime.strptime(date,'%Y-%m-%d %H:%M:%S')
			#for i in range(12):				
			#	datetime_object_b7=datetime_object+timedelta(days=delta_d[i])
			#	print (datetime_object)
			#	print (datetime_object_b7)
			start = time.time()
			SEC_DataFromInflux()
			end = time.time()
			f_avgt=f_avgt+(end-start)
								
			start = time.time()
			SEC_DataFromPG()
			end = time.time()
			p_avgt=p_avgt+(end-start)
			#	datetime_object=datetime_object+timedelta(days=delta_d[i])
		print ("執行"+sys.argv[1]+"天區間移動平均計算"+sys.argv[2]+"次，InfluxDB平均耗時"+str(f_avgt/num)+"ms，PostgreSQL平均耗時"+str(p_avgt/num))
		print (str(f_avgt/num)+","+str(p_avgt/num))
		
		
def SEC_DataFromInflux():
	#print (type(stt))
	client = InfluxDBClient('140.92.143.180', 8086, 'root', 'root', 'example')
	result = client.query("select MEAN(\"RC_price_f\") from tw_2330 WHERE time < '2015-12-31' AND time >='2015-01-01' GROUP BY time(30d);")
	print("InfluxDB"+str(result))
	client.close()
			
def SEC_DataFromPG():
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	cur = conn.cursor()
	cur.execute("SELECT EXTRACT(MONTH from d) as m,AVG(rc_price) from tw_2330 where d<'2015-12-31' AND d>='2015-01-01' GROUP BY m;")
	rows = cur.fetchall()
	print ("PostgreSQL"+str(rows))
	conn.close()


if __name__== '__main__':
	main()