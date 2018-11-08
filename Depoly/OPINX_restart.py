import commands
import paramiko
import time

def re_tomcat(node_ip,pn,user,pawd):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(node_ip[0],port=pn, username=user, password=pawd)
    cmd='ps -aux | grep tomcat -c'
    stdin, stdout, stderr = ssh.exec_command(cmd)
    tc=stdout.readlines()[0][0]
    #print node_ip[0]
    #print pn
    #print user
    #print pawd
    #print 'tc='+str(tc) 
    if tc == '3':
        cmd='echo '+pawd+' | sudo -S sh /opt/apache-tomcat-7.0.72/bin/shutdown.sh'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdin.flush()
        #print stdin.readlines()
        #print stdout.readlines()
        #print stderr.readlines()
        print "Tomcat shutdown"
        print "Waiting for Tomcat starting"
        time.sleep(10)
        cmd='echo '+pawd+' | sudo -S sh /opt/apache-tomcat-7.0.72/bin/startup.sh'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdin.flush()
        print "Tomcat started"
        ssh.close()
    elif tc == '2':
        cmd='echo '+pawd+' | sudo -S sh /opt/apache-tomcat-7.0.72/bin/startup.sh'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        #stdin.flush()
        #print cmd
        print "Tomcat started"
        ssh.close()
        
def re_es(node_ip,pn,user,pawd):
    for a in node_ip:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(a,port=pn, username=user, password=pawd)
        cmd='echo '+pawd+' | sudo -S service elasticsearch restart'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdin.flush()
        #print stdout.readlines()
        #print stderr.readlines()
        print "Elasticsearch restarted"
        ssh.close()
    
def re_redis(node_ip,pn,user,pawd):
    for a in node_ip:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(a,port=pn, username=user, password=pawd)
        cmd='echo '+pawd+' | python /opt/housekeeper/redis_local '+user+' '+pawd+' start'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        tc=stdout.readlines()
        #print tc
        print "Redis restarted"
    
if __name__=="__main__":
    node_ip=['192.168.111.63','192.168.111.64','192.168.111.65']
    username='admnistrator'
    password='syscom@123'
    port_n=322
    while(True):
        print "Which service would you want ot restart ?"
        print "1:Tomcat\n2:Redis\n3:elasticsearch\n4:All\nq:exit"
        x=raw_input("")
        if x=='q':
            break
        # print "Enter the ip of node"
        # cip=raw_input("")
        # print "Enter the username"
        # usern=raw_input("")
        # print "Enter the password"
        # pawd=raw_input("")
        if x == '1':
            re_tomcat(node_ip,port_n,username,password)
        elif x == '2':
            re_redis(node_ip,port_n,username,password)
        elif x == '3':
            re_es(node_ip,port_n,username,password)
        elif x == '4':
            re_tomcat(node_ip,port_n,username,password)
            re_redis(node_ip,port_n,username,password)
            re_es(node_ip,port_n,username,password)
