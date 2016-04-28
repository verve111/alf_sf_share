var widget, widgetsToRemove = [ "HEADER_SHARED_FILES", "HEADER_MY_FILES", "HEADER_TASKS", "HEADER_PEOPLE", "HEADER_SITE_WIKI", 
                                "HEADER_USER_STATUS", "HEADER_USER_MENU_SET_STATUS", 
                                "HEADER_SEARCH", "HEADER_BECPG", "HEADER_REPOSITORY", "HEADER_SITES_MENU", "HEADER_HOME",
                                "HEADER_SITE_MEMBERS", "HEADER_USER_MENU_HELP", "HEADER_USER_MENU_PASSWORD", "HEADER_USER_MENU_PROFILE",
                                "HEADER_SITE_DASHBOARD", "HEADER_SITE_CALENDAR", "HEADER_SITE_DISCUSSIONS-TOPICLIST",
                                "HEADER_SITE_PROJECT-LIST", "HEADER_SITE_DATA-LISTS", "HEADER_SITE_LINKS", "HEADER_SITE_MORE_PAGES"
                                
], idx, max;

var isDocLib = false;

if (user) {
	var userDetail = {};
    var response = remote.call("/api/people/" + encodeURIComponent(user.name));
    if (response.status == 200) {
       userDetail = JSON.parse(response);
    }
	isDocLib = userDetail.isDocLib;    
	if (isDocLib) {
		for (idx = 0, max = widgetsToRemove.length; idx < max; idx++) {
			findAndRemoveIn(model.jsonModel.widgets, null, null, widgetsToRemove[idx]);
		}
	}
}

function findAndRemoveIn(obj, arrContext, arrIdx, id) {
	var idx, max, key;
	if (obj !== undefined && obj !== null) {
		if (Object.prototype.toString.apply(obj) === "[object Object]") {
			if (obj.hasOwnProperty("id") && obj.id === id) {
				if (arrContext !== null && arrIdx !== null) {
					arrContext.splice(arrIdx, 1);
				}
				else {
					logger.debug("Unexpected match outside of array structure: "
									+ jsonUtils.toJSONString(obj));
				}
			} else {
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						findAndRemoveIn(obj[key], null, null, id);
					}

				}
			}
		} else if (Object.prototype.toString.apply(obj) === "[object Array]") {
			for (idx = 0, max = obj.length; idx < max; idx++) {
				findAndRemoveIn(obj[idx], obj, idx, id);
			}
		}
	}
}

// add sfdb menu 
createSfdbSiteMenu();

function createSfdbSiteMenu() {
	var sfdbSiteMenu = widgetUtils.findObject(model.jsonModel, "id",
			"HEADER_SFDBSITE");
	if (sfdbSiteMenu == null && !isDocLib) {
		sfdbSiteMenu = {
			id : "HEADER_SFDBSITE",
			name : "alfresco/menus/AlfMenuBarItem",
			config : {
				id : "HEADER_SFDBSITE",
				label : "SFDB Site",
				targetUrl : "site/sfdb/dashboard",
				widgets : []
			}
		};
		var menuBar = widgetUtils.findObject(model.jsonModel, "id",
				"HEADER_USER_MENU_BAR");
		if (menuBar != null) {
			menuBar.config.widgets.unshift(sfdbSiteMenu);
		}
	}
}

