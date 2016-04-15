var widget, widgetsToRemove = [ "HEADER_SHARED_FILES", "HEADER_MY_FILES", "HEADER_TASKS", "HEADER_PEOPLE", "HEADER_SITE_WIKI", 
                                "HEADER_USER_STATUS", "HEADER_USER_MENU_SET_STATUS", 
                                "HEADER_SEARCH", "HEADER_BECPG", "HEADER_REPOSITORY", "HEADER_SITES_MENU", "HEADER_HOME",
                                "HEADER_SITE_MEMBERS", "HEADER_USER_MENU_HELP", "HEADER_USER_MENU_PASSWORD", "HEADER_USER_MENU_PROFILE",
                                "HEADER_SITE_DASHBOARD", "HEADER_SITE_CALENDAR", "HEADER_SITE_DISCUSSIONS-TOPICLIST",
                                "HEADER_PROJECT-LIST", "HEADER_DATA_LISTS", "HEADER_SITE_LINKS"
                                
], idx, max;

for (idx = 0, max = widgetsToRemove.length; idx < max; idx++) {
	widgetUtils.deleteObjectFromArray(model.jsonModel, "id", widgetsToRemove[idx]);
}

//HEADER_ADVANCED_SEARCH, HEADER_SEARCH, HEADER_SITE_MEMBERS
//						{"pageId":"project-list"}, 
// {"pageId":"data-lists"}, <!-- {"pageId":"blog-postlist"},--> {"pageId":"links"}

