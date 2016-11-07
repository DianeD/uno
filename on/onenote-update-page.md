﻿---
ms.Toctitle: Update page content
title: Update OneNote page content
description: Update the HTML content of OneNote pages.
ms.ContentId: f597bd73-866e-48a3-95c1-91b9bfabffa2
ms.date: November 18, 2015

---
[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]


# Update OneNote page content

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*


To update the content of a OneNote page, you send a PATCH request to the page's *content* endpoint:

<p id="indent">`PATCH ../notes/pages/{id}/content`</p>

Send a JSON change object in the message body. If the request is successful, the OneNote API returns a 204 HTTP status code.

<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL:

[!INCLUDE [service root url](../includes/onenote/service-root-url.md)]

Then append the page's *content* endpoint:

<p id="outdent1">**Get the page HTML and all defined *data-id* values**</p>
<p id="indent">`../pages/{id}/content`</p>

<p id="outdent1">**Get the page HTML, all defined *data-id* values, and all generated *id* values**</p>
<p id="indent">`../pages/{page-id}/content?includeIDs=true`</p>

The **data-id** and **id** values are used as **target** identifiers for the elements you want to update.

<br />
Your full request URI will look like one of these:

<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/pages/{id}/content`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myorganization/sitecollections/{id}/sites/{id}/notes/pages/{id}/content`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myorganization/groups/{id}/notes/pages/{id}/content`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="message-body"></a>
## Construct the message body

The HTML of a OneNote page contains text, images, and other content organized into structures such as **div**, **img**, and **ol** elements. To update OneNote page content, you add and replace HTML elements on the page.

Your changes are sent in the message body as an array of JSON change objects. Each object specifies the target element, new HTML content, and what to do with the content.

The following array defines two changes. The first inserts an image above a paragraph as a sibling, and the second appends an item to a list as a last child.

```
[
   {
    'target':'#para-id',
    'action':'insert',
    'position':'before',
    'content':'<img src="image-url-or-part-name" alt="Image above the target paragraph" />'
  }, 
  {
    'target':'#list-id',
    'action':'append',
    'content':'<li>Item at the end of the list</li>'
  }
]
```

See [more examples](#examples).


### Attributes for JSON change objects

Use the **target**, **action**, **position**, and **content** attributes to define JSON objects for PATCH requests.

**target**  
The element to update. The value must be one of the following identifiers:

| Identifier | Description |  
|------|------|  
| #{data-id} | <p>This ID is optionally defined on elements in the input HTML when [creating a page](..\howto\onenote-create-page.md) or [updating a page](..\howto\onenote-update-page.md). Prefix the value with a #.</p><p> Example: `'target':'#intro'` targets the element `<div data-id="intro" ...>`</p> |  
| id | <p>This is the [generated ID](#generated-ids) from the OneNote API, and is required for most replace operations. Do not prefix with a #.</p><p> Example: `'target':'div:{33f8a2...}{37}'` targets the element `<div id="div:{33f8a2...}{37}" ...>`</p><p>Don't confuse these with any **id** values defined in the [input HTML](..\howto\onenote-input-output-html.md). All **id** values sent in the input HTML are discarded.</p> |  
| body | The keyword that targets the first div on the page. Do not prefix with a #. |  
| title | The keyword that targets the page title. Do not prefix with a #. |  
 
**action**  
The action to perform on the target element. See [supported actions for elements](#support-matrix).

| Action | Description |  
|------|------|  
| append | <p>Adds the supplied content to the target as a first or last child, as determined by the **position** attribute.</p><p>Applies only to **body**, **div**, **ol**, and **ul** elements.</p> |  
| insert | Adds the supplied content as a sibling before or after the target, as determined by the **position** attribute. |  
| prepend | <p>Adds the supplied content to the target as a first child. Shortcut for **append** + **before**.</p><p>Applies only to **body**, **div**, **ol**, and **ul** elements.</p> |  
| replace | <p>Replaces the target with the supplied content.</p><p>Most **replace** actions require using the [generated ID](#generated-ids) for the target (except **img** and **object** elements within a div, which also support using **data-id**).</p> |  
 
**position**  
The location to add the supplied content, relative to the target element. Defaults to **after** if omitted.

| Position | Description |  
|------|------|  
| after (default) | <p>- With **append**: The last child of the target element.</p><p>- With **insert**: The subsequent sibling of the target element.</p> |
| before | <p>- With **append**: The first child of the target element.</p><p>- With **insert**: The preceding sibling of the target element.</p> |

**content**  
A string of well-formed HTML to add to the page, and any image or file binary data. If the content contains binary data, the request must be sent using the `multipart/form-data` content type with a "Commands" part (see an [example](#multipart)). 
 

<a name="generated-ids"></a>
### Generated IDs
The OneNote API generates **id** values for the elements on the page that can be updated. To get generated IDs, use the `includeIDs=true` query string expression in your GET request:

<p id="indent">`GET ../notes/pages/{page-id}/content?includeIDs=true`</p>

>The API discards all **id** values that are defined in the [input HTML](..\howto\onenote-input-output-html.md) of create-page and update-page requests.

The following example shows generated IDs for a paragraph and an image in the [output HTML](..\howto\onenote-input-output-html.md) of a page.

```html
<p id="p:{33f8a242-7c33-4bb2-90c5-8425a68cc5bf}{40}">Some text on the page</p>
<img id="img:{33f8a242-7c33-4bb2-90c5-8425a68cc5bf}{45}" ... />
```

Generated **id** values might change after a page update, so you should get the current values before building a PATCH request that uses them.
 
You can specify target elements by using the **data-id** or **id** value, as follows:

- For **append** and **insert** actions, you can use either ID as the target value.
- For **replace** actions, you must use the generated ID for all elements except for the page title and images and objects that are within a div. 
    - To replace a title, use the **title** keyword. 
    - To replace images and objects that are within a div, use either **data-id** or **id**.

The following example uses the **id** value for the target. Don't use the # prefix with a generated ID.

```
[
   {
    'target':'p:{33f8a242-7c33-4bb2-90c5-8425a68cc5bf}{40}',
    'action':'insert',
    'position':'before',
    'content':'<p>This paragraph goes above the target paragraph.</p>'
  }
]
```

<a name="support-matrix"></a>
## Supported elements and actions
Many elements on the page can be updated, but each element type supports specific actions. The following table shows supported target elements and the update actions that they support.

| Element | Replace | Append child | Insert sibling |  
|------|------|------|------|  
| body<br /> (targets first div on the page) | no | **yes** | no |  
| div<br /> ([absolute positioned](../howto/onenote-abs-pos.md)) | no | **yes** | no |  
| div<br /> (within a div) | **yes** (id only) | **yes** | **yes** |   
| img, object<br /> (within a div) | **yes** | no | **yes** |   
| ol, ul | **yes** (id only) | **yes** | **yes** |   
| table | **yes** (id only) | no | **yes** |   
| p, li, h1-h6 | **yes** (id only) | no | **yes** |   
| title | **yes** | no | no |  
 

The following elements do not support any update actions.

- img ([absolute positioned](../howto/onenote-abs-pos.md))
- object ([absolute positioned](../howto/onenote-abs-pos.md))
- tr, td
- meta
- head
- span
- a
- style tags


<a name="examples"></a>
## Example requests
An update request contains one or more changes represented as JSON change objects. These objects can define different targets on the page and different actions and content for the targets.

The following examples include JSON objects used in PATCH requests and complete PATCH requests:

[Append child elements](#append-examples)&nbsp;&nbsp;|&nbsp;&nbsp;[Insert sibling elements](#insert-examples)&nbsp;&nbsp;|&nbsp;&nbsp;[Replace elements](#replace-examples)&nbsp;&nbsp;|&nbsp;&nbsp;[Complete PATCH requests](#complete-requests)


<a name="append-examples"></a>
### Append child elements
The **append** action adds a child to a **body**, **div** (within a div), **ol**, or **ul** element. The **position** attribute determines whether to append the child before or after the target. The default position is **after**.

**Append to a div**

The following example adds two child nodes to the **div1** element. It adds an image as the first child and a paragraph as the last child. 

```
[
 {
    'target':'#div1',
    'action':'append',
    'position':'before',
    'content':'<img data-id="first-child" src="image-url-or-part-name" />'
  },
  {
    'target':'#div1',
    'action':'append',
    'content':'<p data-id="last-child">New paragraph appended to the div</p>'
  }
]
```
 

**Append to the *body* element**

You can use the **body** shortcut to append a child element inside the first div on any page.

The following example adds two paragraphs as the first child and the last child to the first div on the page. Don't use a # with the **body** target. This example uses the **prepend** action as a shortcut for **append** + **before**.

```
[
  {
    'target':'body',
    'action':'prepend',
    'content':'<p data-id="first-child">New paragraph as first child in the first div</p>'
  },
  {
    'target':'body',
    'action':'append',
    'content':'<p data-id="last-child">New paragraph as last child in the first div</p>'
  }
]
```
 

**Append to a list**

The following example adds a list item as a last child to the target list. The **list-style-type** property is defined because the item uses a non-default list style.

```
[
  {
    'target':'#circle-ul',
    'action':'append',
    'content':'<li style="list-style-type:circle">Item at the end of the list</li>'
  }
]
```
 

<a name="insert-examples"></a>
### Insert sibling elements
The **insert** action adds a sibling to the target element. The **position** attribute determines whether to insert the sibling before or after the target. The default position is **after**. See [elements that support **insert**](#support-matrix).

**Insert siblings**

The following example adds two sibling nodes to the page. It adds an image above the **para1** element and a paragraph below the **para2** element.

```none
[
  {
     'target':'#para1',
     'action':'insert',
     'position':'before',
     'content':'<img src="image-url-or-part-name" alt="Image inserted above the target" />'
  },
  {
    'target':'#para2',
     'action':'insert',
     'content':'<p data-id="next-sibling">Paragraph inserted below the target</p>'
  }
]
```
 

<a name="replace-examples"></a>
### Replace elements
You can use either the **data-id** or generated **id** as the target value to replace **img** and **object** elements that are within a div. To replace the page title, use the **title** keyword. For all other [elements that support **replace**](#support-matrix), you must use the generated ID.

**Replace an image**

The following example replaces an image with a div by using the image's **data-id** as the target. 

```
[
  {
    'target':'#img1',
    'action':'replace',
    'content':'<div data-id="new-div"><p>This div replaces the image</p></div>'
  }
]
```
 

**Update a table**

This example shows how to update a table by using its generated ID. Replacing **tr** and **td** elements is not supported, but you can replace the entire table.

```
[
  {
    'target':'table:{de3e0977-94e4-4bb0-8fee-0379eaf47486}{11}',
    'action':'replace',
    'content':'<table data-id="football">
      <tr><td><p><b>Brazil</b></p></td><td><p>Germany</p></td></tr>
      <tr><td><p>France</p></td><td><p><b>Italy</b></p></td></tr>
      <tr><td><p>Netherlands</p></td><td><p><b>Spain</b></p></td></tr>
      <tr><td><p>Argentina</p></td><td><p><b>Germany</b></p></td></tr></table>'
  }
]
```
 

**Change the title**

This example shows how to change the title of a page. To change the title, use the **title** keyword as the target value. Don't use a # with the title target.

```
[
  {
    'target':'title',
    'action':'replace',
    'content':'New title'
  }
]
```
 

**Update a to-do item**

The following example uses the replace action to change a to-do check box item to a completed state.

```
[
  {
    'target':'#task1',
    'action':'replace',
    'content':'<p data-tag="to-do:completed" data-id="task1">First task</p>'
  }
]
```

See [Use note tags](https://msdn.microsoft.com/library/office/mt159148.aspx) for more about using the **data-tag** attribute.


<a name="complete-requests"></a>
### Complete PATCH request examples
The following examples show complete PATCH requests.

**Request with text content only**  
The following example shows a PATCH request that uses the **application/json** content type. You can use this format when your content doesn't contain binary data.

```none
PATCH https://www.onenote.com/api/v1.0/me/notes/pages/{page-id}/content

