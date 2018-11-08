package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;

public class Influx_CommonAPI {
	final static Map<String, Object> listIndex_info = new HashMap<String, Object>();

	final static Logger logger = Logger.getLogger(Influx_CommonAPI.class);

	public static InfluxDB influxDB_Conn() {

		InfluxDB infDB = InfluxDBFactory.connect(
				"http://" + OpenIndex_ini.influxDB_IP + ":" + OpenIndex_ini.influxDB_Port, OpenIndex_ini.influx_id,
				OpenIndex_ini.influx_pwd);
		return infDB;
	}

	public Map<String, Object> influxDB_ListIndex() {

		InfluxDB inf = influxDB_Conn();
		QueryResult r = inf.query(new Query("SHOW DATABASES", null));
		// System.out.println(r.toString());
		if (listIndex_info.isEmpty() == false) {
			listIndex_info.clear();
		}
		// System.out.println(r.getResults().get(0).getSeries().get(0).getValues().get(0));

		Object[] inf_rit = r.getResults().get(0).getSeries().get(0).getValues().toArray();
		for (int i = 0; i < inf_rit.length; i++) {
			Map<String, String> tmp_inf_result = new HashMap<String, String>();
			if (tmp_inf_result.isEmpty() == false) {
				tmp_inf_result.clear();
			}
			if (inf_rit[i].toString().equals("[_internal]") || inf_rit[i].toString().equals("[telegraf]")) {
				// System.out.println("====");
				continue;
			}

			System.out.println(inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']')));
			QueryResult r_info = inf
					.query(new Query(
							"select sum(diskBytes)/(1024*1024) as db_size_mb from \"_internal\".\"monitor\".\"shard\" where time > now() - 10s AND \"database\" = '"
									+ inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']')) + "'",
							null));

			// System.out.println(
			// r_info.getResults().get(0).getSeries()==null);
			if (r_info.getResults().get(0).getSeries() == null) {
				tmp_inf_result.put("size", "0");
			} else {
				// System.out.println(r_info.getResults().get(0).getSeries().get(0).getValues().get(0).get(1));
				tmp_inf_result.put("size",
						r_info.getResults().get(0).getSeries().get(0).getValues().get(0).get(1).toString());
			}
			tmp_inf_result.put("org_index_name",
					inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']')));
			tmp_inf_result.put("doc",
					getInfluxDocNum(inf, inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']'))));
//			tmp_inf_result.put("index_type", "t");
			System.out.println("@@@"
					+ getInfluxDocNum(inf, inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']'))));

			// tmp_inf_result.put(inf_rit[i],r_info.getResults().get(0).getSeries().get(0));
			System.out.println("@@@@" + inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']')));
			String tmpIndexName = inf_rit[i].toString().substring(1, inf_rit[i].toString().indexOf(']'));

			listIndex_info.put(tmpIndexName.substring(tmpIndexName.indexOf("_") + 1), tmp_inf_result);
//			listIndex_info.put(tmpIndexName, tmp_inf_result);
		}
		System.out.println(listIndex_info);
		inf.close();
		return listIndex_info;
	}

	private String getInfluxDocNum(InfluxDB inf, String tableName) {
		String result = "0";
		inf.setDatabase(tableName);
		QueryResult r_info = inf.query(new Query("select count(*) from " + tableName + "", tableName));
		// System.out.println(r_info.getResults().get(0).getSeries());
		if (r_info.getResults().get(0).getSeries() == null) {
			result = "0";
		} else {
			result = r_info.getResults().get(0).getSeries().get(0).getValues().get(0).toString();
		}
		return result;
	}

	public static void main(String[] args) {
		// influxDB_ListIndex();
		// InfluxDB inf = new Influx_CommonAPI().influxDB_Conn();
		// System.out.println(getInfluxDocNum(inf, "t_yrc123"));
	}
}
