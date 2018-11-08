package org.iii.ideas.OpenIndex_BackEnd.rest;

public class ES_Request {
	private String index_Name = "";
	private String id_Num = "";
	private String content_text = "";
	private String title = "";
	private String tag = "";
	private String timeStamp = "";

	public void setTag(String tag) {
		this.tag = tag;
	}

	public String getTag() {
		return tag;
	}

	public void setIndex_Name(String index_Name) {
		this.index_Name = index_Name;
	}

	public String getIndex_Name() {
		return index_Name;
	}

	public void setId_Num(String id_Num) {
		this.id_Num = id_Num;
	}

	public String getId_Num() {
		return id_Num;
	}

	public void setContent_text(String content_text) {
		this.content_text = content_text;
	}

	public String getContent_text() {
		return content_text;
	}

	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}

	public String getTimeStamp() {
		return timeStamp;
	}

	public void setTitle(String title) {
		// TODO Auto-generated method stub
		this.title = title;
	}

	public String getTitle() {
		// TODO Auto-generated method stub
		return title;
	}

}
