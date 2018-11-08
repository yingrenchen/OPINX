import sys
import json
import os
import subprocess
from time import gmtime, strftime
from elasticsearch import Elasticsearch
import news_parser as nrd2
#import news_reader_dist2 as nrd2

def log_to_file(file_name, news_num, log_string):
    subprocess.call('echo "' + strftime("%Y-%m-%d %H:%M:%S", gmtime())
                  + ' [' + str(file_name)
                  + ', ' + str(news_num)
                  + '] '  + str(log_string) + '" >> /var/log/purenews/news2es.log', shell=True)

def tag_to_file(file_name, news_num):
    subprocess.call('echo "' + strftime("%Y-%m-%d %H:%M:%S", gmtime())
                  + ' [' + str(file_name)
                  + ', ' + str(news_num)
                  + '] " >> /var/log/purenews/news2es_'+ str(file_name) +'.log', shell=True)

def get_content(str_meta, str_title, str_text):
    try:
        ct_meta = json.loads(str_meta)
        ct_title = str_title
        ct_text = str_text.replace(r"\n\r\n", r"\n").replace('\\n', ' ').replace('\\r', '').replace(
                      '\/', '/').replace('  ', '').replace('\"', '').replace('\n', '')
        return nrd2.content_analysis(ct_meta, ct_title, ct_text)
    except:
        return None

# open file
def open_file (file_name):
    f = open(file_name)
    #r = codecs.getreader('utf8')(f)
    r = f
    content = r.readlines()
    f.close()

    length = len(content)

    # connect to ES
    #es = Elasticsearch("118.163.94.25:42689")
    es = Elasticsearch("192.168.122.182:9200")
    #es = Elasticsearch("140.92.143.99:9200")

    # parse & insert
    for go in range(length):
        if go % 3 == 0 :
            if str(content[go])[:1] == '{':
                print go/3+1, go+1
                # parse content
                ret = get_content(content[go], content[go+1], content[go+2])
                if ret is None:
                    log_to_file(file_name[-12:], go+1, 'Parsing Exception.')
                else:
                    tag_to_file(file_name[-12:], go+1)
                    # write to es
                    res = es.index(index="taiwannews2013", doc_type="taiwannews2013", body=ret, request_timeout=30)
                   # print ret
            else:
                # write to error log
                log_to_file(file_name[-12:], go+1, 'Wrong Line.') # + str(content[go]))

if __name__ == '__main__':

    #if sys.argv[1] is None:
    #    file_name = '../news/txt/2016/20160607.txt'
    #else:
    #    file_name = '../news/txt/' + str(sys.argv[1][:4]) + '/' + str(sys.argv[1]) + '.txt'
    if len(sys.argv) < 2:
        print "Please enter 'year':"
        print "------------------------------------------"
        print "format  :  pyton news2es.py [year]"
        print "example :  pyton news2es.py 2013"
        exit(0)
    else:
        path = "/home/localadmin/purenews/news/txt/" + str(sys.argv[1]) + "/"

    file_list = os.listdir(path)
    for file_name in file_list:
        open_file(path + str(file_name))
        #print path + str(file_name)

