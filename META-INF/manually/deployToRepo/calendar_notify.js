/**
 * Calendar cron reminders, path:
 * 'PATH:"/app:company_home/app:dictionary/app:scripts/cm:calendar_notify.js"'
 */

var endDate = document.properties["ia:fromDate"];
if (endDate < new Date()) {
	calendarCrons.removeEvent(document.nodeRef);
} else {
	var creator = document.properties["cm:creator"];
	var person = people.getPerson(creator);
	email = person.properties["cm:email"];
	var template = companyhome
			.childByNamePath("/Data Dictionary/Email Templates/Notify Email Templates/sfdb_calendar_reminder.html.ftl");

	var site = siteService.getSite(document.siteShortName);
	var siteMembers = site.listMembers(null, null, 0);
	if (siteMembers != null) {
		for (userName in siteMembers) {
            person = people.getPerson(userName);
            email = person.properties["cm:email"];			
			var mail = actions.create("mail");
			mail.parameters.html = "html";
			mail.parameters.to = email;
			if (template != null) {
				mail.parameters.template = template;
			}
			mail.parameters.subject = "Calendar reminder: "
					+ document.properties["ia:whatEvent"];
			mail.parameters.from = "ya@q.com";
			// execute action against a document
			mail.execute(document);
			logger.log("Email sent " + document.properties["ia:whatEvent"] + " to " + email);
		}
	}
}