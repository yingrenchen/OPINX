package org.iii.ideas.OpenIndex_BackEnd.rest;

public class Common_Response {
	protected Boolean status;
	protected String err_msg = "";

	Common_Response() {
		this.status = true;
		this.err_msg = "";
	}

	public boolean getStatus() {
		return status;
	}

	public String getErr_msg() {
		return err_msg;
	}

	public void setErr_msg(String err_msg) {
		this.err_msg = err_msg;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

}
