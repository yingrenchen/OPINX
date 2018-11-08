#!/usr/bin/python

import psycopg2
import datetime
def insertDataToPG(time,open,high,low,close,capacity,turnover,transaction,change):
	conn = psycopg2.connect(database="yrc", user="yrc", password="openstack", host="127.0.0.1", port="5432")
	#print "Opened database successfully"
	t=time.strftime('%Y-%m-%d')
	cur = conn.cursor()
	print (type(t))
	cur.execute("INSERT INTO tw_stock2330 (tstamp,open,high,low,close,capacity,turnover,transaction,change)VALUES ('"+t+"',"+str(open)+","+str(high)+","+str(low)+","+str(close)+","+str(capacity)+","+str(turnover)+","+str(transaction)+","+str(change)+")");
	conn.commit()
	#print "Records created successfully";
	conn.close()



#!/usr/bin/python
# -*- coding: utf-8 -*-
from influxdb import InfluxDBClient
import json
import twstock
import time
def main(y,m):
	stock = twstock.Stock('2330')
	stock.fetch(y,m)
	#print (stock.price)
	#print (type(stock.data))
	#print (stock.data[0])
	for d in stock.data:
		print (d[0])
		print (d[1])
		print (d[2])
		print (d[3])
		insertDataToPG(d[0],d[3],d[4],d[5],d[6],d[1],d[2],d[8],d[7])
		#print (d[1])


if __name__== '__main__':
	year=2013
	#print (year)
	while year > 2000:
		for i in range(12):
			#print (year)
			main(year,i)
			time.sleep(30)
		year=year-1
		#print (year)