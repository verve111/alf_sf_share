var g;(function(){var f=YAHOO.util.Dom;var e=Alfresco.util.encodeHTML;beCPG.component.ProjectList=function(m,l){this.view=l;beCPG.component.ProjectList.superclass.constructor.call(this,m);YAHOO.Bubbling.on("filterChanged",this.onFilterChanged,this);if(l=="resources"){this.setOptions({sortable:false,usePagination:true,useFilter:true,itemType:"pjt:taskList",list:"projectList",sortId:"TaskResources",extraParams:"resources",formWidth:"65em"})}else{this.setOptions({sortable:false,usePagination:true,useFilter:true,itemType:"pjt:project",list:"projectList",groupBy:"prop_pjt_projectHierarchy2",sortId:"ProjectList",groupFormater:function(o,n){var p="";if(n.getData("itemData")["prop_pjt_projectHierarchy1"]!=null&&n.getData("itemData")["prop_pjt_projectHierarchy1"].displayValue!=null){p+=n.getData("itemData")["prop_pjt_projectHierarchy1"].displayValue}if(p.length>0){p+=" - "}if(n.getData("itemData")["prop_pjt_projectHierarchy2"]!=null&&n.getData("itemData")["prop_pjt_projectHierarchy2"].displayValue!=null){p+=n.getData("itemData")["prop_pjt_projectHierarchy2"].displayValue}return p},hiddenColumns:["prop_pjt_projectHierarchy1","prop_pjt_projectHierarchy2","prop_bcpg_code","prop_pjt_projectCompletionDate","prop_pjt_projectDueDate","prop_pjt_projectState"],formWidth:"65em"})}return this};YAHOO.extend(beCPG.component.ProjectList,beCPG.module.EntityDataGrid);YAHOO.lang.augmentProto(beCPG.component.ProjectList,beCPG.component.ProjectCommons);YAHOO.lang.augmentObject(beCPG.component.ProjectList.prototype,{view:"dataTable",taskLegends:[],onReady:function c(){JSGantt.register(this);var l=Alfresco.constants.PROXY_URI+"becpg/project/info"+(this.options.siteId!=null&&this.options.siteId.length>0?"?site="+this.options.siteId:"");Alfresco.util.Ajax.request({url:l,successCallback:{fn:function(m){var q=m.json.legends;this.options.parentNodeRef=m.json.parentNodeRef;var o="";for(var n in q){var p={id:q[n].nodeRef,label:q[n].label,color:q[n].color.replace("#",""),nbProjects:q[n].nbProjects};this.taskLegends.push(p);o+='<span class="task-legend" style="background-color:#'+p.color+'" ></span><span><a href='+Alfresco.util.siteURL("project-list?view="+this.view+"#filter=filterform|%7B%22prop_pjt_projectState%22%3A%22InProgress%22%2C%22prop_pjt_projectLegends%22%3A%22"+encodeURIComponent(p.id)+"%22%7D")+">"+p.label+" ("+p.nbProjects+")</a></span>&nbsp;"}f.get(this.id+"-legend").innerHTML=o;if(this.view=="gantt"){this.options.pageSize=10;this.initGantt()}if(this.view=="resources"){this.initResources()}this.initDataTable()},scope:this},failureCallback:{fn:function(){},scope:this}})},initDataTable:function i(){beCPG.component.ProjectList.superclass.onReady.call(this);this.populateDataGrid();this.initTaskHandlers()},_buildDataGridParams:function h(n){var l=this.dataRequestFields;if(this.view=="resources"){l=["pjt_tlTaskName","pjt_tlIsMilestone","pjt_tlDuration","pjt_tlResources","pjt_tlTaskLegend","pjt_tlState","pjt_completionPercent","pjt_tlStart","pjt_tlEnd","pjt_tlWorkflowInstance","fm_commentCount","pjt_project|cm_name|pjt_projectHierarchy1|pjt_projectHierarchy2|pjt_completionPercent|bcpg_code"]}var m={fields:l,page:n&&n.page?n.page:this.currentPage,queryExecutionId:this.queryExecutionId,extraParams:this.options.extraParams};if(n&&n.filter){m.filter={filterOwner:n.filter.filterOwner,filterId:n.filter.filterId,filterData:n.filter.filterData,filterParams:this._createFilterURLParameters(n.filter,this.options.filterParameters)}}return m},initGantt:function b(){var m=function l(){var C=this.widgets.dataTable.getRecordSet();if(C.getLength()!=0){g=new JSGantt.GanttChart("g",f.get(this.id+"-gantt"),g!=null?g.getFormat():null);g.setDateInputFormat("mediumDate");g.setDateDisplayFormat("mediumDate");g.setCaptionType("Resource");for(var F=0;F<C.getLength();F++){var H=C.getRecord(F);var E=H.getData();var D=E.nodeRef;var J='<span class="'+this.getOverdueClass(E)+'">'+this.getProjectTitle(E)+"</span>";var r=H.getData("itemData")["assoc_pjt_projectManager"].displayValue;if(r&&r!=null&&r.length>0){r='<span class="resource-title">'+r+"</span>"}var n=H.getData("itemData")["prop_pjt_completionPercent"].value;var t=this.extractDates(E);g.AddTaskItem(new JSGantt.TaskItem(D,J,t.start,t.due,"FFBC00","",0,r,n,1,0,0));var s=t.start;var I=H.getData("itemData")["dt_pjt_taskList"];for(j in I){var G=I[j];var p=G.nodeRef;var y="";for(var A in G.itemData["assoc_pjt_tlPrevTasks"]){var v=G.itemData["assoc_pjt_tlPrevTasks"][A].value;if(y.length>0){y+=","}y+=v;if(this.cache[v]!=null&&this.cache[v].end!=null&&this.cache[v].end.getTime()>s.getTime()){s=this.cache[v].end}}var o=D;if(G.itemData["prop_bcpg_parentLevel"].value!=null){o=G.itemData["prop_bcpg_parentLevel"].value}var x=!G.itemData["prop_pjt_tlIsGroup"].value?0:1;var u=G.itemData["prop_pjt_tlIsMilestone"].value;var w=G.itemData["prop_pjt_completionPercent"].value;var q=G.itemData["assoc_pjt_tlResources"].length>0?('<span class="resource-title">'+G.itemData["assoc_pjt_tlResources"][0].displayValue+"</span>"):null;var B=this.cache[p];if(!B){B=this.extractDates(G,s,true);this.cache[p]=B}g.AddTaskItem(new JSGantt.TaskItem(p,this.getTaskTitle(G,E.nodeRef,B.start),B.start,B.end,this.getTaskColor(G),null,u?1:0,q,w,x,o,1,y))}}g.Draw();g.DrawDependencies()}else{Alfresco.util.populateHTML([this.id+"-gantt",'<div class="yui-dt-liner">'+this.msg("message.empty")+"</div>"])}};this.cache=[];this.extraAfterDataGridUpdate.push(m)},initResources:function d(){var m=function l(){var y=this.widgets.dataTable.getRecordSet();if(y.getLength()!=0){g=new JSGantt.GanttChart("g",f.get(this.id+"-gantt"),g!=null?g.getFormat():null);g.setDateInputFormat("shortDate");g.setDateDisplayFormat("shortDate");g.setCaptionType("Resource");var o=new Date();var q=[];for(var s=0;s<y.getLength();s++){var A=y.getRecord(s);var p=A.getData();var v=p.nodeRef;var x=p.itemData["dt_pjt_project"]["itemData"]["prop_cm_name"].displayValue;var r=p.itemData["prop_pjt_tlIsMilestone"].value;var n=p.itemData["prop_pjt_completionPercent"].value;var z=p.itemData["assoc_pjt_tlResources"].length>0?p.itemData["assoc_pjt_tlResources"][0].value:null;var w=p.itemData["assoc_pjt_tlResources"].length>0?('<span class="resource-title">'+p.itemData["assoc_pjt_tlResources"][0].displayValue+"</span>"):null;if(!q[z]){g.AddTaskItem(new JSGantt.TaskItem(z,w,null,null,"FFBC00","",0,"",0,1,0,1))}q[z]=true;var u=this.cache[v];if(!u){u=this.extractDates(p,o,true);this.cache[v]=u}p.itemData["prop_pjt_tlTaskName"].displayValue=p.itemData["dt_pjt_project"]["itemData"]["prop_bcpg_code"].displayValue+" - "+p.itemData["prop_pjt_tlTaskName"].displayValue;var t=this.getTaskTitle(p,null,u.start);g.AddTaskItem(new JSGantt.TaskItem(v,t,u.start,u.end,this.getTaskColor(p),null,r?1:0,x,n,0,z,1))}g.Draw();g.DrawDependencies()}else{Alfresco.util.populateHTML([this.id+"-gantt",'<div class="yui-dt-liner">'+this.msg("message.empty")+"</div>"])}};this.cache=[];this.extraAfterDataGridUpdate.push(m)},onFilterChanged:function a(m,l){var n=Alfresco.util.cleanBubblingObject(l[1]);if(n.filterId=="filterform"){f.get(this.id+"-filterTitle").innerHTML=e(this.msg("filter."+n.filterId))}else{if(n.filterId=="tag"){f.get(this.id+"-filterTitle").innerHTML=e(this.msg("filter."+n.filterId,n.filterData))}else{f.get(this.id+"-filterTitle").innerHTML=e(this.msg("filter."+n.filterId+(n.filterData?"."+n.filterData:""),n.filterData))}}},onDataItemCreated:function k(o,n){var r=n[1];if(r&&(r.nodeRef!==null)){var p=new Alfresco.util.NodeRef(r.nodeRef),m=this.options.itemUrl+p.uri+((this.options.entityNodeRef!=null&&this.options.entityNodeRef.length>0)?"?entityNodeRef="+this.options.entityNodeRef+"&":"?")+"itemType="+encodeURIComponent(this.options.itemType!=null?this.options.itemType:this.datalistMeta.itemType)+"&dataListName="+encodeURIComponent(this.datalistMeta.name!=null?this.datalistMeta.name:this.options.list);Alfresco.util.Ajax.jsonPost({url:m,dataObj:this._buildDataGridParams(),successCallback:{fn:function l(s){if(s.json&&(s.json.item!==null)){var t=s.json.item;YAHOO.Bubbling.fire("changeFilter",filter={filterOwner:"Alfresco.component.AllFilter",filterId:"projects",filterData:t.itemData["prop_pjt_projectState"].value})}},scope:this},failureCallback:{fn:function q(s){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.create.refresh.failure")})},scope:this}})}}},true)})();