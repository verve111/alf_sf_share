package com.sfdb.evaluators;

import java.util.Map;

import org.json.JSONException;
import org.springframework.extensions.surf.RequestContext;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.exception.ConnectorServiceException;
import org.springframework.extensions.surf.extensibility.impl.DefaultSubComponentEvaluator;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.Response;
import org.springframework.extensions.webscripts.connector.User;

public class IsDocLibOnly extends DefaultSubComponentEvaluator {

	@Override
	public boolean evaluate(RequestContext context, Map<String, String> params) {
		boolean result = false;
		User user = context.getUser();
		final String prop = "cm:isDocLib";
		if (user.getProperty(prop) == null) {
			try {
				final Connector conn = context.getServiceRegistry().getConnectorService().getConnector("alfresco",
						user.getId(), ServletUtil.getSession());
				boolean getSiteId = params.get("getsiteid") != null;
				final Response response = conn.call("/is_user_doclib_only?userid=" + user.getId()
						+ (getSiteId ? "&getsiteid" : ""));
				if (response.getStatus().getCode() == Status.STATUS_OK) {
					try {
						org.json.JSONObject json = new org.json.JSONObject(response.getResponse());
						result = json.get("result").equals(Boolean.TRUE);
						if (getSiteId && json.has("siteid")) {
							params.put("getsiteid", (String) json.get("siteid"));
						}
					} catch (JSONException je) {
						je.printStackTrace();
					}
				} else {
					System.out.println("Call failed, code:" + response.getStatus().getCode());
				}
			} catch (ConnectorServiceException cse) {
				cse.printStackTrace();
			}
		}
		return result;
	}

}
