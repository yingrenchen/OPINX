#!/usr/bin/python
# -*- coding: utf-8 -*-
from influxdb import InfluxDBClient
import json
import twstock
import time
import psycopg2
import datetime
import logging  
logging.basicConfig(level=logging.INFO,  
                    format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',  
                    datefmt='%a, %d %b %Y %H:%M:%S',  
                    filename='/tmp/test.log',  
                    filemode='w')  
  
#logging.debug('debug message')  
 
# logging.warning('warning message')  
# logging.error('error message')  
# logging.critical('critical message')  

def insertDataToPG(time,open,high,low,close,capacity,turnover,transaction,change,code):
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	#print "Opened database successfully"
	open,high,low,close,capacity,turnover,transaction = map(lambda x: x if x is not None else -1, [open,high,low,close,capacity,turnover,transaction])
	if change is None :
		change = 9999.0	
	t=time.strftime('%Y-%m-%d')
	cur = conn.cursor()
	# print (type(t))
	# print (type(open))
	# print (type(high))
	# print (type(low))
	# print (type(close))
	# print (type(capacity))
	# print (type(turnover))
	# print (type(transaction))
	# print (type(change))
	# print (type(code))
	cur.execute("INSERT INTO tw_stock2330 (tstamp,open,high,low,close,capacity,turnover,transaction,change,code)VALUES ('"+t+"','"+str(open)+"','"+str(high)+"','"+str(low)+"','"+str(close)+"','"+str(capacity)+"','"+str(turnover)+"','"+str(transaction)+"','"+str(change)+"','"+code+"')");
	conn.commit()
	#print "Records created successfully";
	conn.close()

def insertDataToInflux(time,open,high,low,close,capacity,turnover,transaction,change,code):
	
	json_body = [
		{
			"measurement": "tw_stock2330",
			"tags": {
				"code":code,
				"open": open,
				"high": high,
				"low": low,
				"close": close
			},
			"time": time,
			"fields": {
				"capacity": capacity,
				"turnover": turnover,
				"transaction": transaction,
				"change": change
			}
		}
	]
	client = InfluxDBClient('140.92.143.180', 8086, 'root', 'root', 'example')

	client.create_database('example')

	client.write_points(json_body)
	client.close()
	#result = client.query('select value from cpu_load_short;')

	#print("Result: {0}".format(result))
def main(y,m):
	#print ("共有:"+str(len(twstock.codes))+"個股票編號")
	print ("正在處理"+str(y)+"年"+str(m)+"月")
	#i=1
	#for c in twstock.codes:
		#print("第"+str(i)+"個股票編號:"+c)
	try:
		stock = twstock.Stock('2330')
		stock.fetch(y,m)
		for d in stock.data:
			insertDataToInflux(d[0],d[3],d[4],d[5],d[6],d[1],d[2],d[8],d[7],'2330')
			insertDataToPG(d[0],d[3],d[4],d[5],d[6],d[1],d[2],d[8],d[7],'2330')
	except Exception as e:
		print ('error')
		print (e)
		#print ("股票編號:"+str(c)+"有問題，暫不處理")
		#logging.info('股票編號:'+str(c)+'有問題，暫不處理')
		#continue
	finally:
		#i=i+1
		time.sleep(10)
		
if __name__== '__main__':
	year=1980
	#print (year)
	while year > 1900:
		for i in range(12):
			#print (type(i))
			main(year,i+1)
			time.sleep(30)
		year=year-1
			#print (year)