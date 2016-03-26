<html>
<!-- Path: "/Data Dictionary/Email Templates/Notify Email Templates/sfdb_calendar_reminder.html.ftl" -->
   <head>
      <style type="text/css"><!--
      body
      {
         font-family: Arial, sans-serif;
         font-size: 14px;
         color: #4c4c4c;
      }
      
      a, a:visited
      {
         color: #0072cf;
      }
      --></style>
   </head>
   
   <body bgcolor="#dddddd">
      <table width="100%" cellpadding="20" cellspacing="0" border="0" bgcolor="#dddddd">
         <tr>
            <td width="100%" align="center">
               <table width="70%" cellpadding="0" cellspacing="0" bgcolor="white" style="background-color: white; border: 1px solid #aaaaaa;">
                  <tr>
                     <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                           <tr>
                              <td style="padding: 10px 30px 0px;">
                                 <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                       <td>
                                          <table cellpadding="0" cellspacing="0" border="0">
                                             <tr>
                                                <td>
                                                   <img src="${shareUrl}/res/components/images/page-64.png" alt="" width="64" height="64" border="0" style="padding-right: 20px;" />
                                                </td>
                                                <td>
                                                   <div style="font-size: 22px; padding-bottom: 4px;">
                                                      Calendar event '${document.properties["{http://www.alfresco.org/model/calendar}whatEvent"]}' will take place in the site '${document.siteShortName!""}'
													  on ${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?date} at ${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?time}
                                                   </div>
                                                   <div style="font-size: 13px;">
                                                      ${date?datetime?string.full}
                                                   </div>
                                                </td>
                                             </tr>
                                          </table>
                                          <div style="font-size: 14px; margin: 12px 0px 24px 0px; padding-top: 10px; border-top: 1px solid #aaaaaa;">
                                             <p>Hi,</p>

                                             <p>Calendar event '${document.properties["{http://www.alfresco.org/model/calendar}whatEvent"]}' will take place in the site '${document.siteShortName!""}' on
											${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?date} at ${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?time}
											 <div class="activity">
                                               title: ${document.properties["{http://www.alfresco.org/model/calendar}whatEvent"]}<br />
											description: ${document.properties["{http://www.alfresco.org/model/calendar}descriptionEvent"]}<br />
											date: ${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?date}<br />
											from: ${document.properties["{http://www.alfresco.org/model/calendar}fromDate"]?time}<br />
											where: ${document.properties["{http://www.alfresco.org/model/calendar}whereEvent"]}<br />

                                            </div>
											 
                                             <p>Click this link to view the item:
                                             <a href="https://sfdb/share/page/site/${document.siteShortName}/calendar">link</a></p>
                                             
                                             <p>Sincerely,<br />
                                             SF </p>
                                          </div>
                                       </td>
                                    </tr>
								   <tr>
									 <td style="padding: 0px 30px; font-size: 11px;">
										 Please do not reply to this mail
									  </td>
								   </tr>									
                                 </table>
                              </td>
                           </tr>
                           <tr>
                              <td>
                                 <div style="border-bottom: 1px solid #aaaaaa;">&nbsp;</div>
                              </td>
                           </tr>
                           <tr>
                              <td style="padding: 10px 30px;">
                                 <img src="${shareUrl}/themes/default/images/app-logo.png" alt="" width="117" height="48" border="0" />
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>