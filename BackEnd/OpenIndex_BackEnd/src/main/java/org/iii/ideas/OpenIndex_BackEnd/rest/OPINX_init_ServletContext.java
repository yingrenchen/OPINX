package org.iii.ideas.OpenIndex_BackEnd.rest;

import java.io.IOException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class OPINX_init_ServletContext implements ServletContextListener {
	public void contextInitialized(ServletContextEvent sce) {
		try {
			new OpenIndex_ini().OPINX_init();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void contextDestroyed(ServletContextEvent arg0) {

	}

}
