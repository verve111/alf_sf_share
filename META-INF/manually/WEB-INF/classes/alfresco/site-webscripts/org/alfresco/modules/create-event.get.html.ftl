<#assign el=args.htmlid?html>



<div id="${el}-dialog" class="create-event">
<#if (!edit)>
   <div class="hd">${msg("title.addEvent")}</div>
<#else>
    <div class="hd">${msg("title.editEvent")}</div>
</#if>
   <div class="bd">

      <form id="${el}-form" action="${url.context}/proxy/alfresco/calendar/create" method="POST">
         <input type="hidden" name="site" value="${(args.site!"")?html}" />
         <input type="hidden" name="page" value="calendar" />
         <input type="hidden" id="${el}-startAt" name="startAt" value="${event.from!""}" />
         <input type="hidden" id="${el}-endAt" name="endAt" value="${event.to!""}" />
         <#if config.script.config.enableDocFolder="false">
            <input type="hidden" name="docfolder" value="${event.docfolder}" />
         </#if>
         <div class="yui-g">
            <h2>${msg("section.details")}</h2>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-title">${msg("label.what")}:</label></div>
            <div class="yui-u"><input id="${el}-title" type="text" name="what" value="${(event.what!"")?html}" tabindex="1" class="wide"/> * </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-location">${msg("label.where")}:</label></div>
            <div class="yui-u"><input id="${el}-location" type="text" name="where" value="${(event.location!"")?html}" tabindex="2" class="wide"/></div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-description">${msg("label.description")}:</label></div>
            <div class="yui-u"><textarea id="${el}-description" name="desc" rows="3" cols="20" class="wide" tabindex="3">${(event.description!"")?html}</textarea></div>
         </div>
         <div class="yui-g">
            <h2>${msg("section.time")}</h2>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-allday">${msg("label.allday")}:</label></div>
            <#if (edit && event.allday?? && event.allday=='true')>
            <div class="yui-u"><input id="${el}-allday" type="checkbox" name="allday" tabindex="4" checked="checked"/></div>
            <#else>
            <div class="yui-u"><input id="${el}-allday" type="checkbox" name="allday" tabindex="5"/></div>
            </#if>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="fd">${msg("label.startdate")}:</label></div>
            <div class="yui-u overflow">
               <span id="${el}-startdate">
                  <input id="fd" type="text" name="fromdate" readonly="readonly" tabindex="6"
                         value="<#if event.startAt??>${event.startAt.iso8601}</#if>" />
               </span>
               <span id="${el}-starttime" class="eventTime">
                  <label for="${el}-start">${msg("label.at")}</label>
                  <input id="${el}-start" name="start" value="<#if !(event.startAt??)>${config.script.config.defaultStart}</#if>" type="text" size="10" tabindex="7" />
               </span>
            </div>
         </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="td">${msg("label.enddate")}:</label></div>
            <div class="yui-u overflow">
               <span id="${el}-enddate">
                  <input id="td" type="text" name="todate" readonly="readonly" tabindex="8"
                         value="<#if event.endAt??>${event.endAt.iso8601}</#if>" />
               </span>
               <span id="${el}-endtime" class="eventTime">
                  <label for="${el}-end">${msg("label.at")}</label>
                  <input id="${el}-end" name="end" value="<#if !(event.endAt??)>${config.script.config.defaultEnd}</#if>" type="text" size="10" tabindex="9" />
               </span>
            </div>
         </div>
         <!-- tags -->
         <div class="yui-gd">
            <div class="yui-u first">${msg("label.tags")}:</div>
            <div class="yui-u overflow">
              <#import "/org/alfresco/modules/taglibrary/taglibrary.lib.ftl" as taglibraryLib/>
               <div class="taglibrary">
                  <div class="top_taglist tags_box">
                     <ul id="${el}-current-tags">
                     </ul>
                  </div>
                  <#assign tags = ''>
                  <#if event.tags?? && event.tags?size &gt; 0>
                     <#list event.tags as tag>
                        <#assign tags = tags + tag>
                        <#if tag_has_next><#assign tags = tags + ','></#if>
                     </#list>
                  </#if>
                  <input tabindex="10" type="text" size="30" class="rel_left suppress-validation" id="${el}-tag-input-field" value="${tags}"/>
                  <input tabindex="11" type="button" id="${el}-add-tag-button" value="${msg("button.add")}" />
                  <div class="bottom_taglist tags_box">
                     <a tabindex="12" href="#" id="${el}-load-popular-tags-link">${msg("taglibrary.populartagslink")}</a>
                     <ul id="${el}-popular-tags">
                     </ul>
                  </div>
               </div>
               <!-- end tags -->                    
            </div>
         </div>
		 
		 <!-- SFDB email cron -->
         <div class="yui-g">
            <h2>Email Notification</h2>
         </div>		 
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-cron-isactive">Active:</label></div>
            <#if (event.isactive?? && event.isactive == "true")>
            <div class="yui-u"><input id="${el}-cron-isactive" type="checkbox" name="isactive" tabindex="4" checked="checked"/></div>
            <#else>
            <div class="yui-u"><input id="${el}-cron-isactive" type="checkbox" name="isactive" tabindex="5"/></div>
            </#if>
         </div>		
         <!-- Recipients -->		 
         <div class="yui-gd">
            <div class="yui-u first">Recipients:</div>
            <div class="yui-u">
               <ul id="${el}-recipients" class="recipients suppress-validation"></ul>
               <button id="${el}-selectRecipients-button" tabindex="6">${msg("button.select")}</button>
            </div>
         </div>
         <!-- Authority Picker -->
         <div class="hidden">
            <div id="${el}-authority-picker" class="recipients-form authority-picker">
               <div class="hd">Recipients</div>
               <div class="bd">
                  <div id="${el}-authority-finder" class="authority-finder"></div>
               </div>
            </div>
         </div>		 
		 <!-- Cron Picker -->
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-cron">Notification date:</label></div>
            <div class="yui-u">
			   <input id="${el}-cron" type="hidden" name="cron" readonly value="${event.cronExpr!"0 0 0 ? * 2"}"/>
               <span id="${el}-cron-span">
               </span>			
			</div>
         </div>		 
			<script type="text/javascript">//<![CDATA[
				YAHOO.util.Event.onContentReady('${el}-authority-finder', function () {
					var picker = new Alfresco.module.UserPicker("${el}", {recipients: ${event.recipients!"null"}});
					var buttonId = "${el}-selectRecipients-button";
					YAHOO.util.Event.on(buttonId, 'click', function(e) {
						picker.onSelectRecipientsClick(e);
						
					    //e.cancelBubble is supported by IE - this will kill the bubbling process.
					    e.cancelBubble = true;
					    e.returnValue = false;

					    //e.stopPropagation for other browsers
					    if ( e.stopPropagation ) e.stopPropagation();
					    if ( e.preventDefault ) e.preventDefault();
					 });
				}, this);				
			
				YAHOO.util.Event.onContentReady("${el}-cron-span", function () {
					$('#${el}-cron-span').cron({
						initial: "${event.cronExpr!"0 0 0 ? * 2"}",
						enableSeconds: true,
						onChange: function() {
							$('#${el}-cron').val($(this).cron("value"));
						}
					});
				}, this);
			//]]></script> 	

			
		 
         <#if config.script.config.enableDocFolder="true">
            <div class="yui-g">
               <h2>${msg("section.documents")}</h2>
            </div>
            <div class="yui-gd">
               <div class="yui-u first"><label for="${el}-docfolder">${msg("label.docfolder")}:</label></div>
               <div class="yui-u" >
                  <input tabindex="13" type="text" id="${el}-docfolder" name="docfolder" value="${event.docfolder?html}" class="docfolder-input" readonly="true" />
                  <input tabindex="14" type="button" id="${el}-browse-button" value="${msg("label.browse")}" />
               </div>
            </div>
         </#if>	 
         <div class="bdft">
            <input type="submit" id="${el}-ok" value="${msg("button.ok")}" tabindex="15" />
            <input type="submit" id="${el}-cancel" value="${msg("button.cancel")}" tabindex="16" />
         </div>
        <#if edit && event.isoutlook?? && event.isoutlook == 'false'>
        <div name="edit-available" id="${el}-edit-available" />
        </#if>
      </form>

   </div>
</div>
<script type="text/javascript">//<![CDATA[
   Alfresco.util.ComponentManager.findFirst("Alfresco.CalendarView").setOptions(
   {
      defaultStartTime: "${config.script.config.defaultStart}",
      defaultEndTime: "${config.script.config.defaultEnd}"
   }
   )
//]]></script>
