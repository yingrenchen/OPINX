package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.apache.log4j.Logger;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsRequest;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.common.collect.ImmutableOpenMap;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.xpack.client.PreBuiltXPackTransportClient;

import com.carrotsearch.hppc.cursors.ObjectObjectCursor;

public class ES_CommonAPI {

	final static Map<String, Object> index_List_results = new HashMap<String, Object>();

	// static Map<String, Object> source = new HashMap<String, Object>();
	final static Logger logger = Logger.getLogger(ES_CommonAPI.class);
	SearchResponse searchResponse_scroll;
	SearchResponse searchResponse;

	// Calendar calendar;

	@SuppressWarnings("resource")
	public Client es_ConnOpen() {

		Client client = null;
		Settings settings = Settings.builder().put("cluster.name", OpenIndex_ini.es_ClusterName)
				.put("client.transport.sniff", true).put("xpack.security.user", "elastic:changeme").build();// mycluster1;APlus-cluster
		try {
			client = new PreBuiltXPackTransportClient(settings).addTransportAddress(new InetSocketTransportAddress(
					InetAddress.getByName(OpenIndex_ini.es_Cluster_IP), OpenIndex_ini.es_Cluster_Port));// 140.92.143.99
			logger.debug("ES connection opened");
			logger.debug("cluster name is " + OpenIndex_ini.es_ClusterName);

		} catch (UnknownHostException e) {
			e.printStackTrace();
			logger.error("ES connection error", e);
		}
		return client;
	}

	public void es_ConnClose(Client client) {
		client.close();
		logger.debug("ES connection closed");
	}

	@SuppressWarnings("static-access")
	public ES_Response es_Get(String index_Name) throws IOException {
		logger.debug("Start get Index options");
		Map<String, Object> getMapping_json = new HashMap<String, Object>();
		// long rep_time_start = calendar.getInstance().getTimeInMillis();
		Client client = es_ConnOpen();
		ES_Response es_Rep = new ES_Response();

		if (client.admin().indices().prepareExists(index_Name).execute().actionGet().isExists() == true) {
			GetMappingsResponse gMappingres = null;
			try {
				gMappingres = client.admin().indices().getMappings(new GetMappingsRequest().indices(index_Name)).get();
				logger.debug("Get Index mappings scuccful");
			} catch (InterruptedException e) {
				logger.error("Get Index options error" + e);
			} catch (ExecutionException e) {
				logger.error("Get Index options error" + e);
			}
			ImmutableOpenMap<String, MappingMetaData> mapping = gMappingres.mappings().get(index_Name);
			for (ObjectObjectCursor<String, MappingMetaData> c : mapping) {
				getMapping_json = c.value.getSourceAsMap();
			}
			es_Rep.setIndex_Mappings(getMapping_json);
			es_Rep.setStatus(true);
			logger.debug("Get Index options scuccful");
		} else {
			es_Rep.setErr_msg("The index  hasn't existed");
			es_Rep.setStatus(false);
			logger.debug("Index  hasn't existed");
		}

		es_ConnClose(client);
		// es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis()
		// - rep_time_start)));

		// logger.debug("Response time is " +
		// String.valueOf((calendar.getInstance().getTimeInMillis() -
		// rep_time_start)));
		return es_Rep;
	}

	@SuppressWarnings("static-access")
	public Map<String, Object> es_ListIndex(String index_type)
			throws IOException, InterruptedException, ExecutionException {

		Client client = es_ConnOpen();
		if (index_List_results.isEmpty() == false) {
			index_List_results.clear();
			logger.debug("Clear response object memory allocation");
		}
		ES_Response es_Rep = new ES_Response();

		String[] index_List = client.admin().cluster().prepareState().execute().actionGet().getState().getMetaData()
				.getConcreteAllIndices();
		String[] index_List_tmp = Arrays.copyOf(index_List, index_List.length);

		if (index_List.length != 0) {
		
			for (int i = 0; i < index_List.length; i++) {
//				System.out.println("@@@@@@@@@@@@"+index_List_tmp[i].substring(0,1));
				if (index_List_tmp[i].contains(".")
						|| (index_List_tmp[i].substring(0,1).equals(index_type) == false)) {
					
					continue;
				}

				if (index_List_tmp[i].indexOf("_") > 0) {
					String index_tmp = index_List_tmp[i];
					index_List_tmp[i] = index_tmp.substring(index_tmp.indexOf("_") + 1);
					// System.out.println(index_List_tmp[i]);
				}

				//
				Map<String, String> temp_Map = new HashMap<String, String>();
				if (temp_Map.isEmpty() == false) {
					temp_Map.clear();
				}
				temp_Map.put("docs", String.valueOf(client.admin().indices().prepareStats(index_List[i]).execute()
						.actionGet().getTotal().getDocs().getCount()));
				temp_Map.put("size", String.valueOf(client.admin().indices().prepareStats(index_List[i]).execute()
						.actionGet().getTotal().getStore().getSize().getBytes()));

				// temp_Map.put("total",
				// String.valueOf(client.admin().indices().prepareStats(index_List[i]).execute()
				// .actionGet().getTotal().getIndexing().getTotal().getIndexCount()));
				temp_Map.put("org_index_name", index_List[i]);

				// System.out.println("index_List:" + index_List[i]);
				// System.out.println("index_List_tmp:" +
				// index_List_tmp[i]);
				// logger.debug("index_List : " + index_List[i]);
				// logger.debug("index_List_tmp : " + index_List_tmp[i]);
				index_List_results.put(index_List_tmp[i], temp_Map);
			}
			// es_Rep.setStatus(true);
			// es_Rep.setIndex_List(index_List_results);

		} else {
			// es_Rep.setStatus(false);
			// es_Rep.setErr_msg("Not any index exists");
			logger.debug("Not any index exists");
		}

		es_ConnClose(client);

		return index_List_results;
	}

}
