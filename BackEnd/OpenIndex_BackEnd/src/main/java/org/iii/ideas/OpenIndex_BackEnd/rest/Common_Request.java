package org.iii.ideas.OpenIndex_BackEnd.rest;

public class Common_Request {
	private String account = "";
	private String password = "";

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAccount() {
		return account;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return password;
	}
}
