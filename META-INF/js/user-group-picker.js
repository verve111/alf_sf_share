/**
 * User/Group select control (SFDB), just init it on ftl 
 *
 * @namespace Alfresco.module
 * @class Alfresco.module.UserPicker
 */
(function()
{
   /**
   * YUI Library aliases
   */
   var Dom = YAHOO.util.Dom,
      KeyListener = YAHOO.util.KeyListener,
      Event = YAHOO.util.Event,
      Selector = YAHOO.util.Selector;

   /**
    * Alfresco Slingshot aliases
    */
    var $html = Alfresco.util.encodeHTML,
       $hasEventInterest = Alfresco.util.hasEventInterest;

   Alfresco.module.UserPicker = function(htmlId, config)
   {
	  // popups ('enter minimum 3 chars to search') bring to top
	  Alfresco.util.PopupManager.zIndex = 9999;	   
	   
      Alfresco.module.UserPicker.superclass.constructor.call(this, "Alfresco.module.UserPicker", htmlId, ["button", "container", "connection"]);

      // Instance variables
      this.components = {};

      // Decoupled event listeners
      if (htmlId != "null")
      {
		  try {
			YAHOO.Bubbling.unsubscribe("itemSelected", this.onRecipientsSelected, null);
		  } catch(ignore) {}
         // Make sure we listen for events when the user selects an authority
         YAHOO.Bubbling.on("itemSelected", this.onRecipientsSelected, this);
      }

		  config = config ? config : {};
		  Dom.get(this.id + "-recipients").innerHTML = "";
		  this.recipients = YAHOO.lang.isArray(config.recipients) ? config.recipients : [];
		  this._renderRecipients(this.recipients);	
		  
	  this.onTemplateLoaded(null, null);
	  
      return this;
   };

   YAHOO.extend(Alfresco.module.UserPicker, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       */
      options:
      {
         /**
          * Template URL
          *
          * @property templateUrl
          * @type string
          * @default Alfresco.constants.URL_SERVICECONTEXT + "modules/email-form"
          */
         //templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/email-form"
      },

      /**
       * Object container for storing component instances.
       *
       * @property components
       * @type object
       * @default null
       */
      components: null,

      /**
       * Container element for template in DOM.
       *
       * @property containerDiv
       * @type HTMLElement
       */
      containerDiv: null,

      /**
       * The selected Recipients usernames
       *
       * @property recipients
       * @type Array
       */
      recipients: [],

      /**
       * A cache for the selected Recipients displayNames, using username as key and the displayName as value.
       *
       * @property recipients
       * @type {object}
       */
      recipientsCache: {},

      /**
       * Event callback when dialog template has been loaded
       *
       * @method onTemplateLoaded
       * @param response {object} Server response from load template XHR request
       * @param emailFormConfig {object} Data to fill the form with
       */
      onTemplateLoaded: function EF_onTemplateLoaded(response, emailFormConfig)
      {
         var fnActionHandlerDiv = function TagLibrary_fnActionHandlerDiv(layer, args)
         {
            var owner = YAHOO.Bubbling.getOwnerByTagName(args[1].anchor, "li");
            if (owner !== null)
            {
               owner.parentNode.removeChild(owner);
               //me.widgets.form.validate();
            }
            return true;
         };
         YAHOO.Bubbling.addDefaultAction("email-recipient-action", fnActionHandlerDiv);

         // Load in the Authority Finder component from the server
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.URL_SERVICECONTEXT + "components/people-finder/authority-finder",
            dataObj:
            {
               htmlid: this.id + "-authority-finder"
            },
            successCallback:
            {
               fn: this.onAuthorityFinderLoaded,
               scope: this
            },
            failureMessage: this.msg("message.authorityfinderfail"),
            execScripts: true
         });

         // Show the dialog
         //this._showDialog(emailFormConfig);

      },

      /**
       * Called when the authority finder template has been loaded.
       * Creates a dialog and inserts the authority finder for choosing groups and users to add.
       *
       * @method onAuthorityFinderLoaded
       * @param response The server response
       */
      onAuthorityFinderLoaded: function EF_onAuthorityFinderLoaded(response)
      {
         // Inject the component from the XHR request into it's placeholder DIV element
         Dom.get(this.id + "-authority-finder").innerHTML = response.serverResponse.responseText;
		 
         this.widgets.authorityPicker = Alfresco.util.createYUIPanel(this.id + "-authority-picker",
          {
             //width: "35em",
             zIndex: 13
          }		 
         );

         // Find the Authority Finder by container ID
         this.components.authorityFinder = Alfresco.util.ComponentManager.get(this.id + "-authority-finder");

         // Set the correct options for our use
         this.components.authorityFinder.setOptions(
         {
            viewMode: Alfresco.AuthorityFinder.VIEW_MODE_COMPACT,
            singleSelectMode: true,
            minSearchTermLength: 3
         });
         var hidePickerListener = function(e)
         {
         if(!e) var e = window.event;

            if(e.keyCode == 27)
            {
               // Close dialog
               this.hide();
               //e.cancelBubble is supported by IE - this will kill the bubbling process.
               e.cancelBubble = true;
               e.returnValue = false;

               //e.stopPropagation for other browsers
               if ( e.stopPropagation ) e.stopPropagation();
               if ( e.preventDefault ) e.preventDefault();
            }
         };
         this.widgets.authorityPicker.hidePickerListener = hidePickerListener;
         this.widgets.authorityPicker.beforeShowEvent.subscribe(
            function()
            {
               YAHOO.util.Event.addListener(this.element, "keydown", this.hidePickerListener, this, true);
            }
         );
         this.widgets.authorityPicker.beforeHideEvent.subscribe(
            function()
            {
               YAHOO.util.Event.removeListener(this.element, "keydown", this.hidePickerListener);
            }
         );
         //this.widgets.selectRecipientsButton.set("disabled", false);
      },


      /**
       * Mandatory validation handler, tests that there is at least one recpient.
       *
       * @method mandatory
       * @param field {object} Will be the subject field since the recipient fields are hidden
       * @param args {object} Not used
       * @param event {object} The event that caused this handler to be called, maybe null
       * @param form {object} The forms runtime class instance the field is being managed by
       * @param silent {boolean} Determines whether the user should be informed upon failure
       * @param message {string} Message to display when validation fails, maybe null
       * @static
       */
      mandatoryRecipients: function mandatory(field, args, event, form, silent, message)
      {
         return Selector.query("input[type=hidden]", args.recipientsContainerEl).length > 0; 
      },

      /**
       * @method _renderRecipients
       * @param recipientIds {array} Ids of the rest of the recpients to load
       */
      _renderRecipients: function EF__renderRecipients(recipientIds)
      {
         if (recipientIds.length > 0)
         {
            var recipientId = recipientIds[recipientIds.length - 1];
            if (this.recipientsCache[recipientId])
            {
               this._renderRecipient(recipientId);
               recipientIds.pop();
               this._renderRecipients(recipientIds);
            }
            else if (recipientId.indexOf("GROUP_") == 0)
            {
               if (recipientId === "GROUP_EVERYONE")
               {
                  this.recipientsCache[recipientId] = "EVERYONE";
                  this._renderRecipients(recipientIds);
               }
               else
               {
                  Alfresco.util.Ajax.jsonGet(
                  {
                     url: Alfresco.constants.PROXY_URI_RELATIVE + "api/groups/" + recipientId.substring(6),
                     successCallback:
                     {
                        fn: function (p_oResponse, p_oObj)
                        {
                           var group = p_oResponse.json.data;
                           this.recipientsCache[recipientId] = group.displayName;
                           this._renderRecipients(p_oObj.recipientIds);
                        },
                        obj:
                        {
                           recipientIds: recipientIds
                        },
                        scope: this
                     }
                  });
               }
            }
            else
            {
               Alfresco.util.Ajax.jsonGet(
               {
                  url: Alfresco.constants.PROXY_URI_RELATIVE + "api/people/" + encodeURIComponent(recipientId),
                  successCallback:
                  {
                     fn: function (p_oResponse, p_oObj)
                     {
                        var person = p_oResponse.json;
                        this.recipientsCache[recipientId] = person.firstName + (person.lastName ? " " + person.lastName : "");
                        this._renderRecipients(p_oObj.recipientIds);
                     },
                     obj:
                     {
                        recipientIds: recipientIds
                     },
                     scope: this
                  }
               });
            }
         }
      },


      /**
       * @method _renderRecipient
       * @param recipientId  {string} The username/groupid of the recipient to render
       */
      _renderRecipient: function EF__renderRecipient(recipientId)
      {
         var recipientsEl = Dom.get(this.id + "-recipients"),
            recipientEl = document.createElement("li");
         Dom.addClass(recipientEl, recipientId.indexOf("GROUP_") == 0 ? "group" : "user");
         recipientEl.innerHTML = '<a href="#" class="email-recipient-action">' +
                                 '<input type="hidden" name="recipients[]" value="' + recipientId + '"/>' +
                                 '<span>' + $html(this.recipientsCache[recipientId]) + '</span>' +
                                 '<span class="remove">&nbsp;</span>' +
                                 '</a>';
         recipientsEl.appendChild(recipientEl);
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */

      /**
       * Select destination button event handler
       *
       * @method onSelectRecipientsClick
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onSelectRecipientsClick: function EF_onSelectRecipientsClick(e, p_obj)
      {
         this.components.authorityFinder.clearResults();
         this.widgets.authorityPicker.show();
		 var searchInput = Dom.get(this.id + "-authority-finder-search-text");
		 if (searchInput) {
			 searchInput.focus();
		 }
      },

      /**
       * Recipients selected in recipients dialog
       *
       * @method onReciepientsSelected
       * @param layer {object} Event fired
       * @param args {array} Event parameters (depends on event type)
       */
      onRecipientsSelected: function EF_onReciepientsSelected(layer, args)
      {
         // Check the event is directed towards this instance
         if ($hasEventInterest(this.components.authorityFinder, args))
         {
            var recipient = args[1];
            if (recipient !== null)
            {
               var i = 0;
               for (var il = this.recipients.length; i <il; i++)
               {
                  if (this.recipients[i] == recipient)
                  {
                     // Recipient was already added
                     break;
                  }
               }
               if (i == il)
               {
                  // Its a new recipient
                  this.recipients.push(recipient.itemName);
                  this.recipientsCache[recipient.itemName] = recipient.displayName;
               }
               this._renderRecipient(recipient.itemName);
               //this.widgets.form.validate();
            }
            // Close dialog
            this.widgets.authorityPicker.hide();
         }
      },

      
      /**
       * Dialog Cancel button event handler
       *
       * @method onCancelClick
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onCancelClick: function EF_onCancelClick(e, p_obj)
      {
         this.widgets.dialog.hide();
      }
   });

   /* Dummy instance to load optional YUI components early */
  // var dummyInstance = new Alfresco.module.UserPicker("null");
})();
