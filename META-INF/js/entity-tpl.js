var _regexNodeRef = new RegExp(/^[^\:^ ]+\:\/\/[^\:^ ]+\/[^ ]+$/);

function isNodeRef(value) {
	var result = false;
	try {
		result = _regexNodeRef.test(String(value));
	} catch (e) {
	}
	return result;
}

function getDefaultEntityTemplateId(control) {
	if (control) {
		var url = Alfresco.constants.PROXY_URI + 'projecttpl';
		var responseSuccess = function(o) {
			var response = JSON.parse(o.responseText);
			var projectDefaultTemplate = response.res;
			if (isNodeRef(projectDefaultTemplate)) {
				control.value = response.res;
			}
		};
		var responseFailure = function(o) {
		};
		callback = {
			success : responseSuccess,
			failure : responseFailure,
			argument : [ 'res' ]
		};
		YAHOO.util.Connect.asyncRequest('GET', url, callback);
	}
}
