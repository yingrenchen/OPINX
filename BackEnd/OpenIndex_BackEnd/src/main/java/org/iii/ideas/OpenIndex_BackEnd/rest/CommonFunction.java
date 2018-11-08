package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.apache.log4j.Logger;

public class CommonFunction {
	final static Logger logger = Logger.getLogger(CommonFunction.class);
	static Calendar calendar;

	public static Boolean isUpperCase(String s) {
		char[] tmp_s = s.toCharArray();
		int low = 0;
		for (int i = 0; i < s.length(); i++) {
			if (((tmp_s[i] <= 57 && tmp_s[i] >= 48) || (tmp_s[i] >= 97 && tmp_s[i] <= 122)) == true
					|| (tmp_s[i] == 95) == true) {
				low++;
			}
		}
		if (low == s.length()) {
			return false;
		} else {
			return true;
		}
	}

	public static ES_Response listIndex(String index_type)
			throws IOException, InterruptedException, ExecutionException {
		logger.debug("Starting list Index");
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		ES_CommonAPI esc = new ES_CommonAPI();
		Influx_CommonAPI infc = new Influx_CommonAPI();
		ES_Response es_rep = new ES_Response();

		Map<String, Object> result = new HashMap<String, Object>();
		switch (index_type) {
		case "f":
			result = esc.es_ListIndex(index_type);
			es_rep.setStatus(true);
			es_rep.setIndex_List(result);
			logger.debug("List Index scuccfully");
			break;
		case "g":
			result = esc.es_ListIndex(index_type);
			es_rep.setStatus(true);
			es_rep.setIndex_List(result);
			logger.debug("List Index scuccfully");
			break;
		case "t":
			result = infc.influxDB_ListIndex();
			es_rep.setStatus(true);
			es_rep.setIndex_List(result);
			break;
		default:
			es_rep.setStatus(false);
			es_rep.setErr_msg(
					"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
		}

		es_rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));

		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_rep;
	}

	public static void main(String[] args) throws IOException, InterruptedException, ExecutionException {
		listIndex("f");
	}
}
