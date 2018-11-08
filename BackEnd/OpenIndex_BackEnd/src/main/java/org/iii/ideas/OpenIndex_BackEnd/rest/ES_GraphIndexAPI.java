package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.xpack.graph.action.Connection;
import org.elasticsearch.xpack.graph.action.GraphExploreAction;
import org.elasticsearch.xpack.graph.action.GraphExploreRequestBuilder;
import org.elasticsearch.xpack.graph.action.GraphExploreResponse;
import org.elasticsearch.xpack.graph.action.Hop;
import org.elasticsearch.xpack.graph.action.Vertex;

public class ES_GraphIndexAPI {
	final static Map<String, Object> result_v = new HashMap<String, Object>();
	final static Map<String, Object> result_c = new HashMap<String, Object>();
	final static Map<String, Object> deletedDataInfo = new HashMap<String, Object>();
	final static Map<String, Object> update_json = new HashMap<String, Object>();
	final static Map<String, Object> updatedDataInfo = new HashMap<String, Object>();
	final static Map<String, Object> insertedDataInfo = new HashMap<String, Object>();
	final static Map<String, Object> insert_json = new HashMap<String, Object>();
	final static Logger logger = Logger.getLogger(ES_GraphIndexAPI.class);
	Calendar calendar;

	@SuppressWarnings({ "static-access", "deprecation" })
	public ES_Response es_Create(String index_Name, String index_Analyzer) throws Exception {
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		Client client = new ES_CommonAPI().es_ConnOpen();
		logger.debug("Start creating Index");
		ES_Response es_Rep = new ES_Response();
		if (new CommonFunction().isUpperCase(index_Name) == true) {// 檢查index
																	// name大小寫
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please use lowercase letter to name the index\n");
			logger.debug("Invalid index name");
		} else if (client.admin().indices().prepareExists(index_Name).execute().actionGet().isExists() == true) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("The index has existed");
			logger.debug("Index has existed");
		} else {

			client.admin().indices().prepareCreate(index_Name).addMapping(index_Name, "{\n" + "\"" + index_Name
					+ "\": {\n" + "			\"properties\": {\n" + "				\"content\": {\n"
					+ "					\"type\": \"text\"," + "					\"fields\": {\n"
					+ "						\"keyword\": {\n" + "							\"type\": \"keyword\","
					+ "							\"ignore_above\": 256" + "							}"
					+ "						}," + "					\"analyzer\": \"" + index_Analyzer + "\""
					+ "				}," + "				\"id\": {\n" + "					\"type\": \"text\","
					+ "					\"fields\": {\n" + "						\"keyword\": {\n"
					+ "							\"type\": \"keyword\","
					+ "							\"ignore_above\": 256" + "							}"
					+ "						}" + "				}," + "				\"tag\": {\n"
					+ "					\"type\": \"text\"," + "					\"fields\": {\n"
					+ "						\"keyword\": {\n" + "							\"type\": \"keyword\","
					+ "							\"ignore_above\": 256" + "							}"
					+ "					}," + "					\"analyzer\": \"" + index_Analyzer + "\","
					+ "					\"fielddata\": true" + "				}," + "				\"timestamp\": {\n"
					+ "					\"type\": \"date\"," + "					\"format\": \"yyyy-MM-dd HH:mm:ss\""
					+ "				}," + "				\"title\": {\n" + "					\"type\": \"text\","
					+ "					\"fields\": {\n" + "						\"keyword\": {\n"
					+ "							\"type\": \"keyword\","
					+ "							\"ignore_above\": 256" + "							}"
					+ "					}," + "					\"analyzer\": \"" + index_Analyzer + "\""
					+ "				}" + "			}" + "		}" + "}").get();
			logger.debug("Create index scuccful");
			es_Rep.setStatus(true);
			es_Rep.setIndex_List(client.admin().cluster().prepareState().execute().actionGet().getState().getMetaData()
					.getConcreteAllIndices());
		}
		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));

		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_Rep;
	}

	@SuppressWarnings("static-access")
	public ES_Response es_Drop(String index_Name) throws IOException {
		logger.debug("Start drop Index");
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		Client client = new ES_CommonAPI().es_ConnOpen();
		ES_Response es_Rep = new ES_Response();

		if (client.admin().indices().prepareExists(index_Name).execute().actionGet().isExists() == true) {
			client.admin().indices().prepareDelete(index_Name).execute().actionGet();
			es_Rep.setStatus(true);
			logger.debug("Drop index scuccful");
		} else {
			es_Rep.setErr_msg("The index hasn't existed");
			es_Rep.setStatus(false);
			logger.debug("Index hasn't existed");
		}

		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_Rep;

	}

	@SuppressWarnings("static-access")
	public ES_Response es_Insert(ES_Request req, String index_type) throws IOException {
		logger.debug("Start insert Index data");
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		ES_Response es_Rep = new ES_Response();
		Client client = new ES_CommonAPI().es_ConnOpen();
		if (insert_json.isEmpty() == false || insertedDataInfo.isEmpty() == false) {
			insertedDataInfo.clear();
			insert_json.clear();
			logger.debug("Clear response object memory allocation");
		}

		if (req.getId_Num() == null||req.getId_Num().equals("")||req.getId_Num().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the id_Num\n");
			logger.debug("Id num is invalid");
		} else if (req.getIndex_Name() == null||req.getIndex_Name().equals("")||req.getIndex_Name().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the index_Name\n");
			logger.debug("Index name is invalid");
		} else if (req.getContent_text() == null||req.getContent_text().equals("")||req.getContent_text().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the content\n");
			logger.debug("Content is invalid");
		} else if (req.getTitle() == null||req.getTitle().equals("")||req.getTitle().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the title\n");
			logger.debug("Title is invalid");
		} else if (req.getTag() == null||req.getTag().equals("")||req.getTag().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the tag\n");
			logger.debug("Tag is invalid");
		} else {
			if (req.getTimeStamp() == null || req.getTimeStamp().equals("")||req.getTimeStamp().isEmpty()) {
				Date date = new Date();
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				insert_json.put("timestamp", dateFormat.format(date));
			} else {
				insert_json.put("timestamp", req.getTimeStamp());
			}
			insert_json.put("content", req.getContent_text());
			insert_json.put("tag", req.getTag());
			insert_json.put("title", req.getTitle());
			IndexResponse response = client.prepareIndex(index_type + "_" + req.getIndex_Name(),
					index_type + "_" + req.getIndex_Name(), req.getId_Num()).setSource(insert_json).execute()
					.actionGet();
			es_Rep.setStatus(true);
			logger.debug("Insert Index data scuccful");
			insertedDataInfo.put("inserted_index", response.getIndex());
			insertedDataInfo.put("inserted_type", response.getType());
			insertedDataInfo.put("inserted_id", response.getId());
			es_Rep.setInserted_Data_info(insertedDataInfo);
		}

		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));

		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_Rep;
	}

	@SuppressWarnings("static-access")
	public ES_Response es_Update(ES_Request req, String index_type) throws IOException {
		logger.debug("Start update Index data");
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		ES_Response es_Rep = new ES_Response();
		Client client = new ES_CommonAPI().es_ConnOpen();
		if (update_json.isEmpty() == false || updatedDataInfo.isEmpty() == false) {
			updatedDataInfo.clear();
			update_json.clear();
			logger.debug("Clear response object memory allocation");
		}

		if (req.getId_Num() == null||req.getId_Num().equals("")||req.getId_Num().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the id_Num\n");
			logger.debug("Id num is invalid");
		} else if (req.getIndex_Name() == null||req.getIndex_Name().equals("")||req.getIndex_Name().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the index_Name\n");
			logger.debug("Index name token is invalid");
		} else if (req.getContent_text() == null||req.getContent_text().equals("")||req.getContent_text().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the content\n");
			logger.debug("Content is invalid");
		} else if (req.getTag() == null||req.getTag().equals("")||req.getTag().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the tag\n");
			logger.debug("Tag is invalid");
		} else if (req.getTitle() == null||req.getTitle() .equals("")||req.getTitle().isEmpty()) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("Please enter the title\n");
			logger.debug("Title is invalid");

		} else {
			if (req.getTimeStamp() == null || req.getTimeStamp().equals("")||req.getTimeStamp().isEmpty()) {

				Date date = new Date();
				DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				update_json.put("timestamp", dateFormat.format(date));
			} else {

				update_json.put("timestamp", req.getTimeStamp());
			}
			update_json.put("content", req.getContent_text());
			update_json.put("tag", req.getTag());
			IndexResponse response = client
					.prepareIndex(index_type + "_" + req.getIndex_Name(), index_type + "_" +req.getIndex_Name(), req.getId_Num())
					.setSource(update_json).execute().actionGet();
			es_Rep.setStatus(true);
			logger.debug("Update Index data scuccful");
			updatedDataInfo.put("updated_index", response.getIndex());
			updatedDataInfo.put("updated_type", response.getType());
			updatedDataInfo.put("updated_id", response.getId());
			es_Rep.setUpdated_Data_info(updatedDataInfo);
		}

		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));

		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_Rep;
	}

	@SuppressWarnings("static-access")
	public ES_Response es_Delete(String index_Name, String index_id) throws IOException {
		logger.debug("Start delete Index data");
		long rep_time_start = calendar.getInstance().getTimeInMillis();
		Client client = new ES_CommonAPI().es_ConnOpen();
		if (deletedDataInfo.isEmpty() == false) {
			deletedDataInfo.clear();
			logger.debug("Clear response object memory allocation");
		}
		ES_Response es_Rep = new ES_Response();

		DeleteResponse response = client.prepareDelete(index_Name, index_Name, index_id).execute().actionGet();
		if (response.getId() == null) {
			es_Rep.setStatus(false);
			es_Rep.setErr_msg("The index data is already deleted\n");
			logger.debug("The index data is already deleted");
		} else {

			deletedDataInfo.put("deleted_index", response.getIndex());
			deletedDataInfo.put("deleted_type", response.getType());
			deletedDataInfo.put("deleted_id", response.getId());
			logger.debug("Delete Index data scuccful");
			es_Rep.setStatus(true);
			es_Rep.setDeleted_Data_info(deletedDataInfo);
		}

		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setResponse_time(String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));

		logger.debug("Response time is " + String.valueOf((calendar.getInstance().getTimeInMillis() - rep_time_start)));
		return es_Rep;
	}

	public ES_Response es_Select(String index_Name, String filter, String limit_num, String timestamp_start,
			String timestamp_stop) {
		// filter = "巴拿馬, 蔡英文, 踏實外交";
		String[] filter_arr = filter.replace("\"", "").split("\\,");
		System.out.println("==============" + filter);
		System.out.println("==============" + filter_arr.toString());
		for (int i = 0; i < filter_arr.length; i++) {
			System.out.println("\"" + filter_arr[i] + "\"");
			// if (filter_arr[i].compareTo("巴拿馬")==0) {
			// System.out.println("same");
			// }
		}
		Client client = new ES_CommonAPI().es_ConnOpen();
		ES_Response es_Rep = new ES_Response();
		int requiredNumberOfSightings = 1;
		Hop hop1 = null;
		GraphExploreRequestBuilder grb = new GraphExploreRequestBuilder(client, GraphExploreAction.INSTANCE)
				.setIndices(index_Name);
		if (!result_v.isEmpty() || !result_c.isEmpty()) {
			result_v.clear();
			result_c.clear();
		}
		if (timestamp_start.isEmpty() == false) {
			if (timestamp_stop.isEmpty() == false) {

				hop1 = grb.createNextHop(QueryBuilders.boolQuery().must(QueryBuilders.termsQuery("tag", filter_arr))
						.filter(QueryBuilders.rangeQuery("timestamp").from(timestamp_start).to(timestamp_stop)));
			} else {
				hop1 = grb.createNextHop(QueryBuilders.boolQuery().must(QueryBuilders.termsQuery("tag", filter_arr))
						.filter(QueryBuilders.rangeQuery("timestamp").from(timestamp_start).to("now")));
			}
		} else {
			hop1 = grb.createNextHop(QueryBuilders.boolQuery().must(QueryBuilders.termsQuery("tag", filter_arr)));
		}
		// Hop hop1 =
		// grb.createNextHop(QueryBuilders.boolQuery().must(QueryBuilders.termQuery("content",
		// "蔡英文"))
		// .filter(QueryBuilders.rangeQuery("timestamp").from("2013-01-01").to("2016-12-31")));
		hop1.addVertexRequest("tag").size(10).minDocCount(requiredNumberOfSightings);
		// groups attended by elastic attendees
		grb.createNextHop(null).addVertexRequest("tag").size(10).minDocCount(requiredNumberOfSightings);
		GraphExploreResponse response = grb.get();
		Collection<Vertex> vertices = response.getVertices();
		Collection<Connection> Connections = response.getConnections();
		System.out.println("===pp_tags===");
		int i = 0;

		for (Vertex vertex : vertices) {

			System.out.println(vertex.getWeight());
			result_v.put(String.valueOf(i), vertex.getTerm());
			i++;
		}

		for (Connection Connection : Connections) {
			System.out.println(Connection.getId());
			result_c.put(String.valueOf(Connection.getId()), Connection.getFrom() + "," + Connection.getTo());
		}
		es_Rep.setGraph_searched_Data_info_v(result_v);
		es_Rep.setGraph_searched_Data_info_c(result_c);
		new ES_CommonAPI().es_ConnClose(client);
		es_Rep.setStatus(true);
		return es_Rep;
	}

}
