<%@ page import="org.alfresco.web.site.*" %>
<%@ page import="org.springframework.extensions.surf.*" %>
<%@ page import="org.springframework.extensions.surf.site.*" %>
<%@ page import="org.springframework.extensions.surf.util.*" %>
<%@ page import="java.util.*" %>

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="com.sfdb.evaluators.IsDocLibOnly"%>

<%
   // retrieve user name from the session
   String userid = (String)session.getAttribute(SlingshotUserFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
   
   // test user dashboard page exists?
   RequestContext context = (RequestContext)request.getAttribute(RequestContext.ATTR_REQUEST_CONTEXT);
   if (!context.getObjectService().hasPage("user/" + userid + "/dashboard"))
   {
      // no user dashboard page found! create initial dashboard for this user...
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("userid", userid);
      
      if (!(context.getUser() !=null && context.getUser().getCapabilities().containsKey("isbeCPGExternalUser")
				&& Boolean.TRUE.equals(context.getUser().getCapabilities().get("isbeCPGExternalUser")))) {
          FrameworkUtil.getServiceRegistry().getPresetsManager().constructPreset("user-dashboard", tokens);
	   } else {
		  FrameworkUtil.getServiceRegistry().getPresetsManager().constructPreset("external-dashboard", tokens);
	   }
   }
   
   ApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext()); 
   IsDocLibOnly evaluator = (IsDocLibOnly) appContext.getBean("evaluator.module.IsDocLibOnly");
   Map<String, String> map = new HashMap<String, String>();
   map.put("getsiteid", "");
   boolean isDocLibOnly = evaluator.evaluate(context, map);
   
   // redirect to site or user dashboard as appropriate
   String siteName = request.getParameter("site");
   if (isDocLibOnly && map.get("getsiteid") != null && !map.get("getsiteid").isEmpty()) 
   {
	   response.sendRedirect(request.getContextPath() + "/page/site/" + map.get("getsiteid") + "/documentlibrary");
   } else  if (siteName == null || siteName.length() == 0) 
   {
		// forward to user specific dashboard page
		response.sendRedirect(request.getContextPath() + "/page/user/" + URLEncoder.encode(userid) + "/dashboard");
   }
   else
   {
      // forward to site specific dashboard page
      response.sendRedirect(request.getContextPath() + "/page/site/" + URLEncoder.encode(siteName) + "/dashboard");
   }
%>