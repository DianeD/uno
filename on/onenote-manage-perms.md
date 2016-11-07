---
ms.Toctitle: Manage permissions
title: Manage permissions on OneNote entities
description: Learn how to create and manage read and write permissions on notebooks, section groups, and sections.
ms.ContentId: 9dd85ba3-d01d-4148-b643-47b0f55cd99a
ms.date: May 24, 2016

---


[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]


# Manage permissions on OneNote entities

*__Applies to:__ Enterprise notebooks on Office 365*

You can use the *permissions* endpoint to manage read or write permissions to notebooks, section groups, and sections.

<p id="indent1">`POST ../permissions`</p>
<p id="indent1">`GET ../permissions`</p>
<p id="indent1">`GET ../permissions/{permission-id}`</p>
<p id="indent1">`DELETE ../permissions/{permission-id}`</p>

>Managing permissions is supported for Office 365 personal, site, and unified group notebooks, but not for consumer notebooks on OneDrive.

<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL for your platform:

[!INCLUDE [service root url enterprise only](../includes/onenote/service-root-url-ent.md)]

Then append the path to the target notebook, section group, or section entity, followed by the *permissions* or *permissions/{id}* endpoint.

Your full request URI will look something like these examples:
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/notebooks/{id}/permissions/{id}`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/users/{id}/notes/sectiongroups/{id}/permissions`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/notebooks/{id}/permissions`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/groups/{id}/notes/sections/{id}/permissions/{id}`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="create"></a>
## Create or update permissions

To create or update permissions for a notebook, section group, or section, send a POST request to the appropriate endpoint. You can create or update only one permission per request. 

