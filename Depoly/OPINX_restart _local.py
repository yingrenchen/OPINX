import commands
import paramiko
import time

def re_tomcat(node_ip,pn,user,pawd):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(node_ip, username=user, password=pawd)
    cmd='ps -aux | grep tomcat -c'
    stdin, stdout, stderr = ssh.exec_command(cmd)
    tc=stdout.readlines()[0][0] 
    if tc == '3':
        cmd='echo '+pawd+' | sudo -S sh /opt/apache-tomcat-7.0.72/bin/shutdown.sh'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdin.flush()
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

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(node_ip, username=user, password=pawd)
    cmd='echo '+pawd+' | sudo -S service elasticsearch restart'
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdin.flush()
    print "Elasticsearch restarted"
    ssh.close()
    
if __name__=="__main__":
   
    username='localadmin'
    password='openstack'
    port_n=322 
    re_tomcat('localhost',port_n,username,password)
    re_es('localhost',port_n,username,password)

