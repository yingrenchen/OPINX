from datetime import timedelta, date
import os
from multiprocessing import Pool

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)

def GetDateNews(date):
        os.system("wget 'http://ronnywang-newsdiff.s3-website-ap-northeast-1.amazonaws.com/"+date[:4]+"/"+date+".txt.gz'")

date_list = list()

start_date = date(2016, 1, 1)
end_date = date(2016, 8, 31)
for single_date in daterange(start_date, end_date):
    date_list.append(str(single_date.strftime("%Y%m%d")))
    #os.system("wget 'http://ronnywang-newsdiff.s3-website-ap-northeast-1.amazonaws.com/2016/"+date+".txt.gz'")

p = Pool(16)
p.map(GetDateNews,date_list)


