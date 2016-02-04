var feedArgs = url.templateArgs["feedArgs"];
var regexpGroups = /\/site\/([\w|-]+)\/documentLibrary\//.exec(feedArgs);
if (regexpGroups && model.filterData) {
	var siteId = regexpGroups[1];
	if (siteId) {
		var json = remote.call("/api/sites/" + siteId);
		if (json.status == 200) {
			var obj = eval('(' + json + ')');
			if (obj) {
				siteTitle = (obj.title.length != 0) ? obj.title : obj.shortName;
			    model.sitename = siteTitle;
			    
				var filterData = model.filterData;
				if (filterData) {
					var foldername = filterData.substring(filterData.lastIndexOf("/") + 1, filterData.length);
					if (foldername && foldername.length > 0) {
						model.foldername = foldername;
					}
				}				
			}
		}
	}
}


