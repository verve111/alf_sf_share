(function(){if(beCPG.module.GanttViewRendererHelper){YAHOO.Bubbling.fire("registerGanttRenderer",{typeName:"pjt:taskList",ganttInitialiser:function(b){var a=Alfresco.constants.PROXY_URI+"becpg/project/info"+(this.options.siteId!=null&&this.options.siteId.length>0?"?site="+this.options.siteId:"");Alfresco.util.Ajax.request({url:a,successCallback:{fn:function(c){var j=c.json.legends,f="";for(var e in j){var h={id:j[e].nodeRef,label:j[e].label,color:j[e].color.replace("#","")};this.taskLegends.push(h);f+='<span class="task-legend" style="background-color:#'+h.color+'" ></span><span>'+h.label+"</span>&nbsp;"}Dom.get(this.id+"-legend").innerHTML=f;var k=function d(){var v=this.widgets.dataTable.getRecordSet();if(v.getLength()!=0){g=new JSGantt.GanttChart("g",Dom.get(this.id+"-gantt"),g!=null?g.getFormat():null);g.setDateInputFormat("mediumDate");g.setDateDisplayFormat("mediumDate");g.setCaptionType("Resource");var m=new Date();for(var p=0;p<v.getLength();p++){var y=v.getRecord(p);var n=y.getData();var s=n.nodeRef;var A="";var u=0;if(n.itemData["prop_bcpg_parentLevel"].value!=null){u=n.itemData["prop_bcpg_parentLevel"].value}var x=!n.itemData["prop_pjt_tlIsGroup"].value?0:1;for(var t in n.itemData["assoc_pjt_tlPrevTasks"]){var r=n.itemData["assoc_pjt_tlPrevTasks"][t].value;if(A.length>0){A+=","}A+=r;if(this.cache[r]!=null&&this.cache[r].end!=null&&this.cache[r].end.getTime()>m.getTime()){m=this.cache[r].end}}var o=n.itemData["prop_pjt_tlIsMilestone"].value;var l=n.itemData["prop_pjt_completionPercent"].value;var w=n.itemData["assoc_pjt_tlResources"].length>0?('<span class="resource-title">'+n.itemData["assoc_pjt_tlResources"][0].displayValue+"</span>"):null;var q=this.cache[s];if(!q){q=this.extractDates(n,m,true);this.cache[s]=q}g.AddTaskItem(new JSGantt.TaskItem(s,this.getTaskTitle(n,this.options.entityNodeRef,q.start),q.start,q.end,this.getTaskColor(n),null,o?1:0,w,l,x,u,1,A,null,n.color))}this.refreshView()}else{Alfresco.util.populateHTML([this.id+"-gantt",'<div class="yui-dt-liner">'+this.msg("message.empty")+"</div>"])}};this.extraAfterDataGridUpdate.push(k);this.initTaskHandlers();b.call(this)},scope:this}})}})}})();