/**
 * SFDB extended discussions dashlet component (added the site name to discussion description)
 * 
 * @namespace Alfresco.dashlet
 * @class Alfresco.dashlet.SfdbForumSummary
 * @author SFDB
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom;
      

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;


   /**
    * Dashboard SfdbForumSummary constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.ForumSummary} The new component instance
    * @constructor
    */
   Alfresco.dashlet.SfdbForumSummary = function SfdbForumSummary_constructor(htmlId)
   {
      Alfresco.dashlet.SfdbForumSummary.superclass.constructor.call(this, htmlId);
      return this;
   };

   /**
    * Extend from ForumSummary
    */
   YAHOO.extend(Alfresco.dashlet.SfdbForumSummary, Alfresco.dashlet.ForumSummary,
   {
    
      /**
       * Called by the DataTable to build the 'topic' cell
       *
       * @method buildDescription
       * @param elCell {object}
       * @param oRecord {object}
       * @param oColumn {object}
       * @param oData {object|string}
       */
      buildDescription: function ForumSummary_buildDescription(elCell, oRecord, oColumn, oData)
      {
         var name = oRecord.getData("name"),
         	title = oRecord.getData("title"),
            author = oRecord.getData("author"),
            replies = oRecord.getData("totalReplyCount"),
            replyAuthor = oRecord.getData("lastReplyBy"),
            isUpdated = oRecord.getData("isUpdated"),
            createdDate =  Alfresco.util.relativeTime(oRecord.getData("createdOn")),
            updatedDate = Alfresco.util.relativeTime(oRecord.getData("updatedOn")),
            lastReplyDate = Alfresco.util.relativeTime(oRecord.getData("lastReplyOn")),
            site = oRecord.getData("site"),
            url = Alfresco.constants.URL_PAGECONTEXT + "site/" + site + "/discussions-topicview?topicId=" + name + "&listViewLinkBack=true";

         var cellContent = "<div class=\"node topic\">";
         cellContent += "<span class=\"nodeTitle\"><a href=\"" + url + "\">" + title + "</a>";
         if(isUpdated)
         {
            cellContent += "<span class=\"theme-color-2 nodeStatus\"> (" + this.msg("topicList.updated") + " " + updatedDate + ")</span>"; 
         }
         cellContent += "</span>";
         cellContent += "<div class=\"published\">";
		 
		 //SFDB: add link to site
		 var siteUrl = Alfresco.constants.URL_PAGECONTEXT + "site/" +  site + "/dashboard";		 
		 cellContent += "<span class=\"nodeAttrLabel\">Site: <a href=\"" + siteUrl + "\" class=\"theme-color-1\">%SITE_TITLE%</a></span>";		 
		 cellContent += "<br>";
		 
         cellContent += "<span>" + this.msg("topicList.createdBy", this.getAuthorLink(author, "theme-color-1"), createdDate) + "</span>";
		 
         if(replies > 0)
         {
            cellContent += "<br>";
            if(replies == 1)
            {
               cellContent += "<span class=\"nodeAttrLabel\">" + this.msg("topicList.replies.single") + " </span>";
            }
            else
            {
               cellContent += "<span class=\"nodeAttrLabel\">" + this.msg("topicList.replies.plural", replies) + " </span>";
            }
            cellContent += "<span class=\"nodeAttrLabel\">" + this.msg("topicList.lastReplyBy", this.getAuthorLink(replyAuthor, "theme-color-1"), lastReplyDate) + "</span>";
         }
         cellContent += "</div>";
		 
		 //SFDB get site title and set the Cell Content
		 Alfresco.util.Ajax.request({
            url: Alfresco.constants.PROXY_URI + "api/sites/" + site,
            successCallback: {
               fn: function(resp) {
					var siteTitle = resp.json.title;
					cellContent = cellContent.replace("%SITE_TITLE%", siteTitle);
					elCell.innerHTML = cellContent;					
			   },
               scope: this
            }
         });

      },	 
      
   });
})();