!function(){var e=YAHOO.util.Dom,t=YAHOO.util.Event,a=YAHOO.util.Selector,s=Alfresco.util.encodeHTML,i="org.alfresco.share.project.catalog.dashlet",r=i+".filter",l=i+".view";PREFERENCES_PROJECT__DASHLET_SIMPLEVIEW=i+".simpleView";var o=Alfresco.util.generateDomId(null,"favouriteProject"),n=Alfresco.util.generateDomId(null,"show-more-twister");beCPG.dashlet.ProjectDashlet=function(e){return beCPG.dashlet.ProjectDashlet.superclass.constructor.call(this,e)},YAHOO.extend(beCPG.dashlet.ProjectDashlet,Alfresco.component.SimpleDocList,{searchTerm:null,currentPage:1,queryExecutionId:null,onReady:function(){this.widgets.view=Alfresco.util.createYUIButton(this,"views",this.onViewChange,{type:"menu",menu:"views-menu",lazyloadmenu:!1}),this.widgets.filter=Alfresco.util.createYUIButton(this,"filters",this.onFilterChange,{type:"menu",menu:"filters-menu",lazyloadmenu:!1});var t=this.options.filter;t=Alfresco.util.arrayContains(this.options.validFilters,t)?t:this.options.validFilters[0],this.widgets.filter.set("label",this.msg("filter."+t)+" "+Alfresco.constants.MENU_ARROW_SYMBOL),this.widgets.filter.value=t;var i=this.options.view;i=Alfresco.util.arrayContains(this.options.validViews,i)?i:this.options.validViews[0],this.widgets.view.set("label",this.msg("view."+i)+" "+Alfresco.constants.MENU_ARROW_SYMBOL),this.widgets.view.value=i,this.widgets.simpleDetailed=new YAHOO.widget.ButtonGroup(this.id+"-simpleDetailed"),null!==this.widgets.simpleDetailed&&(this.widgets.simpleDetailed.check(this.options.simpleView?0:1),this.widgets.simpleDetailed.on("checkedButtonChange",this.onSimpleDetailed,this.widgets.simpleDetailed,this)),this.configureSearch(),e.removeClass(a.query(".toolbar div",this.id,!0),"hidden");var r=this;this.widgets.previewTooltip=new YAHOO.widget.Tooltip(this.id+"-previewTooltip",{width:"108px"}),this.widgets.previewTooltip.contextTriggerEvent.subscribe(function(e,t){var a=t[0],s=r.widgets.alfrescoDataTable.getData(a.id),i=Alfresco.constants.PROXY_URI+"api/node/"+s.nodeRef.replace(":/","")+"/content/thumbnails/doclib?c=queue&ph=true";this.cfg.setProperty("text",'<img src="'+i+'" />')}),this.widgets.metadataTooltip=new YAHOO.widget.Tooltip(this.id+"-metadataTooltip"),this.widgets.metadataTooltip.contextTriggerEvent.subscribe(function(e,t){var a=t[0],i=r.widgets.alfrescoDataTable.getRecord(a.id).getData(),l="<em>"+r.msg("label.site")+":</em> "+s(i.site.title)+"<br />";l+="<em>"+r.msg("label.path")+":</em> "+s(i.path),this.cfg.setProperty("text",l)}),this.widgets.dataSource=new YAHOO.util.DataSource(this.getWebscriptUrl(),{connMethodPost:!1,responseType:YAHOO.util.DataSource.TYPE_JSON,responseSchema:{resultsList:"items",metaFields:{startIndex:"startIndex",totalRecords:"totalRecords",queryExecutionId:"queryExecutionId"}}});var l=[{key:"thumbnail",sortable:!1,formatter:this.bind(this.renderCellThumbnail),width:16},{key:"detail",sortable:!1,formatter:this.bind(this.renderCellDetail)}];this.widgets.alfrescoDataTable=new YAHOO.widget.DataTable(this.id+"-documents",l,this.widgets.dataSource,{initialLoad:!1,dynamicData:!1,MSG_EMPTY:'<span class="wait">'+s(this.msg("message.loading"))+"</span>",MSG_ERROR:this.msg("message.error"),className:"alfresco-datatable simple-doclist",renderLoopSize:4,paginator:null}),this.widgets.alfrescoDataTable.getDataTable=function(){return this},this.widgets.alfrescoDataTable.getData=function(e){return this.getRecord(e).getData()},this.widgets.paginator=new YAHOO.widget.Paginator({containers:[this.id+"-paginator"],rowsPerPage:this.options.maxItems,initialPage:1,template:this.msg("pagination.template"),pageReportTemplate:this.msg("pagination.template.page-report"),previousPageLinkLabel:this.msg("pagination.previousPageLinkLabel"),nextPageLinkLabel:this.msg("pagination.nextPageLinkLabel")});var c=function(e,t){t.currentPage=e.page,t.reloadDataTable()};this.widgets.paginator.subscribe("changeRequest",c,this),this.widgets.paginator.render(),this.widgets.alfrescoDataTable.loadDataTable=function(e){r.widgets.dataSource.connMgr.setDefaultPostHeader(Alfresco.util.Ajax.JSON);var t=e;t||(t=scopeParameters),r.widgets.dataSource.sendRequest("&metadata="+encodeURIComponent(YAHOO.lang.JSON.stringify(t)),{success:function(e,t,a){r.widgets.alfrescoDataTable.onDataReturnReplaceRows(e,t,a),r.widgets.paginator&&(r.widgets.paginator.set("totalRecords",t.meta.totalRecords),r.widgets.paginator.setPage(t.meta.startIndex,!0)),r.queryExecutionId=t.meta.queryExecutionId},failure:r.widgets.alfrescoDataTable.onDataReturnReplaceRows,scope:r.widgets.alfrescoDataTable,argument:{}})};var p=this.widgets.alfrescoDataTable,d=p.doBeforeLoadData;p.doBeforeLoadData=function(e,t,a){return t.results&&0===t.results.length&&t.results.unshift({isInfo:!0,title:r.msg("empty.project.title"),description:r.msg("empty.project.description")}),d.apply(this,arguments)},p.subscribe("renderEvent",function(){this.widgets.previewTooltip.cfg.setProperty("context",this.previewTooltips)},this,!0);var h=function(e,t){var a=YAHOO.Bubbling.getOwnerByTagName(t[1].anchor,"div");return null!==a&&r.onFavourite.call(r,t[1].target.offsetParent,a),!0};YAHOO.Bubbling.addDefaultAction(o,h),YAHOO.Bubbling.addDefaultAction(n,this.onActionShowMore),this.initTaskHandlers(),this.reloadDataTable()},getWebscriptUrl:function(){return null!==Alfresco.constants.SITE&&Alfresco.constants.SITE.length>0?Alfresco.constants.PROXY_URI+"becpg/entity/datalists/data/node?itemType=pjt:project&site="+Alfresco.constants.SITE+"&pageSize="+this.options.maxItems+"&dataListName=projectList&container=documentLibrary&repo=false":Alfresco.constants.PROXY_URI+"becpg/entity/datalists/data/node?itemType=pjt:project&pageSize="+this.options.maxItems+"&dataListName=projectList&repo=true"},getParameters:function(){var e=this.widgets.view.value.indexOf("task")>-1,t="cm:name";e&&(t="InProgress"==this.widgets.filter.value?"pjt:tlEnd|true":"Planned"==this.widgets.filter.value?"pjt:tlStart|true":"pjt:tlEnd|false");var a="fts(";a+="All"!=this.widgets.filter.value?" +@pjt\\:"+(e?"tl":"project")+'State:"'+this.widgets.filter.value+'"':" +@pjt\\:"+(e?"tl":"project")+'State:"*"',null!==this.searchTerm&&this.searchTerm.length>0&&(a+="AND  +@"+(e?"pjt\\:tlTaskName":"cm\\:name")+":("+this.searchTerm+")"),a+=")";var s={project:["pjt_projectOverdue","pjt_projectHierarchy1","pjt_projectHierarchy2","pjt_projectPriority","pjt_completionPercent","bcpg_code","cm_name","pjt_taskList|pjt_tlTaskName|pjt_tlDuration|pjt_tlRealDuration|pjt_tlPrevTasks|pjt_tlState|pjt_completionPercent|pjt_tlStart|pjt_tlEnd|pjt_tlWorkflowInstance|fm_commentCount","pjt_deliverableList|pjt_dlDescription|pjt_dlContent|pjt_dlState|pjt_dlScriptExecOrder|fm_commentCount","pjt_projectManager","pjt_projectStartDate","pjt_projectCompletionDate","pjt_projectDueDate","pjt_projectState"],"project-simple":["pjt_projectOverdue","pjt_projectHierarchy1","pjt_projectHierarchy2","pjt_projectPriority","pjt_completionPercent","bcpg_code","cm_name","pjt_projectManager","pjt_projectStartDate","pjt_projectCompletionDate","pjt_projectDueDate","pjt_projectState"],task:["pjt_tlTaskName","pjt_tlDuration","pjt_tlRealDuration","pjt_tlResources","pjt_tlTaskLegend","pjt_tlState","pjt_completionPercent","pjt_tlStart","pjt_tlEnd","pjt_tlWorkflowInstance","fm_commentCount","pjt_project|cm_name|pjt_projectHierarchy1|pjt_projectHierarchy2|pjt_completionPercent|bcpg_code"]},i={fields:s[e?"task":"project"+(this.options.simpleView?"-simple":"")],page:this.currentPage,sort:t,queryExecutionId:this.queryExecutionId,filter:{filterId:this.widgets.view.value,filterOwner:"Alfresco.component.AllFilter",filterData:this.widgets.filter.value,filterParams:a}};return i},onFilterChange:function(e,t){var a=t[1];a&&(this.widgets.filter.set("label",a.cfg.getProperty("text")+" "+Alfresco.constants.MENU_ARROW_SYMBOL),this.widgets.filter.value=a.value,this.currentPage=1,this.services.preferences.set(r,this.widgets.filter.value),this._cleanSearchText(),this.reloadDataTable())},onViewChange:function(e,t){var a=t[1];a&&(this.widgets.view.set("label",a.cfg.getProperty("text")+" "+Alfresco.constants.MENU_ARROW_SYMBOL),this.widgets.view.value=a.value,this.currentPage=1,this.services.preferences.set(l,this.widgets.view.value),this._cleanSearchText(),this.reloadDataTable())},_cleanSearchText:function(){var e=this.getSearchText();e.indexOf("*")>0&&e.replace(/\*/g,"").length<3?this.searchTerm=null:this.searchTerm=e},onSimpleDetailed:function(e,a){this.options.simpleView=0===e.newValue.index,this.services.preferences.set(PREFERENCES_PROJECT__DASHLET_SIMPLEVIEW,this.options.simpleView),e&&t.preventDefault(e),this.reloadDataTable()},renderCellThumbnail:function(t,a,i,r){var l=40,o=a.getData(),n="";if(o.isInfo)l=52,n='<img class="icon32" src="'+Alfresco.constants.URL_RESCONTEXT+'components/images/help-docs-bw-32.png" />';else{var c=this.widgets.view.value.indexOf("task")>-1;c&&(o=o.itemData.dt_pjt_project),o.jsNode={},o.jsNode.type=o.itemType;var p=o.itemData.prop_cm_name.displayValue,d=o.itemData.prop_cm_name.value,h=(null!=o.site?o.site.shortName:null,o.itemType.substring(o.itemType.lastIndexOf(":")+1)),u=new Alfresco.util.NodeRef(o.nodeRef),g=beCPG.util.entityDocumentsURL(o.siteId,o.path,p);if(this.options.simpleView){var m=this.id+"-preview-"+a.getId();n='<span id="'+m+'" class="icon32"><a href="'+g+'"><img src="'+Alfresco.constants.URL_RESCONTEXT+"components/images/filetypes/"+Alfresco.util.getFileIcon(d,o.itemType)+'" alt="'+h+'" title="'+s(d)+'" /></a></span>',this.previewTooltips.push(m)}else l=100,n='<span class="thumbnail"><a href="'+g+'"><img src="'+Alfresco.constants.PROXY_URI+"api/node/"+u.uri+'/content/thumbnails/doclib?c=queue&ph=true" alt="'+h+'" title="'+s(d)+'" /></a></span>'}i.width=l,e.setStyle(t,"width",i.width+"px"),e.setStyle(t.parentNode,"width",i.width+"px"),t.innerHTML=n},renderCellDetail:function(e,t,a,s){var i=t.getData(),r="",l="";if(i.isInfo)r+='<div class="empty"><h3>'+i.title+"</h3>",r+="<span>"+i.description+"</span></div>";else{var o=this.widgets.view.value.indexOf("task")>-1,n=this.extractDates(i,null,o),c=n.due;if(l+=n.start?Alfresco.util.formatDate(n.start,"longDate"):scope.msg("label.none"),null!=n.end&&(c=n.end),l+=" - ",l+=n.start?Alfresco.util.formatDate(c,"longDate"):scope.msg("label.none"),o)this.options.simpleView?r+='<h3 class="filename simple-view">'+this.getTaskTitle(i,i.itemData.dt_pjt_project.nodeRef,null,!1)+"</h3>":(r+='<h3 class="filename">',r+=this.getTaskTitle(i,i.itemData.dt_pjt_project.nodeRef,null,!0),r+="</h3>"),r+='<div class="detail">',r+='<span class="project-date">[ '+l+" ]</span>",r+='<span class="project">',r+=this.getProjectTitle(i.itemData.dt_pjt_project),r+="</span>",this.options.simpleView||(r+=this.renderResourcesList(t)),r+="</div>";else{var p=null!=i.site?i.site.shortName:null;if(this.options.simpleView)r+='<h3 class="filename simple-view">'+this.getProjectTitle(i,!0,!1)+"</h3>",r+='<div class="detail">',r+='<span class="project-date">[ '+l+" ]</span>",r+='<span class="hierachy">',i.itemData.prop_pjt_projectHierarchy1&&null!=i.itemData.prop_pjt_projectHierarchy1.displayValue&&(r+=i.itemData.prop_pjt_projectHierarchy1.displayValue),i.itemData.prop_pjt_projectHierarchy2&&null!=i.itemData.prop_pjt_projectHierarchy2.displayValue&&(r+=" - "+i.itemData.prop_pjt_projectHierarchy2.displayValue),r+="</span>";else{r+='<h3 class="filename">'+this.getProjectTitle(i,!0,!0)+"</h3>",r+=this.renderProjectManager(t),r+='<div class="detail">',r+='<span class="project-date">[ '+l+" ]</span>",r+='<span class="hierachy">',i.itemData.prop_pjt_projectHierarchy1&&null!=i.itemData.prop_pjt_projectHierarchy1.displayValue&&(r+=i.itemData.prop_pjt_projectHierarchy1.displayValue),i.itemData.prop_pjt_projectHierarchy2&&null!=i.itemData.prop_pjt_projectHierarchy2.displayValue&&(r+=" - "+i.itemData.prop_pjt_projectHierarchy2.displayValue),r+="</span>",r+=this.renderTaskList(t),r+=this.renderDeliverableList(t),r+="</div>";var d=beCPG.util.entityURL(p,i.nodeRef,i.itemType),h=beCPG.util.entityDocumentsURL(p,i.path,i.itemData.prop_cm_name.value);r+='<div class="detail detail-social">',r+='<span class="item item-social">'+this.generateFavourite(this,t)+"</span>",r+='<span class="item item-social item-separator"><a class="view-documents" href="'+h+'"  title="'+this.msg("actions.entity.view-documents")+'" tabindex="0">'+this.msg("actions.entity.view-documents.short")+"</a></span>",r+='<span class="item item-social item-separator"><a class="view-characts" href="'+d+'" title="'+this.msg("actions.entity.view-tasks")+'" tabindex="0">'+this.msg("actions.entity.view-tasks.short")+"</a></span>",r+="</div>"}}}e.innerHTML=r},generateFavourite:function(e,t){var a="favourite.document.",s="";return s=t.getData("isFavourite")?'<a class="favourite-action '+o+' enabled" title="'+e.msg(a+"remove.tip")+'" tabindex="0"></a>':'<a class="favourite-action '+o+'" title="'+e.msg(a+"add.tip")+'" tabindex="0">'+e.msg(a+"add.label")+"</a>"},renderResourcesList:function(e){var t=e.getData("itemData").assoc_pjt_tlResources,a='<ul class="task-resources">';for(j in t){var s=t[j];a+="<li>",a+='<span class="avatar" title="'+s.metadata+'">',a+=Alfresco.Share.userAvatar(s.displayValue,32),a+="</span></li>"}return a+="</ul>"},renderProjectManager:function(e){var t=e.getData("itemData").assoc_pjt_projectManager,a="";return t&&t[0]&&(a+='<div class="project-manager avatar" title="'+t[0].metadata+'">',a+=Alfresco.Share.userAvatar(t[0].displayValue,16),a+="</div>"),a},renderTaskList:function(e){var t=e.getData("itemData").dt_pjt_taskList,a='<ul class="hidden">',s=0;for(j in t){var i=t[j];i.itemData.prop_pjt_tlState.value==this.widgets.filter.value&&(s++,a+="<li>"+this.getTaskTitle(i,e.getData().nodeRef)+"</li>")}return a+="</ul>",'<div ><a class="alfresco-twister alfresco-twister-closed '+n+'">'+this.msg("show.tasks")+"("+s+")</a>"+a+"</div>"},renderDeliverableList:function(e){var t=e.getData("itemData").dt_pjt_deliverableList,a=0,s='<ul class="hidden">';for(j in t){var i=t[j],r=i.itemData.prop_pjt_dlScriptExecOrder.value;i.itemData.prop_pjt_dlState.value!=this.widgets.filter.value||null!=r&&0!=r.length&&"None"!=r||(a++,s+="<li>"+this.getDeliverableTitle(i,e.getData().nodeRef)+"</li>")}return s+="</ul>",'<div ><a class="alfresco-twister alfresco-twister-closed '+n+'">'+this.msg("show.deliverables")+"("+a+")</a>"+s+"</div>"},onActionShowMore:function(t,a){var s=a[1].anchor;elPanel=e.getNextSibling(s),e.hasClass(s,"alfresco-twister-closed")?(e.removeClass(elPanel,"hidden"),e.replaceClass(s,"alfresco-twister-closed","alfresco-twister-open")):(e.addClass(elPanel,"hidden"),e.replaceClass(s,"alfresco-twister-open","alfresco-twister-closed"))},configureSearch:function(){this.widgets.searchBox=e.get(this.id+"-searchText"),this.defaultSearchText=this.msg("header.search.default"),t.addListener(this.widgets.searchBox,"focus",this.onSearchFocus,null,this),t.addListener(this.widgets.searchBox,"blur",this.onSearchBlur,null,this),this.setDefaultSearchText();var a=this;this.widgets.searchEnterListener=new YAHOO.util.KeyListener(this.widgets.searchBox,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:a.onSearchChange,scope:this,correctScope:!0},"keydown").enable(),this.widgets.searchMore=new YAHOO.widget.Button(this.id+"-search_more",{type:"menu",menu:this.id+"-searchmenu_more"})},onSearchFocus:function(){this.widgets.searchBox.value==this.defaultSearchText?(e.removeClass(this.widgets.searchBox,"faded"),this.widgets.searchBox.value=""):this.widgets.searchBox.select()},onSearchBlur:function(){var e=YAHOO.lang.trim(this.widgets.searchBox.value);0===e.length&&YAHOO.lang.later(100,this,this.setDefaultSearchText,[])},setDefaultSearchText:function(){e.addClass(this.widgets.searchBox,"faded"),this.widgets.searchBox.value=this.defaultSearchText},getSearchText:function(){var e=YAHOO.lang.trim(this.widgets.searchBox.value);return e!=this.defaultSearchText?e:""},onSearchChange:function(){this.currentPage=1,this._cleanSearchText(),this.reloadDataTable()},_showPanel:function(t,a,s){var i=this;Alfresco.util.Ajax.request({url:t,dataObj:{htmlid:a},successCallback:{fn:function(t){var a=document.createElement("div");a.innerHTML=t.serverResponse.responseText;var s=e.getFirstChild(a);this.widgets.panel=Alfresco.util.createYUIPanel(s,{draggable:!0,width:"50em"}),this.widgets.panel.subscribe("hide",function(){i.reloadDataTable()}),this.widgets.panel.show()},scope:this},failureMessage:"Could not load dialog template from '"+t+"'.",scope:this,execScripts:!0})}}),YAHOO.lang.augmentProto(beCPG.dashlet.ProjectDashlet,beCPG.component.ProjectCommons)}();