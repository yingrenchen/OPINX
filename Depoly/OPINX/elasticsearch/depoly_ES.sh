#!/bin/bash
echo "======start to download elasticsearch======"
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch| apt-key add -
echo "deb https://packages.elastic.co/elasticsearch/2.x/debian stable main" | tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
add-apt-repository ppa:openjdk-r/ppa -y
apt-get update
apt-get install openjdk-8-jdk --yes --force-yes
apt-get install elasticsearch=2.3.4 --yes --force-yes
echo "======configureing elasticsearch======"
echo "cluster.name: APlus-Cluster" |sudo tee -a  /etc/elasticsearch/elasticsearch.yml
echo "node.name: $(hostname)" |tee -a  /etc/elasticsearch/elasticsearch.yml
echo "network.host: 0.0.0.0"  |tee -a  /etc/elasticsearch/elasticsearch.yml
sudo service elasticsearch restart
sleep 10s
curl http://localhost:9200
java -version
echo "======add elasticsearch plugin======"
cp -r elasticsearch/plugin/* /usr/share/elasticsearch/plugins/.
chown root:root /usr/share/elasticsearch/plugins/
service elasticsearch restart

