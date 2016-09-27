// replace ForumSummary with sfdbForumSummary
for (i = 0; i < model.widgets.length; i++) { 
    if (model.widgets[i].id == 'ForumSummary') {
    	model.widgets.splice(i, 1);
    	var sfdbForumSummary = {
    			id : "sfdbForumSummary",
    			name : "Alfresco.dashlet.SfdbForumSummary",
    			options : {
    				siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site
    						: "",
    				searchRootNode : (config.scoped['RepositoryLibrary']['root-node']).value,
    				filters : model.filters,
    				regionId : args['region-id']
    			}
    		};    	
    	model.widgets.push(sfdbForumSummary);
    }
}
