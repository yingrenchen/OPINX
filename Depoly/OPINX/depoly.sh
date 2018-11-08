#!/bin/bash
ips=`ifconfig | grep Bcast|awk '{print $2}'|sed 's/addr://'` 
echo "====================== elasticsearch install ====================================="
sh elasticsearch/depoly_ES.sh 
echo "====================== tomcat install ====================================="
cp -r tomcat/apache-tomcat-7.0.72/ /opt/.
echo "====== configure tomcat ======"
sed -i "133c <param-value>http://${ips}:8080/OpenIndex_BackEnd/restAPI/</param-value>" /opt/apache-tomcat-7.0.72/webapps/BusinessSystem2/WEB-INF/web.xml
echo "====== configure API server ======"
sed -i "1,3c es_ClusterName=APlus-Cluster\nes_IP=0.0.0.0\nes_Cluster_Port=9300" /opt/apache-tomcat-7.0.72/webapps/OpenIndex_BackEnd/WEB-INF/classes/OPINX_ini.properties
sed -i "7c window.location.assign(\"http://${ips}:8080/iServDB/sample_code/OpenIndex_SampleCode.zip\");" /opt/apache-tomcat-7.0.72/webapps/iServDB/widgets/Basic/js.js
echo "====== start tomcat server ======"
sh /opt/apache-tomcat-7.0.72/bin/startup.sh