Content-Type: application/json
Authorization: Bearer {token}

[
   {
    'target':'#para-id',
    'action':'insert',
    'position':'before',
    'content':'<img src="image-url" alt="New image from a URL" />'
  }, 
  {
    'target':'#list-id',
    'action':'append',
    'content':'<li>Item at the bottom of the list</li>'
  }
]
```
 
<a name="multipart"></a>
**Multipart request with binary content**  
The following example shows a multipart PATCH request that includes binary data. Multipart requests require a "Commands" part that specifies the **application/json** content type and contains the array of JSON change objects. Other data parts can contain binary data. Part names typically are strings appended with the current time in milliseconds or a random GUID.

```none
PATCH https://www.onenote.com/api/v1.0/me/notes/pages/{page-id}/content

Content-Type: multipart/form-data; boundary=PartBoundary123
Authorization: Bearer {token}

--PartBoundary123
Content-Disposition: form-data; name="Commands"
Content-Type: application/json

[
  {
    'target':'img:{2998967e-69b3-413f-a221-c1a3b5cbe0fc}{42}',
    'action':'replace',
    'content':'<img src="name:image-part-name" alt="New binary image" />'
  }, 
  {
    'target':'#list-id',
    'action':'append',
    'content':'<li>Item at the bottom of the list</li>'
  }
]

