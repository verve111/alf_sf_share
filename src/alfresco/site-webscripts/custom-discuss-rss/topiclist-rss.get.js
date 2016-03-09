if (model.site) {
	var siteId = model.site;
	if (siteId) {
		var json = remote.call("/api/sites/" + siteId);
		if (json.status == 200) {
			var obj = eval('(' + json + ')');
			if (obj) {
				siteTitle = (obj.title.length != 0) ? obj.title : obj.shortName;
			    model.sitename = siteTitle;
			}
		}
	}
}
