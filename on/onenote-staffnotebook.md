---
ms.Toctitle: Work with staff notebooks
title: Work with staff notebooks
description: Learn how to create and manage staff notebooks.
ms.ContentId: 5ba2d15c-3d3f-46f9-8e5b-7eeae8a4b2d7
ms.date: July 26, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]


# Work with staff notebooks

*__Applies to:__ Enterprise notebooks on Office 365*

Schools, colleges, and universities worldwide use [staff notebooks](https://www.onenote.com/staffnotebookedu) to help promote productivity, engagement, and collaboration.

You can use the *staffNotebooks* endpoint to perform common tasks for staff notebooks, such as creating staff notebooks and adding or removing leaders or members.

>The OneNote API provides the *staffNotebooks* endpoint for operations that are specific to staff notebooks.


<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL for your platform:

[!INCLUDE [service root url enterprise only](../includes/onenote/service-root-url-ent.md)]

Then append the *staffNotebooks* endpoint, followed a resource path, as needed:

<p id="outdent1"><b>[Create staff notebooks](#create)</b></p>
<p id="indent1">`../staffNotebooks[?omkt,sendemail]`</p>

<p id="outdent1"><b>[Update a staff notebook](#update)</b></p>
<p id="indent1">`../staffNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Get one or more staff notebooks](#get)</b></p>
<p id="indent1">`../staffNotebooks`</p>
<p id="indent1">`../staffNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Delete a staff notebook](#delete)</b></p>
<p id="indent1">`../staffNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Add members or leaders](#add-people)</b></p>
<p id="indent1">`../staffNotebooks/{notebook-id}/members`</p>
<p id="indent1">`../staffNotebooks/{notebook-id}/leaders`</p>

<p id="outdent1"><b>[Remove members or leaders](#remove-people)</b></p>
<p id="indent1">`../staffNotebooks/{notebook-id}/members/{member-id}`</p>
<p id="indent1">`../staffNotebooks/{notebook-id}/leaders/{leader-id}`</p>

<p id="outdent1"><b>[Insert sections](#insert-sections)</b></p>
<p id="indent1">`../staffNotebooks/{notebook-id}/copySectionsToContentLibrary`</p>

<br />
Your full request URI will look something like these examples:
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/staffNotebooks/{id}/leaders/{id}`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/users/{id}/notes/staffNotebooks/{id}/members`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/staffNotebooks`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/groups/{id}/notes/staffNotebooks/{id}`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/staffNotebooks/{id}/copySectionsToContentLibrary`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="create"></a>
## Create staff notebooks

To create a staff notebook, send a POST request to the *staffNotebooks* endpoint. 

<p id="indent">`POST ../staffNotebooks[?omkt,sendemail]`</p>

In the message body, send a JSON object with the staff notebook creation parameters. 

```json
{
    "name": "notebook-name",
    "memberSections": [ 
        "section1-name", 
        "section2-name"
    ],
    "leaders": [
        {
            "id": "alias@tenant",
            "principalType": "Person-or-Group"
        }
    ],
    "members": [
        {
            "id": "alias@tenant",
            "principalType": "Person-or-Group" 
        },
        {
            "id": "alias@tenant",
            "principalType": "Person-or-Group"
        },
        {
            "id": "alias@tenant",
            "principalType": "Person-or-Group"
        }
   ], 
   "hasLeaderOnlySectionGroup": true
}
```

| Parameter | Description |  
|:------|:------|  
| name | The name of the notebook. |  
| memberSections | An array containing one or more section names. These sections are created in each member's section group. |  
| leaders | An array containing one or more principal objects. |
| members | An array containing one or more principal objects. A section group is created for each member. |    
| hasLeaderOnlySectionGroup | `true` to create a *Leader Only* section group that's visible to leaders only. | 
| omkt | URL query parameter that specifies the [language](#supported-langs) for the notebook. Default is `en-us`. Example: `?omkt=es-es` | 
| sendemail | URL query parameter that specifies whether to send an email notification when the notebook is created to the leaders and members assigned to the notebook. Default is `false`. |

<br />
Leaders and members are represented by principal objects, which contain the following properties:

| Parameter | Description |  
|:------|:------|  
| id | The Office 365 user principal name.<br /><br />See the [Azure AD Graph API documentation](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to learn more about users and groups. |  
| principalType | `Person` or `Group` | 


<a name="supported-langs"></a>
### Supported languages

You can use the `omkt={language-code}` URL query parameter to create a staff notebook in a specific language. For example:

<p id="indent">`POST ../staffNotebooks?omkt=de-de`</p>

The following language codes are supported. The default is `en-us`.

| Code | Language | 
|:------|:------| 
| bg-bg | Български (България) | 
| cs-cz | Čeština (Česká republika) | 
| da-dk | Dansk (Danmark) | 
| de-de | Deutsch (Deutschland) | 
| el-gr | Ελληνικά (Ελλάδα) | 
| en-us | English (United States) | 
| es-es | Español (España) | 
| et-ee | Eesti (Eesti) | 
| fi-fi | Suomi (Suomi) | 
| fr-fr | Français (France) | 
| hi-in | हिंदी (भारत) | 
| hr-hr | Hrvatski (Hrvatska) | 
| hu-hu | Magyar (Magyarország) | 
| id-id | Bahasa Indonesia (Indonesia) | 
| it-it | Italiano (Italia) | 
| ja-jp | 日本語 (日本) | 
| kk-kz | Қазақ (Қазақстан) | 
| ko-kr | 한국어 (대한민국) | 
| lt-lt | Lietuvių (Lietuva) | 
| lv-lv | Latviešu (Latvija) | 
| ms-my | Bahasa Melayu (Asia Tenggara) | 
| nb-no | Norsk (Norge) | 
| nl-nl | Nederlands (Nederland) | 
| pl-pl | Polski (Polska) | 
| pt-br | Português (Brasil) | 
| pt-pt | Português (Portugal) | 
| ro-ro | Română (România) | 
| ru-ru | Русский (Россия) | 
| sk-sk | Slovenčina (Slovenská republika) | 
| sl-si | Slovenski (Slovenija) | 
| sr-Latn-RS | Srpski (Rep. Srbija i Rep. Crna Gora) | 
| sv-se | Svenska (Sverige) | 
| th-th | ไทย (ไทย) | 
| tr-tr | Türkçe (Türkiye) | 
| uk-ua | Українська (Україна) | 
| vi-vn | Tiếng Việt (Việt Nam) | 
| zh-cn | 简体中文 (中国) | 
| zh-tw | 繁體中文 (台灣) | 


### Example

The following request creates a staff notebook named *Staff Meetings*.

```
POST ../v1.0/users/{leader-id}/notes/staffNotebooks?sendemail=true
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "name": "Staff Meetings",
    "memberSections": [
        "Staff Notes",
        "Meeting Summaries",
    ],
    "leaders": [
        {
            "id": "leader1@contoso.com",
            "principalType": "Person"
        }
    ],
    "members": [
        {
            "id": "member1@contoso.com",
            "principalType": "Person"
        },
        {
            "id": "member2@contoso.com",
            "principalType": "Person" 
        },
        {
            "id": "member3@contoso.com",
            "principalType": "Person"
        },
        {
            "id": "member4@contoso.com",
            "principalType": "Person"
        }
    ],
    "hasLeaderOnlySectionGroup": true
}
```

This creates a staff notebook with four member section groups, each containing a Handouts, Staff Notes, and Meeting Summaries section. The section group created for each member is only accessible by the member and the leader. It also creates a *Leader Only* section group that's only visible to the leader. The `sendemail=true` query parameter specifies to send an email notification to the leader and members when the notebook is created.


### Request and response information

The following information applies to `POST /staffNotebooks` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Content-Type header | `application/json` |  
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code. |  
| Response body | An OData representation of the new notebook in JSON format.<br /><br />In addition to [regular notebook properties](http://dev.onenote.com/docs#/reference/get-notebooks), staff notebooks also have the following properties:<ul><li>**memberSections**. The member sections in the notebooks.</li><li>**leaders**. The leaders that can access the notebook.</li><li>**member**. The members that can access the notebook.</li><li>**hasLeaderOnlySectionGroup**. `true` if the notebook contains a *Leader Only* section group, otherwise `false`.</li></ul> |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |    
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="update"></a>
## Update staff notebooks

To update a staff notebook, send a PATCH request to the *staffNotebooks/{notebook-id}* endpoint. 

>Currently, only the **hasLeaderOnlySectionGroup** property can be updated in a PATCH request. 

<p id="indent">`PATCH ../staffNotebooks/{notebook-id}`</p>

In the message body, send a JSON object with the update parameter.

```json
{
    "hasLeaderOnlySectionGroup": true
}
```

| Parameter | Description |  
|:------|:------|  
| hasLeaderOnlySectionGroup | `true` to add a *Leader Only* section group that's visible to leaders only. `false` is not supported. | 

See these methods for other ways to change staff notebooks: [Add members or leaders](#add-people), [Remove members or leaders](#remove-people), [Insert sections](#insert-sections).

### Example

The following request adds a *Leader Only* section group to the specified staff notebook. 

```
PATCH ../v1.0/users/{leader-id}/notes/staffNotebooks/{notebook-id}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "hasLeaderOnlySectionGroup": true
}
```

The new *Leader Only* section group is visible to leaders only.


### Request and response information

The following information applies to `PATCH ../staffNotebooks/{notebook-id}` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Content-Type header | `application/json` |  
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 204 HTTP status code. |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="get"></a>
## Get staff notebooks

To get one or more staff notebooks, send a GET request to the *staffNotebooks* endpoint.

<p id="outdent"><b>Get one or more staff notebooks</b></p>
<p id="indent">`GET ../staffNotebooks[?filter,orderby,select,top,skip,expand,count]`</p>

<p id="outdent"><b>Get a specific staff notebook</b></p>
<p id="indent">`GET ../staffNotebooks/{notebook-id}[?select,expand]`</p>

<br />
Notebooks can expand the `leaders` and `members` properties. The default sort order is `name asc`.

staff notebooks are also returned for `GET /notebooks` requests, but the results won't include any staff notebook-specific properties.


### Example

The following request gets staff notebooks that were created since January 1, 2016.

```
GET ../v1.0/users/{leader-id}/notes/staffNotebooks?filter=createdTime%20ge%202016-01-01 
Authorization: Bearer {token}
Accept: application/json
``` 

To learn more about getting notebooks, including supported query string options and examples, see [Get OneNote content and structure](../howto/onenote-get-content.md).

### Request and response information

The following information applies to `GET /staffNotebooks` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Accept header | `application/json` | 
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.Read, Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 200 HTTP status code. |  
| Response body | An OData representation of the staff notebooks in JSON format.<br /><br />In addition to [regular notebook properties](http://dev.onenote.com/docs#/reference/get-notebooks), staff notebooks also have the following properties:<ul><li>**memberSections**. The member sections in the notebooks.</li><li>**leaders**. The leaders that can access the notebook.</li><li>**member**. The members that can access the notebook.</li><li>**hasLeaderOnlySectionGroup**. `true` if the notebook contains a *Leader Only* section group, otherwise `false`.</li></ul> |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |   


<a name="delete"></a>
## Delete staff notebooks

To delete a staff notebook, send a DELETE request to the *staffNotebooks/{notebook-id}* endpoint.

<p id="indent">`DELETE ../staffNotebooks/{notebook-id}`</p>

### Example

The following request deletes the specified staff notebook.

```
DELETE ../v1.0/users/{leader-id}/notes/staffNotebooks/{notebook-id} 
Authorization: Bearer {token}
Accept: application/json
``` 

### Request and response information

The following information applies to `DELETE ../staffNotebooks/{notebook-id}` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |   
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 204 HTTP status code. |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |   


<a name="add-people"></a>
## Add members and leaders

Adding leaders and members gives them access to the staff notebook. Adding a member also creates a member section group. This section group is only accessible by the member and the leader, and contains the member sections that are defined for the notebook.

To add a member or leader to a staff notebook, send a POST request to the appropriate endpoint.

<p id="outdent"><b>Add a member</b></p>
<p id="indent">`POST ../staffNotebooks/{notebook-id}/members`</p>

<p id="outdent"><b>Add a leader</b></p>
<p id="indent">`POST ../staffNotebooks/{notebook-id}/leaders`</p>

<br />
Send a JSON principal object in the message body. You can add one member or one leader per request. 

```json
{
    "id": "alias@tenant",
    "principalType": "Person-or-Group"
}
```

Leaders and members are represented by principal objects, which contain the following properties:

| Parameter | Description |  
|:------|:------|  
| id | The Office 365 user principal name. See the [Azure AD Graph API documentation](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to learn more about users and groups. |  
| principalType | `Person` or `Group` |  


### Example

The following request adds a leader to the specified staff notebook.

```
POST ../v1.0/users/{leader-id}/notes/staffNotebooks/{notebook-id}/leaders 
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "id": "leader2@contoso.com",
    "principalType": "Person"
}
``` 

### Request and response information

The following information applies to `POST /members` and `POST /leaders` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Content-Type header | `application/json` |    
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All |  

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code. |  
| Response body | The member or leader that was added. |
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |


<a name="remove-people"></a>
## Remove members and leaders

Removing members and leaders from a staff notebook revokes their access to the notebook, but doesn't delete any content.

To remove a member or leader from a staff notebook, send a DELETE request to the appropriate endpoint.

<p id="outdent"><b>Remove a member</b></p>
<p id="indent">`DELETE ../staffNotebooks/{notebook-id}/members/{member-id}`</p>

<p id="outdent"><b>Remove a leader</b></p>
<p id="indent">`DELETE ../staffNotebooks/{notebook-id}/leaders/{leader-id}`</p>

<br />
You can remove one member or one leader per request.


### Example

The following request removes the specified member from the specified staff notebook.

```
DELETE ../v1.0/users/{leader-id}/notes/staffNotebooks/{notebook-id}/members/{member-id} 
Authorization: Bearer {token}
Accept: application/json
``` 

### Request and response information

The following information applies to `DELETE /members` and `DELETE /leaders` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |   
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All |    

| Response data | Description |  
|------|------|  
| Success code | A 204 HTTP status code. |   
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="insert-sections"></a>
## Insert sections

Use *copySectionsToContentLibrary* to copy specific sections from Office 365 notebooks and insert them into the Content Library of a staff notebook. A Content Library is a section group inside the staff notebook that has Read/Write permissions for leaders and Read permission for members.

To insert sections into a staff notebook, send a POST request to the *copySectionsToContentLibrary* endpoint of the target staff notebook. For example:

<p id="indent">`POST ../staffNotebooks/{notebook-id}/copySectionsToContentLibrary`</p>

In the message body, send a JSON object with the *sectionIds* parameter. 

```json
{
    "sectionIds": [
        "section1-id", 
        "section2-id",
        ...
    ]
}
```

| Parameter | Description |  
|:------|:------|  
| sectionIds | An array that contains the IDs of the sections that you want to insert into the staff notebook. |    

The user must have access to the target sections and notebook (owned or shared). All targets must be in the same tenant.

### Example

The following request inserts two sections into the Content Library of the specified staff notebook.

```
POST ../v1.0/me/notes/staffNotebooks/{notebook-id}/copySectionsToContentLibrary
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "sectionIds": [
        "1-85ba33b1-4959-4102-8dcd-d98e4e56e56f", 
        "1-8ba42j81-4959-4102-8dcd-d98e4e94s62ef"
    ]
}
```

### Request and response information

The following information applies to `POST /copySectionsToContentLibrary` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Content-Type header | `application/json` |  
| Accept header | `application/json` |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code. |  
| Errors | If the create request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="root-url"></a>
## Constructing the OneNote service root URL

[!INCLUDE [service root url section enterprise only](../includes/onenote/service-root-section-ent.md)]


<a name="see-also"></a>
## Additional resources

- [OneNote staff notebooks](https://www.onenote.com/staffnotebookedu) (overview and features)
- [Work with class notebooks](../howto/onenote-classnotebook.md)
- [OneNote development](../howto/onenote-landing.md)
- [Get Onenote content and structure](../howto/onenote-get-content.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://stackoverflow.com/questions/tagged/onenote-api+onenote) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)
