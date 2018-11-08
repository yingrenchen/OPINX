#!/usr/bin/python
#-*-coding:utf-8 -*-
import sys
import re
import json
from datetime import datetime
from lxml import etree

reload(sys)
sys.setdefaultencoding('utf8')

# Content analysis
def content_analysis (meta, title, text):
    text_keys = []
    text_urls = re.findall(
        'http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)
    text = re.sub(
        'http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
    # parsing content by different news site:
    news_site = meta["url"].replace('http://','').replace('https://','').split('/')[0]

    # www.appledaily.com.tw
    if meta["source"] == "1":  
        text = text.replace('<a href=\\"mailto:onlineopinions@appledaily.com.tw?subject=有話要說投稿「即時論壇」\\">有話要說 投稿「即時論壇」</a>', '').replace(
            '<a href=\\"">「蘋果掀房事」每周三中午12點半，午餐加好料</a>  更多房地產新聞，請參考<a href=\\"">蘋果地產王粉絲團</a>', '')
    # www.chinatimes.com
    elif meta["source"] == "2":  
        text_arr = text.split("關鍵字：")
        text = text_arr[0].replace('\\n', '    ').replace(
            '\\r', '  ').split("var _c")[0].strip()
        text = text.replace('<a href=\\"/realtimenews/', ' ').replace(
            '<a href=\\/realtimenews/', ' ').replace('<a href=\\/reporter/', ' ').replace(
            '<a href=\\"/reporter/', ' ').replace('\\">', ' ').replace('\\>', ' ').replace('</a>', ' ')
        if len(text_arr) == 2: 
            text_keyword = str(text_arr[1]).replace('<\\/a>', '</a>')
            text_keyword_html = etree.HTML(text_keyword)
            for key in text_keyword_html.xpath(u"//a/text()"):
                text_keys.append(key)
    # www.cna.com.tw
    elif meta["source"] == "3":  
        text = text#[45:-10]
    # www.ettoday.net
    elif meta["source"] == "4": 
        text_split = text.split('相關報導')
        text = text_split[0].replace('更多照片及', '').replace(
            '更多照片', '').replace('<a href=\\"">', '').replace('</a>', '')
        if len(text_split) == 2:
            text_keys = text_split[1].replace('  ', '').replace(
                '<a href=\\"">', '').replace('</a>', ', ')#[:-5]
    # news.ltn.com.tw
    elif meta["source"] == "5":
        text = text.split("相關新聞請見：")[0] 
        text = text.replace('<a href=\\"javascript:void(0);\\"></a>', '')
    # newtalk.tw
    elif meta["source"] == "6":
        None
    # www.nownews.com
    elif meta["source"] == "7":  
        None
    # udn.com
    elif meta["source"] == "8":  
        text = text.replace('分享分享分享留言列印A-A+', '').replace('facebook twitter pinterest', '').replace('function colorboxexplan(url, w, h)', '').replace(
            '{window.$.colorbox({href:url, iframe: true, scrolling: false, width: w, height: h, opacity:0,transition:\\"none\\"}); }', '').replace('分享  ', '')
    # news.tvbs.com.tw
    elif meta["source"] == "9":  
        text = text.replace('/export/', 'http://news.tvbs.com.tw/export/')
        text_urls = re.findall(
            'http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)
        text = re.sub('http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text).replace(
            '<a href=\\"/opencms/news/reporter/index.html?reporter=', '').replace('<a href=\\"javascript:;\\"></a>', '').replace('★更多高畫質新聞【線上看】 ▶ ▶', '').replace('\\">', ' ').replace('</a>', '')
    # www.bcc.com.tw
    elif meta["source"] == "10":  
        None
    # news.pts.org.tw
    elif meta["source"] == "11":  
        None
    elif meta["source"] == "12":
        None
    # news.cts.com.tw
    elif meta["source"] == "13":  
        text = text.replace('\\t【更多新聞詳情請上 - <a href=\\"">華視新聞網</a> 】', '')
    # news.ftv.com.tw
    elif meta["source"] == "14":  
        None
    
    # output return data
    ret = {}
   # ret["id"] = meta["id"]
   # ret["url"] = meta["url"]
    #ret["normalized_id"] = meta["normalized_id"]
    #ret["normalized_crc32"] = meta["normalized_crc32"]
    #ret["source"] = meta["source"]
   # ret["site"] = news_site
    ret["timestamp"] = datetime.fromtimestamp(
        int(meta["created_at"])).strftime('%Y-%m-%d')
   # ret["ts_fetch"] = datetime.fromtimestamp(
    #    int(meta["last_fetch_at"])).strftime('%Y-%m-%d %H:%M:%S')
    #ret["ts_changed"] = datetime.fromtimestamp(
  #      int(meta["last_changed_at"])).strftime('%Y-%m-%d %H:%M:%S')
    #ret["error_count"] = meta["error_count"]
   # ret["title"] = title.replace('\"', '').strip()
    ret["content"] = text
   # ret["key"] = text_keys
    #ret["text-urls"] = text_urls
    return json.dumps(ret, indent=4, ensure_ascii=False)

if __name__ == '__main__':
    meta = {"id":"4822934","url":"http:\/\/udn.com\/news\/story\/1\/1748591","normalized_id":"udn.com\/news\/1\/1748591","normalized_crc32":"1716692832","source":"8","created_at":"1465313452","last_fetch_at":"1465346558","last_changed_at":"1465317161","error_count":"0"}
    title = "助歐洲難民 台灣人在義大利小島蓋「愛之屋」"
    text = "助歐洲難民 台灣人在義大利小島蓋「愛之屋」 分享分享分享留言列印A-A+2016-06-07 23:30 聯合報 記者林河名╱即時報導function colorboxexplan(url, w, h) {window.$.colorbox({href:url, iframe: true, scrolling: false, width: w, height: h, opacity:0,transition:\"none\"}); }  去年9月，敘利亞的難民小男童「亞藍」溺斃在沙灘上的照片，震撼了全世界。台灣人能對這些難民做些什麼？國內第一個向歐洲難民伸出援手的愛心行動，7日舉辦捐贈「歐洲難民婦幼關懷中繼站」儀式，將在義大利最南端的蘭佩杜薩（Lampedusa）小島上，成立「Casa di Love愛之屋」，協助難民營部分婦女與幼童融入歐洲生活，幫助她們從「難民」身分轉變為社會「新興民」。這項名為「Casa di Love　愛無國界、溫暖無限」的計畫，為台灣具體實踐「公民外交」踏出一步。該計畫將在這座面積不到20點2平方公里的小島（比小金門還小）上，捐獻一座綠建築，協助部分婦女與幼童難民，陪伴她們等待申請入籍歐洲的漫長之路。中繼站採輕鋼架組合屋，以3乘3乘6米為單位組合，視蘭佩杜薩市提供的土地而定；愛心計畫為期3年，將投入至少新台幣1200萬元，預計可照顧80到120名幼童及婦女。這項由新興民族文教基金會、謝許英文化藝術基金會及來思達國際集團共同發起的「愛之屋」計畫，今天與《遠見雜誌》舉辦捐贈儀式；蔡英文總統親自出席，見證「行愛天下」的義舉。義大利蘭佩杜薩島市議長Ms. Rosangela Mannino代表該島女市長及全島人民與難民，表達對台灣的真摯感謝。新興民族文教基金會董事長、民進黨前主席許信良表示，全世界有6000萬個難民，是今天人類面對的最大危機；難民問題是深植於歷史及文化的敵意所造成，也是人類要向前走遇到的最大障礙，即使是最先進的歐洲文明或美國文明都難以解決，但如果不能解決，後果無法想像。許信良表示，台灣文化是最沒有敵意、最大善意的文化，希望今天的努力可以帶動台灣人民投入救援難民的行動；所謂「星星之火，可以燎原」，「星星之愛，也可以改變世界、感動世界」。基於宗教信仰、種族歧視等因素，敘利亞、利比亞內戰頻仍，政治局勢動盪不安。聯合國難民署統計，2016年來已有數十萬難民，為求生存而逃亡。其中，義大利南方更是難民湧入歐洲的最佳登岸地，但也有許多船隻冒險穿越地中海，不幸遭吞噬而成為海上冤魂。這些難民悲歌，喚起國人重視。據指出，促成台灣與義大利此次救援合作的靈魂人物，是北科大教授顧卓雄。謝許英文化藝術基金會創辦人謝貞德表示，在歐洲難民「申根無門，返國無路」的當前，期待台灣有更多有效實質救援投入，給予難民人道援助。「歐洲難民婦幼關懷中繼站」採輕鋼架組合屋。圖／謝許英文化藝術基金會提供 分享  facebook twitter pinterest    台灣人送愛心到歐洲，將在義大利最南端的蘭佩杜薩（Lampedusa）小島上，成立「Casa di Love愛之屋」，協助難民營部分婦女與幼童融入歐洲生活。圖／謝許英文化藝術基金會提供 分享  facebook twitter pinterest"
    print content_analysis (meta, title, text)
