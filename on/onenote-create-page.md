---
ms.TocTitle: Create pages
Title: Create OneNote pages
Description: Create OneNote pages in any section, and include images, files, and other content.
ms.ContentId: 0de322cc-570f-4afb-a313-b1d9c3d916f2
ms.topic: article (how-tos)
ms.date: May 17, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

# Create OneNote pages

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

To create a OneNote page, you send a POST request to a *pages* endpoint. For example:

<p id="indent">`POST ../notes/sections/{id}/pages`</p>

Send the HTML that defines the page in the message body. If the request is successful, the OneNote API returns a 201 HTTP status code.


<p id="top-padding">**In this article**</p>
<p id="indent">[Construct the request URI](#request-uri)</p>
<p id="indent">[Construct the message body](#message-body)</p>
<p id="indent">[Example request](#example)</p>
<p id="indent">[Request and response information](#request-response-info)</p>
<p id="indent">[Permissions](#permissions)</p>

>To learn about the POST requests you can send to create sections, section groups, and notebooks, see our [interactive REST reference](http://dev.onenote.com/docs).


<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL:

[!INCLUDE [service root url](../includes/onenote/service-root-url.md)]

Then append the *pages* endpoint:

<p id="outdent1">**Create a page in any section (specified by ID)**</p>
<p id="indent1">`../sections/{id}/pages`</p>

If you're creating pages in the user's personal notebook in OneDrive or OneDrive for Business, the OneNote API also provides endpoints you can use to create pages in the default notebook:

<p id="outdent1">**Create a page in the default section of the default notebook**</p>
<p id="indent1">`../me/notes/pages`</p>

<p id="outdent1">**Create a page in a section (specified by name) in the default notebook** (*[see rules](#post-pages-section-name)*)</p>
<p id="indent1">`../me/notes/pages?sectionName=Some%20section%20name`</p>


<br />
Your full request URI will look like one of these examples:
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/sections/{id}/pages?sectionName=Homework`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myorganization/sitecollections/{id}/sites/{id}/notes/sections/{id}/pages`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myorganization/groups/{id}/notes/sections/{id}/pages`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]

<a name="post-pages-section-name"></a>
### Using the *sectionName* URL parameter

The following rules apply when using the *sectionName* parameter to create a page in a named section in the default notebook:

- Only top-level sections can be referenced (not sections within section groups).

- If a section with the specified name doesn't exist in the default notebook, the API creates it. These characters are not allowed for section names: ? * \ / : &lt; &gt; | &amp; # " % ~

- Section names are case-insensitive for matching, but case is preserved when sections are created. So "My New Section" will display like that, but "my new section" would also match on subsequent posts.

- Section names must be URL-encoded. For example, spaces must be encoded as *%20*.

- The *sectionName* parameter is valid only with the `../notes/pages` route (not `../notes/sections/{id}/pages`).

Because sections are created if they don't exist, it's safe to use this call with every page your app creates. Users might rename sections, but the API will create a new section with the section name that you supply. Note that the links returned by the API for pages in a renamed section will still reach those older pages. 


<a name="message-body"></a>
## Construct the message body

The HTML that defines page content is called *input HTML*. Input HTML supports a [subset of standard HTML and CSS](#supported-html), with the addition of custom attributes. (Custom attributes, like **data-id** and **data-render-src**, are described in [Input and output HTML](..\howto\onenote-input-output-html.md).) 

Send the input HTML in the message body of the POST request. You can send the input HTML directly in the message body using the  `application/xhtml+xml` or `text/html` content type, or you can send it in the "Presentation" part of a multipart request. 

The following example sends the input HTML directly in the message body.

```
POST https://www.onenote.com/api/v1.0/me/notes/pages
Authorization: Bearer {token}
Content-Type: application/xhtml+xml

<!DOCTYPE html>
<html>
  <head>
    <title>A page with a block of HTML</title>
    <meta name="created" content="2015-07-22T09:00:00-08:00" />
  </head>
  <body>
    <p>This page contains some <i>formatted</i> <b>text</b> and an image.</p>
    <img src="http://..." alt="an image on the page" width="500" />
  </body>
</html>
```

If you're sending binary data, you must use a [multipart request](#example). 

>To simplify programming and consistency in your app, you can use multipart requests to create all pages. It's a good idea to use a library to construct multipart messages. This reduces the risk of creating malformed payloads.


<a name="input-html-rules"></a>
### Requirements and limitations for input HTML in *POST pages* requests

When sending input HTML, be aware of these general requirements and limitations:  

- Input HTML should be UTF-8 encoded and well-formed XHTML. All container start tags require matching closing tags. All attribute values must be surrounded by double- or single-quote marks.  <!--docs say MUST be encoded-->

- JavaScript code, included files, and CSS are removed. 

- HTML forms are removed in their entirety.  

- The OneNote API supports a [subset of HTML elements](#supported-html). 

- The OneNote API supports a subset of common HTML attributes and a set of custom attributes, such as the **data-id** attribute used for updating pages. See [Input and output HTML](..\howto\onenote-input-output-html.md) for supported attributes.


<a name="supported-html"></a>
### Supported HTML and CSS for OneNote pages

Not all elements, attributes, and properties are supported (in HTML4, XHTML, CSS, HTML5, etc.). Instead, the OneNote API accepts a limited set of HTML that better fits how people use OneNote. For more information, see [HTML tag support for pages](http://dev.onenote.com/docs#/introduction/html-tag-support-for-pages). If a tag's not listed there, it'll probably be ignored.

<!--The OneNote API only accepts UTF-8 data. Be sure that all requests are encoded that way, and your content-type headers indicate that as well. xx our examples don't show this-->

The following list shows the basic element types that the OneNote API supports:

<p id="indent">`<head>` and `<body>`</p>
<p id="indent">`<title>` and `<meta>` that set the page title and creation date</p>
<p id="indent">`<h1>` through `<h6>` for section headings</p>
<p id="indent">`<p>` for paragraphs</p>
<p id="indent">`<ul>`, `<ol>`, and `<li>` for lists and list items</p>
<p id="indent">`<table>`, `<tr>` and `<td>`, including nested tables</p>
<p id="indent">`<pre>` for preformatted text (preserves white space and line breaks)</p>
<p id="indent">`<b>` and `<i>` for bold and italic character styles</p>

The OneNote API preserves the semantic content and basic structure of the input HTML when it creates pages, but it converts the input HTML to use the supported set of HTML and CSS. Features that don't exist in OneNote have nothing to be translated to, so they might not be recognized in the source HTML. 


<a name="example"></a>
## Example request

This example multipart request creates a page that contains images and an embedded file. The required **Presentation** part contains the input HTML that defines the page. The **imageBlock1** part contains the binary image data 
 and **fileBlock1** contains the binary file data. Data parts can also contain HTML, in which case the OneNote API [renders the HTML as an image](../howto/onenote-images-files.md#image-img-binary-data-render-src) on the OneNote page. 

```
POST https://www.onenote.com/api/v1.0/me/notes/pages
Authorization: Bearer {token}
Content-Type: multipart/form-data; boundary=MyPartBoundary198374

--MyPartBoundary198374
Content-Disposition:form-data; name="Presentation"
Content-Type:text/html

<!DOCTYPE html>
<html>
  <head>
    <title>A page with rendered images and an attached file</title>
    <meta name="created" content="2015-07-22T09:00:00-08:00" />
  </head>
  <body>
    <p>Here's an image from an <i>online source</i>:</p>
    <img src="http://..." alt="an image on the page" width="500" />
    <p>Here's an image uploaded as <b>binary data</b>:</p>
    <img src="name:imageBlock1" alt="an image on the page" width="300" />
    <p>Here's a file attachment:</p>
    <object data-attachment="FileName.pdf" data="name:fileBlock1" type="application/pdf" />
  </body>
</html>

--MyPartBoundary198374
Content-Disposition:form-data; name="imageBlock1"
Content-Type:image/jpeg

... binary image data ...

--MyPartBoundary198374
Content-Disposition:form-data; name="fileBlock1"
Content-Type:application/pdf

... binary file data ...

--MyPartBoundary198374--
```

For more examples that show how to create pages that contain images and other files, see [Add images and files](..\howto\onenote-images-files.md), our [tutorials](../howto/onenote-tutorial.md), and our [samples](https://github.com/onenotedev). Also, learn how to [create absolute positioned elements](../howto/onenote-abs-pos.md), [use note tags](../howto/onenote-note-tags.md), and [extract data](../howto/onenote-extract-data.md) for business card captures and online recipe and product listings.

The OneNote API is strict about some formats, such as CRLF newlines in a multipart message body. To reduce the risk of creating malformed payloads, you should use a library to construct multipart messages. 
 If you do receive a 400 status for a malformed payload, check the formatting of newlines and whitespaces, and check for encoding issues. For example, try using `charset=utf-8` (example: `Content-Type: text/html; charset=utf-8`).

See [requirements and limitations for input HTML](#input-html-rules) and [size limits for POST requests](..\howto\onenote-images-files.md#size-limits).


<a name="request-response-info"></a>
## Request and response information for *POST pages* requests

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authentication and permissions](..\howto\onenote-auth.md).</p> |  
| Content-Type header | <p>`text/html` or `application/xhtml+xml` for the HTML content, whether it's sent directly in the message body or in the required "Presentation" part of multipart requests.</p><p>Multipart requests are required when sending binary data, and use the `multipart/form-data; boundary=part-boundary` content type, where *{part-boundary}* is a string that signals the start and end of each data part.</p> |  
| Accept header | `application/json` | 

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code. |  
| Response body | A OData representation of the new page in JSON format. |  
| Errors | If the request fails, the API returns errors in the **@api.diagnostics** object in the response body. |  
| Location header | The resource URL for the new page. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="root-url"></a>
### Constructing the OneNote service root URL

[!INCLUDE [service root url section](../includes/onenote/service-root-section.md)]


<a name="permissions"></a>
## Permissions

To create OneNote pages, you'll need to request appropriate permissions. Choose the lowest level of permissions that your app needs to do its work.

[!INCLUDE [Create perms](../includes/onenote/create-perms.md)] 

For more information about permission scopes and how they work, see [OneNote permission scopes](../howto/onenote-auth.md).

<a name="see-also"></a>
## Additional resources

- [Add images and files](../howto/onenote-images-files.md)
- [Create absolute positioned elements](../howto/onenote-abs-pos.md)  
- [Extract data](../howto/onenote-extract-data.md)
- [Use note tags](../howto/onenote-note-tags.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)


