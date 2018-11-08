package iii.org.OPINX.pullDataToES;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.xpack.client.PreBuiltXPackTransportClient;
import static org.elasticsearch.common.xcontent.XContentFactory.*;

/**
 * Hello world!
 *
 */
public class App {
	static Map<String, String> insert_json = new HashMap<String, String>();
	static Map<String, Object> outer_insert_json = new HashMap<String, Object>();

	public static void main(String[] args) {
		System.out.println("Hello World!");

		Connection conn = null;
		try {
			// 連接MySQL
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("連接成功MySQLToJava");
			// 建立讀取資料庫 (test 為資料庫名稱; user 為MySQL使用者名稱; passwrod 為MySQL使用者密碼)
			String datasource = "jdbc:mysql://140.92.143.180/OPINX?user=root&password=openstack";
			// 以下的資料庫操作請參考本blog中: "使用 Java 連結與存取 access 資料庫 (JDBC)"
			conn = DriverManager.getConnection(datasource);
			System.out.println("連接成功MySQL");
			Statement st = conn.createStatement();
			// 撈出剛剛新增的資料
			int Data_count = 0;
			st.execute("SELECT count(*) FROM news_data");
			ResultSet rs = st.getResultSet();
			while (rs.next()) {
				System.out.println("DATA count:" + rs.getInt(1));
				Data_count = rs.getInt(1);
			}
			rs.close();
			st.close();
			conn.close();

			String init_id = "0";
			// System.out.println("k=" + Data_count / 100000);

			// Statement st1 = conn.createStatement();

			for (int k = 0; k < (Data_count / 100000) + 1; k++) {
				Client client = es_ConnOpen();
				BulkRequestBuilder bulkRequest = client.prepareBulk();

				conn = DriverManager.getConnection(datasource);
				System.out.println("連接成功MySQL");
				Statement st1 = conn.createStatement();
				st1.execute(
						"SELECT a.id,a.title,a.content,a.time,(SELECT GROUP_CONCAT(b.tag) FROM news_tag b WHERE a.id = b.news_id) AS tag FROM news_data a WHERE a.id >"
								+ init_id + " ORDER BY a.id limit 100000");
				System.out.println("===========start===========");
				ResultSet rs1 = st1.getResultSet();
				System.out.println(rs1.getFetchSize());

				// int i = 0;
				while (rs1.next()) {
					System.out.println("id:" + rs1.getString(1));
					bulkRequest.add(client.prepareIndex("f_taiwannews", "f_taiwannews", rs1.getString(1))
							.setSource(jsonBuilder().startObject().field("id", rs1.getString(1))
									.field("title", rs1.getString(2)).field("content", rs1.getString(3))
									.field("tag", rs1.getString(5))
									.field("timestamp",
											new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(rs1.getTimestamp(4)))
									.endObject()));
//					System.out.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(rs1.getTimestamp(4)));
//					System.out.println(rs1.getString(2));
//					System.out.println(rs1.getString(3));
//					System.out.println(rs1.getString(5));
					// i++;
					// System.out.println("i:" + i);
					init_id = rs1.getString(1);
				}
				BulkResponse bulkResponse = bulkRequest.get();
				System.out.println(bulkResponse.status());

				rs1.close();
				st1.close();
				conn.close();
				client.close();
				System.out.println("===============done1=============:");

			}

			// st1.clearBatch();

			System.out.println("===============done2=============:");

		} catch (Exception e) {
			System.out.println(e.getMessage());
			e.printStackTrace();
//			System.out.println("?");
		}

	}

	@SuppressWarnings({ "resource", "unchecked" })
	public static Client es_ConnOpen() {

		Client client = null;
		Settings settings = Settings.builder().put("cluster.name", "my-application").put("client.transport.sniff", true)
				.put("xpack.security.user", "elastic:changeme").build();// mycluster1;APlus-cluster
		try {
			System.out.println("????????");
			client = new PreBuiltXPackTransportClient(settings)
					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("140.92.143.180"), 9300));// 140.92.143.99
			System.out.println("?");
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return client;
	}
}
