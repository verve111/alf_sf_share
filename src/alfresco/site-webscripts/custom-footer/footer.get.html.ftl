<@markup id="custom-sfdb-footer" target="html" action="replace">
   <@uniqueIdDiv>
      <#assign fc=config.scoped["Edition"]["footer"]>
      <div class="footer ${fc.getChildValue("css-class")!"footer-com"}">
         <span class="copyright">
            <#--a href="#" onclick="Alfresco.module.getAboutShareInstance().show(); return false;"><img src="${url.context}/res/components/images/${fc.getChildValue("logo")!"alfresco-share-logo.png"}" alt="${fc.getChildValue("alt-text")!"Alfresco Community"}" border="0"/></a-->
            <#if licenseHolder != "" && licenseHolder != "UNKNOWN">
               <span class="licenseHolder">${msg("label.licensedTo")} ${licenseHolder}</span><br>
            </#if>
            <#-- span>${msg(fc.getChildValue("label")!"label.copyright")}</span-->
         </span>
      </div>
   </@>
</@>
