---
ms.TocTitle: Copy notebooks, sections, and pages
Title: Copy notebooks, sections, and pages 
Description: Use the OneNote API to copy notebooks, sections, and pages.
ms.ContentId: b21fe8c7-dab8-4efd-a3ac-b07c4c39f60d
ms.topic: article (how-tos)
ms.date: January 26, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

<style>#simpletable {margin:-5px 0px 0px 0px; border:none;} #simplecell {border:none; padding:15px 20px; background-color:white;}</style>


# Copy notebooks, sections, and pages

*__Applies to:__ Enterprise notebooks on Office 365 only*

To copy a OneNote notebook, section, or page, you send a POST request to the respective *copy* action endpoint. For example:

<p id="indent">`POST ../notes/sections/{id}/copyToNotebook`</p>

Send a JSON copy object in the message body. If the request is successful, the OneNote API returns a 202 HTTP status code and an **Operation-Location** header. Then, you can poll the operation endpoint for the result.

<p id="top-padding">**In this article**</p>
<p id="indent">[Construct the request URI](#request-uri)</p>
<p id="indent">[Construct the message body](#message-body)</p>
<p id="indent">[Example](#example)</p>
<p id="indent">[Request and response information](#request-response-info)</p>
<p id="indent">[Permissions](#permissions)</p>

>Copy functionality is currently supported for Office 365 personal, site, and unified group notebooks, but not for consumer notebooks on OneDrive.

<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL for your platform:

[!INCLUDE [service root url enterprise only](../includes/onenote/service-root-url-ent.md)]

Then append the respective *copy* action endpoint:

<p id="outdent1"><b>Copy a page to a section</b></p>
<p id="indent1">`../pages/{id}/copyToSection`</p>

<p id="outdent1"><b>Copy a section to a notebook</b></p>
<p id="indent1">`../sections/{id}/copyToNotebook`</p>

<p id="outdent1"><b>Copy a section to a section group</b></p>
<p id="indent1">`../sections/{id}/copyToSectionGroup`</p>

<p id="outdent1"><b>Copy a notebook</b></p>
<p id="indent1">`../notebooks/{id}/copyNotebook`</p> 
<p id="indent1">The notebook is copied to the Notebooks folder in the destination Documents library. The Notebooks folder is created if it doesn't exist.</p>

<br />
Your full request URI will look like one of these examples:

<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/sections/{id}/copyToNotebook`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/users/{id}/notes/sections/{id}/copytosectiongroup`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/pages/{id}/copyToSection`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/groups/{id}/notes/notebooks/{id}/copyNotebook`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="message-body"></a>
## Construct the message body

In the message body, send a JSON object that contains the parameters that your operation needs. It's okay to send an empty body if no parameters are needed.

| Parameter | Description |  
|:------|:------|  
| id | The ID of the destination notebook or section group (for sections); or the ID of the destination section (for pages).<br /><br />Used with **copyToNotebook**, **copyToSectionGroup**, and **copyToSection** only. |  
| siteCollectionId | The ID of the SharePoint site collection that contains the site to copy the item to.<br /><br />Used with **siteId**, and used only when copying to a SharePoint site. |   
| siteId | The ID of the SharePoint site to copy the item to.<br /><br />Used with **siteCollectionId**, and used only when copying to a SharePoint site. |  
| groupId | The ID of the group to copy the item to.<br /><br />Used only when copying to a unified group. |  
| renameAs | The name of the copy.<br /><br />Used with **copyNotebook**, **copyToNotebook**, and **copyToSectionGroup** only. Defaults to the name of the existing item. |  

Learn how to [get notebook, section group, and section IDs](../howto/onenote-get-content.md) and [get site collection and site IDs](#get-site-id). For information about getting group IDs, see the [Azure AD Graph API documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/api-catalog).


<a name="example"></a>
## Example flow for a copy operation

First you send a POST request to the *copy* action on the item you want to copy. You can copy from notebooks that the user has access to (owned or shared) as long as the source and destination are in the same tenant.

The following example copies a personal notebook to a SharePoint team site. The request doesn't include the **renameAs** parameter, so the new notebook uses the existing name. 

```
POST https://www.onenote.com/api/v1.0/me/notes/notebooks/1-db247796-f4d1-4972-a869-942919bf9923/copyNotebook
Authorization: Bearer {token}
Content-Type: application/json 

{
  "siteCollectionId":"0f6dbd5d-d179-49c6-aabd-15830ea90ca8",
  "siteId":"3ba679cf-4470-466e-bc20-053bdfec75bf"
}
```

>Copy operations honor the source notebook's permissions, so the authenticated user must be able to access the source notebook in order to copy it. However, copies don't retain the permissions of the source. The copy has permissions as though the user just created it. 

If the call is successful, the OneNote API returns a 202 status code and an **Operation-Location** header. Here's an excerpt of the response: 

```
HTTP/1.1 202 Accepted
Location: https://www.onenote.com/api/v1.0/me/notes/notebooks/1-db247796-f4d1-4972-a869-942919bf9923
X-CorrelationId: 8a211d7c-220b-413d-8022-9a946499fcfb
Operation-Location: https://www.onenote.com/api/beta/myOrganization/siteCollections/0f6dbd5d-d179-49c6-aabd-15830ea90ca8/sites/0f6dbd5d-d179-49c6-aabd-15830ea90ca8/notes/operations/copy-8a211d7c-220b-413d-8022-9a946499fcfb
...
```

Then you poll the **Operation-Location** endpoint to get the status of the copy operation: 

```
GET https://www.onenote.com/api/beta/myOrganization/siteCollections/0f6dbd5d-d179-49c6-aabd-15830ea90ca8/sites/0f6dbd5d-d179-49c6-aabd-15830ea90ca8/notes/operations/copy-8a211d7c-220b-413d-8022-9a946499fcfb
Authorization: Bearer {token}
Accept: application/json
```
  
The OneNote API returns an **OperationModel** object that shows the current status. The following example response is returned when the status is completed. 

```json
{
  "@odata.context":"https://www.onenote.com/api/beta/$metadata#myOrganization/siteCollections('0f6dbd5d-d179-49c6-aabd-15830ea90ca8')/sites('0f6dbd5d-d179-49c6-aabd-15830ea90ca8')/notes/operations/$entity",
  "id":"copy-1c5be75c-e7db-4219-8145-a2d6c3f171a33ec9f3da-2b24-4fb1-a776-fe8c8cd1410f",
  "status":"completed",
  "createdDateTime":"2015-09-16T17:32:07.048Z",
  "lastActionDateTime":"2015-09-16T17:32:17.7777639Z",
  "resourceLocation":"https://www.onenote.com/api/v1.0/myOrganization/siteCollections/0f6dbd5d-d179-49c6-aabd-15830ea90ca8/sites/3ba679cf-4470-466e-bc20-053bdfec75bf/notes/notebooks/1-bde29eeb-66e2-4fed-8d48-51cd1bf32511",
  "resourceId":null,"
  "error":null
}
```

The status can be **completed**, **running**, or **failed**. 

- If **completed**, the **resourceLocation** property contains the resource endpoint for the new copy. 
- If **running**, the **percentComplete** property shows the approximate percentage completed.
- If **failed**, the **error** and **@api.diagnostics** properties provide error information.

You can poll the operation endpoint until the operation has completed or failed. 


<a name="request-response-info"></a>
## Request and response information
  
| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | `Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.<br /><br />If missing or invalid, the request fails with a 401 status code. See [Authentication and permissions](..\howto\onenote-auth.md). |  
| Content-Type header | `application/json` |  
| Accept header | `application/json` | 

| Response data | Description |  
|------|------|  
| Success code | A 202 status HTTP status code. |   
| Operation-Location header | The URL to poll for the status of the operation.<br /><br />Polling the operation endpoint returns an **OperationModel** object that contains the status of the operation and other information. | 
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |


<a name="root-url"></a>
### Constructing the OneNote service root URL

[!INCLUDE [service root url section enterprise only](../includes/onenote/service-root-section-ent.md)]


<a name="permissions"></a>
## Permissions

To copy OneNote notebooks, sections, and pages, you'll need to request appropriate permissions. Choose the lowest level of permissions that your app needs to do its work.

[!INCLUDE [Create perms](../includes/onenote/create-perms.md)] 

For more information about permission scopes and how they work, see [OneNote permission scopes](../howto/onenote-auth.md).


<a name="see-also"></a>
## Additional resources

- [Get OneNote content and structure](../howto/onenote-get-content.md)
- [Create OneNote pages](../howto/onenote-create-page.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182)
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  