--PartBoundary123
Content-Disposition: form-data; name="image-part-name"
Content-Type: image/png

... binary image data ...

--PartBoundary123--
```

<a name="request-response-info"></a>
## Request and response information for PATCH requests

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authentication and permissions](..\howto\onenote-auth.md).</p> |  
| Content-Type header | <p>`application/json` for the array of JSON change objects, whether sent directly in the message body or in the required "Commands" part of [multipart requests](#multipart).</p><p>Multipart requests are required when sending binary data, and use the `multipart/form-data; boundary=part-boundary` content type, where *{part-boundary}* is a string that signals the start and end of each data part.</p> |  
 

| Response data | Description |  
|------|------|  
| Success code | A 204 HTTP status code. No JSON data is returned for a PATCH request. |  
| Errors | If the update request fails, the API returns errors in the **@api.diagnostics** object in the response body. The request will fail if:<br /> - The JSON object contains invalid attributes or is malformed.<br /> - The **target**, **action**, or **content** attributes are missing.<br /> - The target element does not exist.<br /> - The format of the target value is invalid. Example, a **data-id** isn't prefixed with a #.<br /> - The target element does not support the specified action.<br /> - The **action** or **position** value is invalid. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  
 

<a name="root-url"></a>
### Constructing the OneNote service root URL

[!INCLUDE [service root url section](../includes/onenote/service-root-section.md)]


<a name="permissions"></a>
## Permissions

To update OneNote pages, you'll need to request appropriate permissions. Choose the lowest level of permissions that your app needs to do its work.

[!INCLUDE [Update perms](../includes/onenote/update-perms.md)]

For more information about permission scopes and how they work, see [OneNote permission scopes](../howto/onenote-auth.md).
   

<a name="see-also"></a>
## Additional resources

- [Add images and files](../howto/onenote-images-files.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  
