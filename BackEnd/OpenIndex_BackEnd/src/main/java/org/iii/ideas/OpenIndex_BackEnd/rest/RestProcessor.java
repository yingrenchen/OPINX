package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest API進入點,接收JSON物件後使用Java reflection呼叫相對應的服務執行並將處理結果回傳
 */
@RestController
public class RestProcessor {
	/**
	 * 執行Rest API相關服務
	 * 
	 * @param req
	 *            接收的JSON物件
	 * @return 回應的JSON物件
	 */
	// =========================init=======================//
	ES_Response es_rep = new ES_Response();
	Common_Response crep = new Common_Response();
	ES_FullTextIndexAPI esf = new ES_FullTextIndexAPI();
	ES_GraphIndexAPI esg = new ES_GraphIndexAPI();
	Influx_TimeSeriesIndexAPI inft = new Influx_TimeSeriesIndexAPI();
	ES_CommonAPI esc = new ES_CommonAPI();
	Influx_CommonAPI infc = new Influx_CommonAPI();

	@RequestMapping(value = "/listIndex", method = RequestMethod.GET)
	public @ResponseBody ES_Response listESIndex(@RequestParam(value = "index_type", required = true) String index_type)
			throws IOException, InterruptedException, ExecutionException {
		es_rep = new CommonFunction().listIndex(index_type);
		return es_rep;
		// return null;
	}

	@RequestMapping(value = "/create", method = RequestMethod.GET)
	public @ResponseBody ES_Response createIndex(@RequestParam(value = "index_name", required = true) String index_Name,
			@RequestParam(value = "index_type", required = true) String index_type,
			@RequestParam(value = "analyzer", required = true) String index_Analyzer) throws Exception {
		if (index_Name.equals(" ") || index_Name.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("Index name must be composed by A-Z,a-z,0-9\n");
		} else if (index_type.equals("") || index_Analyzer.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("The index type and analyzer must be filled\n");
		} else if (index_Analyzer.equals("ik_max_word") == false || !index_Analyzer.equals("ik_smart") == false) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("The analyzer must one of ik_max_word or ik_smart\n");
		} else {
			switch (index_type) {
			case "f":
				es_rep = esf.es_Create("f_" + index_Name, index_Analyzer);
				break;
			case "g":
				es_rep = esg.es_Create("g_" + index_Name, index_Analyzer);
				break;
			case "t":
				es_rep = inft.inf_Create("t_" + index_Name);
				break;
			default:
				es_rep.setStatus(false);
				es_rep.setErr_msg(
						"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
			}
		}
		return es_rep;

	}

	@RequestMapping(value = "/drop", method = RequestMethod.GET)
	public @ResponseBody ES_Response dropIndex(@RequestParam(value = "index_name", required = true) String index_Name,
			@RequestParam(value = "index_type", required = true) String index_type) throws IOException {
		switch (index_type) {
		case "f":
			es_rep = esf.es_Drop("f_" + index_Name);
			break;
		case "g":
			es_rep = esg.es_Drop("g_" + index_Name);
			break;
		case "t":
			es_rep = inft.inf_Drop("t_" + index_Name);
			break;
		default:
			es_rep.setStatus(false);
			es_rep.setErr_msg(
					"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
		}
		return es_rep;
	}

	// @RequestMapping(value = "/get", method = RequestMethod.GET)
	// public @ResponseBody ES_Response getESIndexMappings(
	// @RequestParam(value = "index_name", required = true) String index_Name)
	// throws IOException {
	//
	// switch (index_Type) {
	// case "f":
	// es_rep = esf.es_Drop(index_Name);
	// case "g":
	// es_rep = esg.es_Drop(index_Name);
	// case "t":
	// }
	// return esc.es_Get(index_Name);
	// }

	@RequestMapping(value = "/insert", method = RequestMethod.POST)
	public @ResponseBody ES_Response insertData(@RequestBody ES_Request req,
			@RequestParam(value = "index_type", required = true) String index_type) {
		try {
			switch (index_type) {
			case "f":
				es_rep = esf.es_Insert(req, "f");
				break;
			case "g":
				es_rep = esg.es_Insert(req, "g");
				break;
			case "t":
				es_rep = inft.inf_Insert(req);
				break;
			default:
				es_rep.setStatus(false);
				es_rep.setErr_msg(
						"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
			}

		} catch (

		IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			es_rep.setErr_msg(e.getMessage());
		}
		return es_rep;
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public @ResponseBody ES_Response updateData(@RequestBody ES_Request req,
			@RequestParam(value = "index_type", required = true) String index_type) throws IOException {

		switch (index_type) {
		case "f":
			es_rep = esf.es_Update(req, "f");
			break;
		case "g":
			es_rep = esg.es_Update(req, "g");
			break;
		case "t":
		default:
			es_rep.setStatus(false);
			es_rep.setErr_msg(
					"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
		}

		return es_rep;
	}

	@RequestMapping(value = "/delete", method = RequestMethod.GET)
	public @ResponseBody ES_Response deleteData(@RequestParam(value = "index_name", required = true) String index_Name,
			@RequestParam(value = "id_Num", required = true) String id,
			@RequestParam(value = "index_type", required = true) String index_type) throws IOException {
		if (index_Name.equals(" ") || index_Name.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("Index name must be composed by A-Z,a-z,0-9\n");
		}else if (id.equals(" ") || id.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("Id_Num must be filled\n");
		} else {
			switch (index_type) {
			case "f":
				es_rep = esf.es_Delete("f_" + index_Name, id);
				break;
			case "g":
				es_rep = esg.es_Delete("g_" + index_Name, id);
				break;
			case "t":
				// es_rep=inft.inf_Delete()
			default:
				es_rep.setStatus(false);
				es_rep.setErr_msg(
						"please check the index_type, it should be one of f (for FullText Index),g (for Graph Index) or t(for Time-Series Index)");
			}
		}
		return es_rep;
	}

	@RequestMapping(value = "/select", method = RequestMethod.GET)
	public @ResponseBody ES_Response selectES(@RequestParam(value = "index_name", required = true) String index_Name,
			@RequestParam(value = "filter", required = true) String filter,
			@RequestParam(value = "limit_start") String limit_start,
			@RequestParam(value = "limit_num") String limit_num,
			@RequestParam(value = "timestamp_start") String timestamp_start,
			@RequestParam(value = "timestamp_stop") String timestamp_stop,
			@RequestParam(value = "search_type", required = true) String search_type) throws IOException {
		if (limit_start.isEmpty()) {
			limit_start = "0";
		}
		if (limit_num.isEmpty()) {
			limit_num = "20";
		}
		if (index_Name.equals(" ") || index_Name.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("Index name must be composed by A-Z,a-z,0-9\n");

		} else if (filter.equals(" ") || filter.equals("")) {
			es_rep.setStatus(false);
			es_rep.setErr_msg("Filter must be filled\n");
		} else {
			switch (search_type) {
			case "f":
				es_rep = esf.es_Select("f_" + index_Name, filter, limit_start, limit_num, timestamp_start,
						timestamp_stop);
				break;
			case "g":
				es_rep = esg.es_Select("g_" + index_Name, filter, limit_num, timestamp_start, timestamp_stop);
				break;
			case "t":
				es_rep = inft.inf_Select("t_" + index_Name, filter, limit_num, timestamp_start, timestamp_stop);
				break;
			default:
				es_rep.setStatus(false);
				es_rep.setErr_msg("choose the right search type ,'f' for FullText index,'g' for Graph index,"
						+ "'ts' for Time-Series index");
			}
		}
		return es_rep;

	}

}
