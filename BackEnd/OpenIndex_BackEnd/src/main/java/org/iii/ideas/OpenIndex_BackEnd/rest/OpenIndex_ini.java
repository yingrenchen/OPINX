package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class OpenIndex_ini {
	static String es_ClusterName = "";
	static String es_Cluster_IP = "";
	static String influxDB_IP = "140.92.143.180";
	static String influx_id = "root";
	static String influx_pwd = "root";
	static int influxDB_Port =8086;
	static int es_Cluster_Port = 9300;
	

	public void OPINX_init() throws IOException {

		Properties prop = new Properties();
		String propFileName = "OPINX_ini.properties";

		InputStream inputStream = getClass().getClassLoader().getResourceAsStream(propFileName);
		if (inputStream != null) {
			prop.load(inputStream);
		} else {
			throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
		}
		OpenIndex_ini.es_ClusterName = prop.getProperty("es_ClusterName");
		OpenIndex_ini.es_Cluster_IP = prop.getProperty("es_IP");
		OpenIndex_ini.es_Cluster_Port = Integer.parseInt(prop.getProperty("es_Cluster_Port"));
		OpenIndex_ini.influx_id=prop.getProperty("influx_id");
		OpenIndex_ini.influx_pwd=prop.getProperty("influx_pwd");
		OpenIndex_ini.influxDB_IP=prop.getProperty("influxDB_IP");
		OpenIndex_ini.influxDB_Port = Integer.parseInt(prop.getProperty("influxDB_Port"));
	}

	// ==============1F===============
	// final static String es_ClusterName = "APlus-cluster";
	// final static String[] es_Cluster_3IPs = {
	// "192.168.122.182","192.168.122.142", "192.168.122.97" };
	// final static int es_Cluster_Port = 9300;
	// final static String redis_IP = "192.168.122.182";
	// final static int redis_Port = 7000;

	// ==============2F_test===============
	/*
	 * final static String es_ClusterName="my-cluster"; final static String[]
	 * es_Cluster_3IPs={"140.92.143.91","140.92.143.56","140.92.143.75"}; final
	 * static int es_Cluster_Port= 9300; final static String
	 * redis_IP="140.92.143.56"; final static int redis_Port = 7000;
	 */
	// ==============4F===============
	/*
	 * final static String es_ClusterName="ser-cluster-4F"; final static
	 * String[] es_Cluster_3IPs={"10.0.1.21","10.0.1.22","10.0.1.23"}; final
	 * static int es_Cluster_Port=9300; final static String
	 * redis_IP="10.0.1.21"; final static int redis_Port=7000;
	 */
	// ==============berry===============
	/*
	 * final static String es_ClusterName="ser-cluster-4F"; final static
	 * String[]
	 * es_Cluster_3IPs={"192.168.1.22","192.168.1.126","192.168.1.160"}; final
	 * static int es_Cluster_Port=9300; final static String
	 * redis_IP="192.168.1.126"; final static int redis_Port=7000;
	 */
}
