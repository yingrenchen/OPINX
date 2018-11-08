package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.influxdb.BatchOptions;
import org.influxdb.InfluxDB;
import org.influxdb.dto.Point;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;

public class Influx_TimeSeriesIndexAPI {
	final static Map<String, Object> result = new HashMap<String, Object>();
	final static Logger logger = Logger.getLogger(Influx_TimeSeriesIndexAPI.class);

	public ES_Response inf_Create(String index_Name) {
		InfluxDB inf = new Influx_CommonAPI().influxDB_Conn();
		ES_Response es_Rep = new ES_Response();
		// String dbName = "aTimeSeries";
		inf.createDatabase(index_Name);

		inf.setDatabase(index_Name);
		String rpName = "aRetentionPolicy";
		inf.createRetentionPolicy(rpName, index_Name, "30d", "30m", 2, true);
		inf.setRetentionPolicy(rpName);
		// Query query = new Query("SELECT idle FROM cpu", dbName);
		// influxDB.query(query);
		// influxDB.dropRetentionPolicy(rpName, dbName);
		// influxDB.deleteDatabase(dbName);
		inf.close();
		es_Rep.status = true;
		return es_Rep;
	}

	public ES_Response inf_Drop(String index_Name) {
		InfluxDB inf = new Influx_CommonAPI().influxDB_Conn();
		ES_Response es_Rep = new ES_Response();
		inf.deleteDatabase(index_Name);
		inf.close();
		es_Rep.status = true;
		return es_Rep;
	}

	public ES_Response inf_Insert(ES_Request req) {
		InfluxDB inf = new Influx_CommonAPI().influxDB_Conn();
		ES_Response es_Rep = new ES_Response();

		// inf.enableBatch(BatchOptions.DEFAULTS);
		if (req.getId_Num() == null||req.getId_Num().equals("")) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the id_Num\n");
			logger.debug("Id num is invalid");
		} else if (req.getIndex_Name() == null||req.getIndex_Name().equals("")) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the index_Name\n");
			logger.debug("Index name is invalid");
		} else if (req.getContent_text() == null||req.getContent_text().equals("")) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Content is invalid\n");
			logger.debug("Content is invalid");
		} else if (req.getTitle() == null||req.getTitle().equals("")) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Title is invalid\n");
			logger.debug("Title is invalid");
		} else if (req.getTag() == null||req.getTag().equals("")) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Tag is invalid\n");
			logger.debug("Tag is invalid");
		} else {
			String index_name = "t_" + req.getIndex_Name();
			inf.createDatabase(index_name);

			inf.setDatabase(index_name);
			String rpName = "aRetentionPolicy";
			inf.createRetentionPolicy(rpName, req.getIndex_Name(), "30d", "30m", 2, true);
			inf.setRetentionPolicy(rpName);
			inf.enableBatch(BatchOptions.DEFAULTS);
			if (req.getTimeStamp() == null || req.getTimeStamp().equals("")) {
				inf.write(Point.measurement(index_name).time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
						.addField("title", req.getTitle()).addField("content", req.getContent_text())
						.tag("ts_tag", req.getTag()).build());
				logger.debug("Wrtie data to InfluxDB");
			} else {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date date;
				try {
					date = sdf.parse(req.getTimeStamp());
					// System.out.println("t_"+req.getIndex_Name());
					// System.out.println(req.getTitle());
					// System.out.println(req.getContent_text());
					// System.out.println(req.getTag());
					// System.out.println(req.getTimeStamp());
					// System.out.println(date.getTime());
					inf.write(Point.measurement(index_name).time(date.getTime(), TimeUnit.MILLISECONDS)
							.addField("title", req.getTitle()).addField("content", req.getContent_text())
							.tag("ts_tag", req.getTag()).build());
					logger.debug("Wrtie data to InfluxDB");
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					logger.debug(e.getMessage());
					es_Rep.setErr_msg(e.getMessage());
					es_Rep.setStatus(false);
				}
			}
			inf.flush();
			inf.close();
			es_Rep.status = true;
		}
		return es_Rep;
	}

	public ES_Response inf_Select(String index_Name, String filter, String limit_num, String timestamp_start,
			String timestamp_stop) {
		InfluxDB inf = new Influx_CommonAPI().influxDB_Conn();
		ES_Response es_Rep = new ES_Response();
		Query query = new Query("SELECT * FROM " + index_Name + " WHERE ts_tag='" + filter + "' AND time >= '"
				+ timestamp_start + "' AND time <= '" + timestamp_stop + "' LIMIT " + limit_num + ";", index_Name);

		// Query query = new Query("SELECT * FROM " + index_Name + " WHERE
		// ts_tag ='qwe';", index_Name);
		QueryResult qr = inf.query(query);
	
		System.out.println(qr.getResults().get(0).getSeries().get(0).getColumns().toString());

		Object[] col_v = qr.getResults().get(0).getSeries().get(0).getColumns().toArray();
		System.out.println("================");
		System.out.println(qr.getResults().get(0).getSeries().get(0).getValues().toString());
		System.out.println("================");
		List<List<Object>> influx_result_v = qr.getResults().get(0).getSeries().get(0).getValues();
		Map<String, String> infr_tmp = new HashMap<String, String>();
		for (int j = 0; j < influx_result_v.size(); j++) {
			for (int i = 0; i < col_v.length; i++) {
				if (influx_result_v.get(j).get(i) == null) {
					infr_tmp.put(col_v[i].toString(), "");

					System.out.println(col_v[i].toString() + " : " + "");
				} else {
					infr_tmp.put(col_v[i].toString(), influx_result_v.get(j).get(i).toString());
					System.out.println(col_v[i].toString() + " : " + influx_result_v.get(j).get(i).toString());
				}

			}
			System.out.println("================");
			result.put(String.valueOf(j + 1), infr_tmp);
		}

		es_Rep.setErr_msg(qr.toString());
		es_Rep.setTs_searched_Data(result);
		return es_Rep;
	}

}
