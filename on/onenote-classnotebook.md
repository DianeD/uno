---
ms.Toctitle: Work with class notebooks
title: Work with class notebooks
description: Learn how to create and manage class notebooks.
ms.ContentId: b3eca630-4f08-4157-b01b-c38df7782648
ms.date: May 24, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]


# Work with class notebooks

*__Applies to:__ Enterprise notebooks on Office 365*

Schools, colleges, and universities worldwide use [class notebooks](https://www.onenote.com/classnotebook) to help promote productivity, engagement, and collaboration. You can use class notebooks for every class, project, term, and assignment.

You can use the *classNotebooks* endpoint to perform common tasks for class notebooks, such as creating class notebooks and adding or removing students.

>The OneNote API provides the *classNotebooks* endpoint for operations that are specific to class notebooks.


<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL for your platform:

[!INCLUDE [service root url enterprise only](../includes/onenote/service-root-url-ent.md)]

Then append the *classNotebooks* endpoint, followed a resource path, as needed:

<p id="outdent1"><b>[Create class notebooks](#create)</b></p>
<p id="indent1">`../classNotebooks[?omkt,sendemail]`</p>

<p id="outdent1"><b>[Update a class notebook](#update)</b></p>
<p id="indent1">`../classNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Get one or more class notebooks](#get)</b></p>
<p id="indent1">`../classNotebooks`</p>
<p id="indent1">`../classNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Delete a class notebook](#delete)</b></p>
<p id="indent1">`../classNotebooks/{notebook-id}`</p>

<p id="outdent1"><b>[Add students or teachers](#add-people)</b></p>
<p id="indent1">`../classNotebooks/{notebook-id}/students`</p>
<p id="indent1">`../classNotebooks/{notebook-id}/teachers`</p>

<p id="outdent1"><b>[Remove students or teachers](#remove-people)</b></p>
<p id="indent1">`../classNotebooks/{notebook-id}/students/{student-id}`</p>
<p id="indent1">`../classNotebooks/{notebook-id}/teachers/{teacher-id}`</p>

<p id="outdent1"><b>[Insert sections](#insert-sections)</b></p>
<p id="indent1">`../classNotebooks/{notebook-id}/copySectionsToContentLibrary`</p>

<br />
Your full request URI will look something like these examples:
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/classNotebooks/{id}/teachers/{id}`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/users/{id}/notes/classNotebooks/{id}/students`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/classNotebooks`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/groups/{id}/notes/classNotebooks/{id}`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/classNotebooks/{id}/copySectionsToContentLibrary`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="create"></a>
## Create class notebooks

To create a class notebook, send a POST request to the *classNotebooks* endpoint. 

<p id="indent">`POST ../classNotebooks[?omkt,sendemail]`</p>

In the message body, send a JSON object with the class notebook creation parameters. 

```json
{
    "name": "notebook-name",
    "studentSections": [ 
        "section1-name", 
        "section2-name"
    ],
    "teachers": [
        {
            "id": "alias@tenant",
            "principalType": "Person-or-Group"
        }
    ],
    "students": [
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
   "hasTeacherOnlySectionGroup": true
}
```

| Parameter | Description |  
|:------|:------|  
| name | The name of the notebook. |  
| studentSections | An array containing one or more section names. These sections are created in each student's section group. |  
| teachers | An array containing one or more principal objects. |
| students | An array containing one or more principal objects. A section group is created for each student. |    
| hasTeacherOnlySectionGroup | `true` to create a *Teacher Only* section group that's visible to teachers only. | 
| omkt | URL query parameter that specifies the [language](#supported-langs) for the notebook. Default is `en-us`. Example: `?omkt=es-es` | 
| sendemail | URL query parameter that specifies whether to send an email notification when the notebook is created to the teachers and students assigned to the notebook. Default is `false`. |

<br />
Teachers and students are represented by principal objects, which contain the following properties:

| Parameter | Description |  
|:------|:------|  
| id | The Office 365 user principal name.<br /><br />See the [Azure AD Graph API documentation](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to learn more about users and groups. |  
| principalType | `Person` or `Group` | 


<a name="supported-langs"></a>
### Supported languages

You can use the `omkt={language-code}` URL query parameter to create a class notebook in a specific language. For example:

<p id="indent">`POST ../classNotebooks?omkt=de-de`</p>

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

The following request creates a class notebook named *Math 101*.

```
POST ../v1.0/users/{teacher-id}/notes/classNotebooks?sendemail=true
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "name": "Math 101",
    "studentSections": [
        "Handouts",
        "Class Notes",
        "Homework",
        "Quizzes"
    ],
    "teachers": [
        {
            "id": "teacher1@contoso.com",
            "principalType": "Person"
        }
    ],
    "students": [
        {
            "id": "student1@contoso.com",
            "principalType": "Person"
        },
        {
            "id": "student2@contoso.com",
            "principalType": "Person" 
        },
        {
            "id": "student3@contoso.com",
            "principalType": "Person"
        },
        {
            "id": "student4@contoso.com",
            "principalType": "Person"
        }
    ],
    "hasTeacherOnlySectionGroup": true
}
```

This creates a class notebook with four student section groups, each containing a Handouts, Class Notes, Homework, and Quizzes section. The section group created for each student is only accessible by the student and the teacher. It also creates a *Teacher Only* section group that's only visible to the teacher. The `sendemail=true` query parameter specifies to send an email notification to the teacher and students when the notebook is created.


### Request and response information

The following information applies to `POST /classNotebooks` requests.

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
| Response body | An OData representation of the new notebook in JSON format.<br /><br />In addition to [regular notebook properties](http://dev.onenote.com/docs#/reference/get-notebooks), class notebooks also have the following properties:<ul><li>**studentSections**. The student sections in the notebooks.</li><li>**teachers**. The teachers that can access the notebook.</li><li>**students**. The students that can access the notebook.</li><li>**hasTeacherOnlySectionGroup**. `true` if the notebook contains a *Teacher Only* section group, otherwise `false`.</li></ul> |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |    
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="update"></a>
## Update class notebooks

To update a class notebook, send a PATCH request to the *classNotebooks/{notebook-id}* endpoint. 

>Currently, only the **hasTeacherOnlySectionGroup** property can be updated in a PATCH request. 

<p id="indent">`PATCH ../classNotebooks/{notebook-id}`</p>

In the message body, send a JSON object with the update parameter.

```json
{
    "hasTeacherOnlySectionGroup": true
}
```

| Parameter | Description |  
|:------|:------|  
| hasTeacherOnlySectionGroup | `true` to add a *Teacher Only* section group that's visible to teachers only. `false` is not supported. | 

See these methods for other ways to change class notebooks: [Add students or teachers](#add-people), [Remove students or teachers](#remove-people), [Insert sections](#insert-sections).

### Example

The following request adds a *Teacher Only* section group to the specified class notebook.

```
PATCH ../v1.0/users/{teacher-id}/notes/classNotebooks/{notebook-id}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "hasTeacherOnlySectionGroup": true
}
```

The new *Teacher Only* section group is visible to teachers only.


### Request and response information

The following information applies to `PATCH ../classNotebooks/{notebook-id}` requests.

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
## Get class notebooks

To get one or more class notebooks, send a GET request to the *classNotebooks* endpoint.

<p id="outdent"><b>Get one or more class notebooks</b></p>
<p id="indent">`GET ../classNotebooks[?filter,orderby,select,top,skip,expand,count]`</p>

<p id="outdent"><b>Get a specific class notebook</b></p>
<p id="indent">`GET ../classNotebooks/{notebook-id}[?select,expand]`</p>

<br />
Notebooks can expand the `teachers` and `students` properties. The default sort order is `name asc`.

Class notebooks are also returned for `GET /notebooks` requests, but the results won't include any class notebook-specific properties.


### Example

The following request gets class notebooks that were created since January 1, 2016.

```
GET ../v1.0/users/{teacher-id}/notes/classNotebooks?filter=createdTime%20ge%202016-01-01 
Authorization: Bearer {token}
Accept: application/json
``` 

To learn more about getting notebooks, including supported query string options and examples, see [Get OneNote content and structure](../howto/onenote-get-content.md).

### Request and response information

The following information applies to `GET /classNotebooks` requests.

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authenticate using Azure AD (enterprise apps)](..\howto\onenote-auth.md#aad-auth).</p> |  
| Accept header | `application/json` | 
| [Permission scope](../howto/onenote-auth.md#onenote-perms-aad) | Notes.Read, Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, or Notes.ReadWrite.All | 

| Response data | Description |  
|------|------|  
| Success code | A 200 HTTP status code. |  
| Response body | An OData representation of the class notebooks in JSON format.<br /><br />In addition to [regular notebook properties](http://dev.onenote.com/docs#/reference/get-notebooks), class notebooks also have the following properties:<ul><li>**studentSections**. The student sections in the notebooks.</li><li>**teachers**. The teachers that can access the notebook.</li><li>**student**. The students that can access the notebook.</li><li>**hasTeacherOnlySectionGroup**. `true` if the notebook contains a *Teacher Only* section group, otherwise `false`.</li></ul> |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |   
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |   


<a name="delete"></a>
## Delete class notebooks

To delete a class notebook, send a DELETE request to the *classNotebooks/{notebook-id}* endpoint.

<p id="indent">`DELETE ../classNotebooks/{notebook-id}`</p>

### Example

The following request deletes the specified class notebook.

```
DELETE ../v1.0/users/{teacher-id}/notes/classNotebooks/{notebook-id} 
Authorization: Bearer {token}
Accept: application/json
``` 

### Request and response information

The following information applies to `DELETE ../classNotebooks/{notebook-id}` requests.

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
## Add students and teachers

Adding teachers and students gives them access to the class notebook. Adding a student also creates a student section group. This section group is only accessible by the student and the teacher, and contains the student sections that are defined for the notebook.

To add a student or teacher to a class notebook, send a POST request to the appropriate endpoint.

<p id="outdent"><b>Add a student</b></p>
<p id="indent">`POST ../classNotebooks/{notebook-id}/students`</p>

<p id="outdent"><b>Add a teacher</b></p>
<p id="indent">`POST ../classNotebooks/{notebook-id}/teachers`</p>

<br />
Send a JSON principal object in the message body. You can add one student or one teacher per request. 

```json
{
    "id": "alias@tenant",
    "principalType": "Person-or-Group"
}
```

Teachers and students are represented by principal objects, which contain the following properties:

| Parameter | Description |  
|:------|:------|  
| id | The Office 365 user principal name. See the [Azure AD Graph API documentation](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to learn more about users and groups. |  
| principalType | `Person` or `Group` |  


### Example

The following request adds a teacher to the specified class notebook.

```
POST ../v1.0/users/{teacher-id}/notes/classNotebooks/{notebook-id}/teachers 
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
    "id": "teacher2@contoso.com",
    "principalType": "Person"
}
``` 

### Request and response information

The following information applies to `POST /students` and `POST /teachers` requests.

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
| Response body | The student or teacher that was added. |
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |


<a name="remove-people"></a>
## Remove students and teachers

Removing students and teachers from a class notebook revokes their access to the notebook, but doesn't delete any content.

To remove a student or teacher from a class notebook, send a DELETE request to the appropriate endpoint.

<p id="outdent"><b>Remove a student</b></p>
<p id="indent">`DELETE ../classNotebooks/{notebook-id}/students/{student-id}`</p>

<p id="outdent"><b>Remove a teacher</b></p>
<p id="indent">`DELETE ../classNotebooks/{notebook-id}/teachers/{teacher-id}`</p>

<br />
You can remove one student or one teacher per request.


### Example

The following request removes the specified student from the specified class notebook.

```
DELETE ../v1.0/users/{teacher-id}/notes/classNotebooks/{notebook-id}/students/{student-id} 
Authorization: Bearer {token}
Accept: application/json
``` 

### Request and response information

The following information applies to `DELETE /students` and `DELETE /teachers` requests.

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

Use *copySectionsToContentLibrary* to copy specific sections from Office 365 notebooks and insert them into the Content Library of a class notebook. A Content Library is a section group inside the class notebook that has Read/Write permissions for teachers and Read permission for students.

To insert sections into a class notebook, send a POST request to the *copySectionsToContentLibrary* endpoint of the target class notebook. For example:

<p id="indent">`POST ../classNotebooks/{notebook-id}/copySectionsToContentLibrary`</p>

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
| sectionIds | An array that contains the IDs of the sections that you want to insert into the class notebook. |    

The user must have access to the target sections and notebook (owned or shared). All targets must be in the same tenant.

### Example

The following request inserts two sections into the Content Library of the specified class notebook.

```
POST ../v1.0/me/notes/classNotebooks/{notebook-id}/copySectionsToContentLibrary
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

- [OneNote Class Notebooks](https://www.onenote.com/classnotebook) (overview and features)
- [Work with staff notebooks](../howto/onenote-staffnotebook.md)
- [OneNote development](../howto/onenote-landing.md)
- [Get Onenote content and structure](../howto/onenote-get-content.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://stackoverflow.com/questions/tagged/onenote-api+onenote) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)
