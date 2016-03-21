<@markup id="my-custom-css"  target="css" action="after" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/js/jquery-cron.css" group="calendar" />   
</@>

<@markup id="cal-custom-js"  target="js" action="after">
   <#-- JavaScript Dependencies -->
	<@script type="text/javascript" src="${url.context}/res/js/lib/jquery-1.11.1/jquery-1.11.1.min.js" group="calendar"/>
	<@script type="text/javascript" src="${url.context}/res/js/jquery-cron-quartz.js" group="calendar" />
</@>