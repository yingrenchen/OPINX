package org.iii.ideas.OpenIndex_BackEnd.rest;

///////////////////
//設定API回傳JSON內容
///////////////////
public class ES_Response extends Common_Response {
	private String response_time;
	private Object index_List; // 儲存所有index清單
	private Object index_Mappings; // index使用的mappings
	private Object inserted_Data_info;
	private Object updated_Data_info;
	private Object deleted_Data_info;
	private Object searched_Data_info;
	private Object graph_searched_Data_info_v;
	private Object graph_searched_Data_info_c;
	private Object ts_searched_Data;
	public ES_Response() {
		this.status = false;
		this.err_msg = "";
		this.index_List = "";
		this.index_Mappings = "";
		this.inserted_Data_info = "";
		this.updated_Data_info = "";
		this.deleted_Data_info = "";
		this.searched_Data_info = "";
		this.response_time = "";
		this.graph_searched_Data_info_v = "";
		this.graph_searched_Data_info_c = "";
		this.ts_searched_Data="";
	}
	public Object getTs_searched_Data() {
		return ts_searched_Data;
	}
	public Object getIndex_Mappings() {
		return index_Mappings;
	}

	public Object getDeleted_Data_info() {
		return deleted_Data_info;
	}

	public Object getGraph_searched_Data_info_v() {
		return graph_searched_Data_info_v;
	}

	public Object getGraph_searched_Data_info_c() {
		return graph_searched_Data_info_c;
	}

	public Object getSearched_Data_info() {
		return searched_Data_info;
	}

	public Object getUpdated_Data_info() {
		return updated_Data_info;
	}

	public Object getInserted_Data_info() {
		return inserted_Data_info;
	}

	public Object getIndex_List() {
		return index_List;
	}

	public String getErr_msg() {
		return err_msg;
	}

	public String getResponse_time() {
		return response_time;
	}

	public boolean getStatus() {
		return status;
	}
	
	public void setTs_searched_Data(Object ts_searched_Data) {
		this.ts_searched_Data = ts_searched_Data;
	}
	
	public void setInserted_Data_info(Object inserted_Data_info) {
		this.inserted_Data_info = inserted_Data_info;
	}

	public void setSearched_Data_info(Object searched_Data_info) {
		this.searched_Data_info = searched_Data_info;
	}

	public void setGraph_searched_Data_info_c(Object graph_searched_Data_info_c) {
		this.graph_searched_Data_info_c = graph_searched_Data_info_c;
	}

	public void setGraph_searched_Data_info_v(Object graph_searched_Data_info_v) {
		this.graph_searched_Data_info_v = graph_searched_Data_info_v;
	}

	public void setUpdated_Data_info(Object updated_Data_info) {
		this.updated_Data_info = updated_Data_info;
	}

	public void setDeleted_Data_info(Object deleted_Data_info) {
		this.deleted_Data_info = deleted_Data_info;
	}

	public void setIndex_List(Object index_List) {
		this.index_List = index_List;
	}

	public void setErr_msg(String err_msg) {
		this.err_msg = err_msg;
	}

	public void setResponse_time(String response_time) {
		this.response_time = response_time;
	}

	public void setIndex_Mappings(Object index_Mappings) {
		this.index_Mappings = index_Mappings;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

}