Permissions are applied to all OneNote entities down the [inheritance chain](#permission-inheritance-and-precedence).

You can update permissions to grant more permissive access. But to restrict access, you must delete the existing permission and create a new permission. See [Permission inheritance and precedence](#permission-inheritance-and-precedence).


<p id="outdent">**Create or update permissions for a notebook**</p>
<p id="indent">`POST ../notebooks/{notebook-id}/permissions`</p>

<p id="outdent">**Create or update permissions for a section group**</p>
<p id="indent">`POST ../sectiongroups/{sectiongroup-id}/permissions`</p>

<p id="outdent">**Create or update permissions for a section**</p>
<p id="indent">`POST ../sections/{section-id}/permissions`</p>

In the message body, send a JSON object with the required parameters. 
 
```
{
    "userRole": "user-role", 
    "userId": "user-login-id"
}
```

| Parameter | Description |  
|:------|:------|  
| userRole | The type of [permission](#permission-inheritance-and-precedence): `Owner`, `Contributor`, or `Reader`. |  
| userId | The login of the user or group to assign the permission to. The API accepts the claims format which includes the membership provider name (*i:0#.f&#124;membership&#124;username@domainname.com*), or the user principal login name only (*username@domainname.com*). |  

### Example

The following request creates a permission for the specified notebook. 

#### Request

```
POST ../v1.0/me/notes/notebooks/{notebook-id}/permissions
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "userRole": "Owner", 
    "userId": "i:0#.f|membership|alexd@domainname.com"
}
```

#### Response

```
HTTP/1.1 201 Created

{
  "@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('1-313dc828-dd55-4c71-82c3-f9c30a40e7c5')/permissions/$entity",
  "userRole":"Owner",
  "userId":"i:0#.f|membership|alexd@domainname.com",
  "name":"Alex Darrow",
  "id":"1-23",
  "self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/1-313dc828-dd55-4c71-82c3-f9c30a40e7c5/permissions/1-23",
}
```

### Request and response information

The following information applies to `POST /permissions` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All |    

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code. |   
| Response body | An OData representation of the permission in JSON format. See [Get permissions](#get-permissions) for a description of a Permission object. |
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="get"></a>
## Get permissions

To get permissions for a notebook, section group, or section, send a GET request to the appropriate endpoint. 

<p id="outdent">**Get permissions for a notebook**</p>
<p id="indent">`GET ../notebooks/{notebook-id}/permissions`</p>

<p id="outdent">**Get a specific permission for a notebook**</p>
<p id="indent">`GET ../notebooks/{notebook-id}/permissions/{permission-id}`</p>

<p id="outdent">**Get permissions for a section group**</p>
<p id="indent">`GET ../sectiongroups/{sectiongroup-id}/permissions`</p>

<p id="outdent">**Get a specific permission for a section group**</p>
<p id="indent">`GET ../sectiongroups/{sectiongroup-id}/permissions/{permission-id}`</p>

<p id="outdent">**Get permissions for a section**</p>
<p id="indent">`GET ../sections/{section-id}/permissions`</p>

<p id="outdent">**Get a specific permission for a section**</p>
<p id="indent">`GET ../sections/{section-id}/permissions/{permission-id}`</p>

<br />
GET requests return the highest permission for a user role on the target entity. For more information, see [Permission inheritance and precedence](#permission-inheritance-and-precedence).

`GET /permissions` requests support OData query options, as follows:

<p id="indent">`GET ../permissions[?filter,orderby,select,top,skip,count]`</p>
<p id="indent">`GET ../permissions/{permission-id}[?select]`</p>

>The *permissions* endpoint does not support the `expand` query option.

To learn more about getting OneNote entities, including supported query string options and examples, see [Get OneNote content and structure](../howto/onenote-get-content.md).

### Permission object

A permission contains the following properties. 

| Property | Description | 
|:------|:------| 
| name | The display name of the user or group principal. Example: `"name":"Everyone"` | 
| id | The unique identifier of the permission, in the form `1-{principal-member-id}`. Example: `"id":"1-4"` | 
| self | The URL of the permission object. | 
| userId | The login of the user or group the permission is assigned to. This value is always returned in the claims format, for example: *i:0#.f&#124;membership&#124;username@domainname.com*. | 
| userRole | The type of [permission](#permission-inheritance-and-precedence): `Owner`, `Contributor`, or `Reader`. | 

### Example

The following request gets all permissions for the specified notebook.

#### Request

```
GET ../v1.0/me/notes/notebooks/{notebook-id}/permissions
Authorization: Bearer {token}
Accept: application/json
```

#### Response

```json
HTTP/1.1 200

{
  "@odata.context":"https://www.onenote.com/api/v1.0/$metadata#me/notes/notebooks('1-313dc828-dd55-4c71-82c3-f9c30a40e7c5')/permissions",
  "value":[
  {
    "userRole":"Owner",
    "userId":"c:0(.s|true",
    "name":"Everyone",
    "id":"1-4",
    "self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/1-313dc828-dd55-4c71-82c3-f9c30a40e7c5/1-4"
  },
  {
    "userRole":"Owner",
    "userId":"c:0-.f|rolemanager|spo-grid-all-users/8461cbdd-15a6-45c8-b177-ac24f48a8bee",
    "name":"Everyone except external users",
    "id":"1-5",
    "self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/1-313dc828-dd55-4c71-82c3-f9c30a40e7c5/permissions/1-5"
  },
  {
    "userRole":"Owner",
    "userId":"i:0#.f|membership|alexd@domainname.com",
    "name":"Alex Darrow",
    "id":"1-23",
    "self":"https://www.onenote.com/api/v1.0/me/notes/notebooks/1-313dc828-dd55-4c71-82c3-f9c30a40e7c5/permissions/1-23",
  }]
}
```

### Request and response information

The following information applies to `GET /permissions` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.Read, Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All |    

| Response data | Description |  
|------|------|  
| Success code | A 200 HTTP status code and the requested permissions. |   
| Response body | An OData representation of the permissions in JSON format. | 
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="delete"></a>
## Delete permissions

To delete a permission for a notebook, section group, or section, send a DELETE request to the appropriate endpoint. You can delete one permission per request.

When you delete a permission, it is deleted from all the OneNote entities down the [inheritance chain](#permission-inheritance-and-precedence).

<p id="outdent">**Delete a permission for a notebook**</p>
<p id="indent">`DELETE ../notebooks/{notebook-id}/permissions/{permission-id}`</p>

<p id="outdent">**Delete a permission for a section group**</p>
<p id="indent">`DELETE ../sectiongroups/{sectiongroup-id}/permissions/{permission-id}`</p>

<p id="outdent">**Delete a permission for a section**</p>
<p id="indent">`DELETE ../sections/{section-id}/permissions/{permission-id}`</p>


### Example

The following request deletes a permission for the specified notebook. 

```
DELETE ../v1.0/me/notes/notebooks/1-313dc828-dd55-4c71-82c3-f9c30a40e7c5/permissions/1-23
Authorization: Bearer {token}
Accept: application/json
```

### Request and response information

The following information applies to `DELETE /permissions` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All |    

| Response data | Description |  
|------|------|  
| Success code | A 204 HTTP status code. |   
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="permission-inheritance-and-precedence"></a>
## Permissions, inheritance, and precedence

You can set the following permissions on notebooks, section groups, and sections.

| Permission | Description | 
|:------|:------| 
| Reader | Read-only access to notebooks, section groups, and sections. | 
| Contributor | Can add, edit, and delete notebooks, section groups, and sections. | 
| Owner | All the permissions above, also can manage permissions (get, create, and delete). | 

When managing permissions on OneNote entities, you should understand permission inheritance and precedence.

- **Inheritance**. Entities inherit the permissions of their parent. So, notebooks inherit the permissions of the document library that contains the notebook. And in turn, these permissions are inherited by the child section groups and sections within the notebook. When you set explicit permissions on a notebook, section group, or section, the permissions also propagate to its child objects.

- **Precedence**. When conflicting permissions are set on a OneNote entity, the highest (most permissive) permission is honored. Users and groups might be granted conflicting levels of access when multiple permissions are applied to an entity (either explicitly or inherited), or when the user or group belongs to multiple roles. 

These principles determine how the OneNote API manages permissions. For example:

- When you create a permission for a notebook or section group, the permission is pushed down to all children.

- When you delete a permission for a notebook or section group, the permission is deleted from all children.

- When you get permissions, the OneNote API returns only the highest permission for roles that have conflicting permissions.

- You can update permissions to grant more permissive access to a user or group. But if you want to restrict access, you must first delete the more permissive permission and then create a new permission with the restrictive access. 
 This is because a `POST /permissions` request actually appends a user role to the permissions collection for the entity, and the most permissive access is honored. So in other words, you can update a Reader permission to have Contributor or Owner access, but you can't update a Contributor permission 
 to allow only Reader access.


<a name="root-url"></a>
## Constructing the OneNote service root URL

[!INCLUDE [service root url section enterprise only](../includes/onenote/service-root-section-ent.md)]


<a name="see-also"></a>
## Additional resources

- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://stackoverflow.com/questions/tagged/onenote-api+onenote) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)
