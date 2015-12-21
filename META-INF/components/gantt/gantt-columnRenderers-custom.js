(function()
{

    if (beCPG.module.GanttViewRendererHelper)
    {

		YAHOO.Bubbling.fire("registerGanttRenderer",  {
			typeName : "pjt:deliverableList",
			ganttInitialiser : function(callBack) {
				var fnDrawGantt = function PL_onReady_fnDrawGantt()
				{
					var recordSet = this.widgets.dataTable.getRecordSet();
					if (recordSet.getLength() != 0)
					{
						g = new JSGantt.GanttChart('g', Dom.get(this.id + "-gantt"), g != null ? g.getFormat() : 'day');
						g.setDateInputFormat("shortDate");
						g.setDateDisplayFormat("shortDate");
						g.setCaptionType('Caption'); 
						g.setShowRes(0); // Hides the resources
						g.setShowDur(0); // Hides the duration
						g.setShowComp(0); // Hides the progress
						var start = new Date();
						for (var i = 0; i < recordSet.getLength(); i++)
						{
							var oRecord = recordSet.getRecord(i);
							var deliverable = oRecord.getData();
							var taskId = deliverable.nodeRef;
							var precTaskIds = "";
							var pParent = 0;
							var pGroup = 0;
							var tlIsMilestone = true;
							var tlPercent = 0;
							var start = new Date();
							var end = new Date();
							var color = "006600";
							if (oRecord.getData("color"))
							{
								color = oRecord.getData("color").replace('#', '');
							}

							var taskOwner = null;

							g.AddTaskItem(new JSGantt.TaskItem(taskId, this.getDeliverableTitle(deliverable,
									this.options.entityNodeRef), start, end, color, null, tlIsMilestone ? 1 : 0, taskOwner,
									tlPercent, pGroup, pParent, 1, precTaskIds));
						}

						this.refreshView();

					}
					else
					{
						Alfresco.util.populateHTML([ this.id + "-gantt",
								"<div class=\"yui-dt-liner\">" + this.msg("message.empty") + "</div>" ]);
					}
				};

				this.extraAfterDataGridUpdate.push(fnDrawGantt);
				this.initTaskHandlers();
				callBack.call(this);
			}
		});						
        


    }
})();