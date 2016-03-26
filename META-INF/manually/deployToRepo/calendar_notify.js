/**
 * Calendar cron reminders, path:
 * 'PATH:"/app:company_home/app:dictionary/app:scripts/cm:calendar_notify.js"'
 */

var fromDate = document.properties["ia:fromDate"];
if (fromDate < new Date()) {
	calendarCrons.removeEvent(document.nodeRef);
} else {
	var recipients = document.properties["ia:cronRecipients"];
	if (recipients) {
		logger.log(recipients);

		var mail = actions.create("mail");
		mail.parameters.html = "html";
		// mail.parameters.to = email;
		var template = companyhome
				.childByNamePath("/Data Dictionary/Email Templates/Notify Email Templates/sfdb_calendar_reminder.html.ftl");
		if (template != null) {
			mail.parameters.template = template;
		}
		mail.parameters.subject = "Calendar reminder: "
				+ document.properties["ia:whatEvent"];
		mail.parameters.from = "ya@q.com";
		mail.parameters.to_many = recipients;
		// execute action against a document
		mail.execute(document);
		logger.log("Email sent " + document.properties["ia:whatEvent"] + " to "
				+ recipients);
	}
}