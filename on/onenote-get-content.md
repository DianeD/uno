---
ms.TocTitle: Get content and structure
Title: Get OneNote content and structure 
Description: Get OneNote entities, hierarchy, and page and file content. Use OData query string options to filter your queries.
ms.ContentId: f3e2d1e6-0c62-4c22-bd8b-4dd378356502
ms.topic: article (how-tos)
ms.date: May 24, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

# Get OneNote content and structure with the OneNote API

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

To get OneNote content and structure, you send a GET request to the target endpoint. For example:

<p id="indent">`GET ../notes/pages/{id}`</p>

If the request is successful, the OneNote API returns a 200 HTTP status code and the entities or content that you requested. OneNote entities are returned as JSON objects that conform to the OData version 4.0 specification.

By using query string options, you can filter your queries and improve performance.


<a name="request-uri"></a>
## Construct the request URI

To construct the request URI, start with the service root URL:

[!INCLUDE [service root url](../includes/onenote/service-root-url.md)]

Then append the endpoint of the resource you want to retrieve. ([Resource paths](#resource-paths) are shown in the next section.)

<br />
Your full request URI will look like one of these examples:
<p id="indent">`https://www.onenote.com/api/v1.0/me/notes/notebooks/{id}/sections`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/pages`</p>
<p id="indent">`https://www.onenote.com/api/v1.0/myOrganization/groups/{id}/notes/pages?select=title,self`</p>

[!INCLUDE [service root url note](../includes/onenote/service-root-note.md)]


<a name="resource-paths"></a>
## Resource paths for GET requests

Use the following resource paths to get pages, sections, section groups, notebooks, and image or file resources.

[Page collection](#get-pages)&nbsp;&nbsp;|&nbsp;&nbsp;[Page entity](#get-page)&nbsp;&nbsp;|&nbsp;&nbsp;[Page preview](#get-page-preview)&nbsp;&nbsp;|&nbsp;&nbsp;[Page HTML content](#get-page-content)&nbsp;&nbsp;|&nbsp;&nbsp;
[Section collection](#get-sections)&nbsp;&nbsp;|&nbsp;&nbsp;[Section entity](#get-section)&nbsp;&nbsp;|&nbsp;&nbsp;[SectionGroup collection](#get-section-groups)&nbsp;&nbsp;|&nbsp;&nbsp;
[SectionGroup entity](#get-section-group)&nbsp;&nbsp;|&nbsp;&nbsp;[Notebook collection](#get-notebooks)&nbsp;&nbsp;|&nbsp;&nbsp;[Notebook entity](#get-notebook)&nbsp;&nbsp;|&nbsp;&nbsp;
[Image or other file resource](#get-resource)

<a name="get-pages"></a>
### Page collection

<p id="outdent1">Get pages (metadata) across all notebooks</p>
<p id="indent1">`../pages[?filter,orderby,select,expand,top,skip,search,count]`</p>

<p id="outdent1">Get pages (metadata) from a specific section</p>
<p id="indent1">`../sections/{section-id}/pages[?filter,orderby,select,expand,top,skip,search,count,pagelevel]`</p>

<br />
The `search` query string option is available for consumer notebooks only.

The default sort order for pages is `lastModifiedTime desc`.

The default query expands the parent section and selects the section's `id`, `name`, and `self` properties.

By default, only the top 20 entries are returned for *GET pages* requests. Requests that don't specify a **top** query string option return an **@odata.nextLink** link in the response that you can use to get the next 20 entries.

For the pages collection in a section, use **pagelevel** to return the indentation level of pages and their order within the section. Example: `GET ../sections/{section-id}/pages?pagelevel=true`.

- - -

<a name="get-page"></a> 
### Page entity

<p id="outdent1">Get the metadata for a specific page.</p>
<p id="indent1">`../pages/{page-id}[?select,expand,pagelevel]`</p>

<br />
Pages can expand the **parentNotebook** and **parentSection** properties.

The default query expands the parent section and selects the section's `id`, `name`, and `self` properties.

Use **pagelevel** to return the indentation level of the page and its order within its parent section. Example: `GET ../pages/{page-id}?pagelevel=true`.

- - -

<a name="get-page-preview"></a> 
### Page preview

<p id="outdent1">Get text and image preview content for a page</p>
<p id="indent1">`../pages/{page-id}/preview`</p>

<br />
The JSON response contains the preview content, which you can use to help users identify what's in the page.

```json
{
  "@odata.context":"https://www.onenote.com/api/v1.0/$metadata#Microsoft.OneNote.Api.PagePreview",
  "previewText":"text-snippet",
  "links":{
    "previewImageUrl":{
      "href":"https://www.onenote.com/api/v1.0/resources/{id}/content?publicAuth=true&mimeType=image/png"
    }
  }
}
```

The **previewText** property contains a text snippet from the page. The OneNote API returns complete phrases, up to a maximum of 300 characters. 

If the page has an image that can be used to build a preview UI, the **href** property in the **previewImageUrl** object contains a link to a public, pre-authenticated [image resource](#get-resource). You can use this link in HTML, for example: `<img src="https://www.onenote.com/api/v1.0/resources/{id}/content?publicAuth=true&mimeType=image/png" />`. Otherwise, **href** returns null.

- - -

<a name="get-page-content"></a> 
### Page HTML content

<p id="outdent1">Get the HTML content of a page</p>
<p id="indent1">`../pages/{page-id}/content[?includeIDs,preAuthenticated]`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(*learn more about [returned HTML content](../howto/onenote-input-output-html.md)*)</p>

<br />
Use the **includeIDs=true** query string option to get generated IDs used to [update the page](../howto/onenote-update-page.md).

Use the **preAuthenticated=true** query string option to get public URLs to the [image resources](#get-resource) that are on the page. The public URLs are valid for one hour. 

- - -

<a name="get-sections"></a>
### Section collection

<p id="outdent1">Get all sections from all notebooks that are owned by the user, including sections in nested section groups</p>
<p id="indent1">`../sections[?filter,orderby,select,top,skip,expand,count]`</p>

<p id="outdent1">Get all sections that are directly under a specific section group</p>
<p id="indent1">`../sectionGroups/{sectiongroup-id}/sections[?filter,orderby,select,top,skip,expand,count]`</p>

<p id="outdent1">Get all sections that are directly under a specific notebook</p>
<p id="indent1">`../notebooks/{notebook-id}/sections[?filter,orderby,select,top,skip,expand,count]`</p>

<br />
Sections can expand the **parentNotebook** and **parentSectionGroup** properties.

The default sort order for sections is `name asc`.

The default query expands the parent notebook and parent section group and selects their `id`, `name`, and `self` properties.

- - -

<a name="get-section"></a>
### Section entity

<p id="outdent1">Get a specific section</p>
<p id="indent1">`../sections/{section-id}[?select,expand]`</p>

<br />
Sections can expand the **parentNotebook** and **parentSectionGroup** properties.

The default query expands the parent notebook and parent section group and selects their `id`, `name`, and `self` properties.

- - -

<a name="get-section-groups"></a>
### SectionGroup collection

<p id="outdent1">Get all section groups from all notebooks that are owned by the user, including nested section groups</p>
<p id="indent1">`../sectionGroups[?filter,orderby,select,top,skip,expand,count]`</p>

<p id="outdent1">Get all section groups that are directly under a specific notebook</p>
<p id="indent1">`../notebooks/{notebook-id}/sectionGroups[?filter,orderby,select,top,skip,expand,count]`</p>

<br />
Section groups can expand the **sections**, **sectionGroups**, **parentNotebook**, and **parentSectionGroup** properties.

The default sort order for section groups is `name asc`.

The default query expands the parent notebook and parent section group and selects their `id`, `name`, and `self` properties.

- - -

<a name="get-section-group"></a>
### SectionGroup entity

<p id="outdent1">Get a specific section group</p>
<p id="indent1">`../sectionGroups/{sectiongroup-id}[?select,expand]`</p>

<br />
Section groups can expand the **sections**, **sectionGroups**, **parentNotebook**, and **parentSectionGroup** properties.

The default query expands the parent notebook and parent section group and selects their `id`, `name`, and `self` properties.

- - -

<a name="get-notebooks"></a>
### Notebook collection

<p id="outdent1">Get all the notebooks that are owned by the user</p>
<p id="indent1">`../notebooks[?filter,orderby,select,top,skip,expand,count]`</p>

<br />
Notebooks can expand the **sections** and **sectionGroups** properties.

The default sort order for notebooks is `name asc`. 

>You can use the `classNotebooks` endpoint to [get class notebooks](../howto/onenote-classnotebook.md).

- - -

<a name="get-notebook"></a>
### Notebook entity

<p id="outdent1">Get a specific notebook</p>
<p id="indent1">`../notebooks/{notebook-id}[?select,expand]`</p>

<br />
Notebooks can expand the **sections** and **sectionGroups** properties.

>You can use the `classNotebooks` endpoint to [get a class notebook](../howto/onenote-classnotebook.md).

- - -

<a name="get-resource"></a>
### Image or other file resource

<p id="outdent1">Get the binary data of a specific resource</p>
<p id="indent1">`../resources/{resource-id}/$value`</p>

<br />
You can find the file's resource URI in the page's [output HTML](..\howto\onenote-input-output-html.md).

For example, an **img** tag includes endpoints for the original image in the **data-fullres-src** attribute and the optimized image in the **src** attribute. Example:

```
<img 
    src="https://www.onenote.com/api/v1.0/me/notes/resources/{image-id}/$value"  
    data-src-type="image/png"
    data-fullres-src="https://www.onenote.com/api/v1.0/resources/{image-id}/$value"  
    data-fullres-src-type="image/png" ... />
```

And an **object** tag includes the endpoint for the file resource in the **data** attribute. Example:

```
<object
    data="http://www.onenote.com/api/v1.0/me/notes/resources/{file-id}/$value"
    data-attachment="fileName.pdf" 
    type="application/pdf" ... />
```

To get public, pre-authenticated URLs to the image resources on a page, include **preAuthenticated=true** in the query string when you [retrieve the page content](#get-page-content) (example: `GET ../pages/{page-id}/content?preAuthenticated=true`). The public URLs that are returned in the [output HTML](../howto/onenote-input-output-html.md#image-output-examples) are valid for one hour. Without this flag, retrieved images won't render directly in a browser because they are private and require authorization to retrieve them, like the rest of the page contents. 

Getting a collection of resources is not supported. 

When you get a file resource, you don't need to include an **Accept** content type in the request.

For more information about GET requests, see [GET Pages](http://dev.onenote.com/docs#/reference/get-pages), [GET Sections](http://dev.onenote.com/docs#/reference/get-sections), [GET SectionGroups](http://dev.onenote.com/docs#/reference/get-sectiongroups), and [GET Notebooks](http://dev.onenote.com/docs#/reference/get-notebooks) in the OneNote API interactive REST reference.


<a name="example"></a>
## Example GET requests
You can query for OneNote entities and search page content to get just the information you need. The following examples show some ways you can use [supported query string options](#query-options) in GET requests to the OneNote API. 

Remember:

- All GET requests start with the [service root URL](#request-uri).<br />&nbsp;&nbsp;Examples: `https://www.onenote.com/api/v1.0/me/notes`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`https://www.onenote.com/api/v1.0/myOrganization/siteCollections/{id}/sites/{id}/notes/`

- Spaces in the URL query string must use %20 encoding.<br />&nbsp;&nbsp;Example: `filter=title%20eq%20'biology'`

- Property names and OData string comparisons are case sensitive. We recommend using the OData **tolower** function for string comparisons.<br />&nbsp;&nbsp;Example: `filter=tolower(name) eq 'spring'`
 

**search & filter**  

Get all pages that contain the term *recipe* that were created by a specific app.  (`search` is available for consumer notebooks only)

```
[GET] ../pages?search=recipe&filter=createdByAppId eq 'WLID-000000004C12821A'
```
 
**search & select**  

Get the title, OneNote client links, and **contentUrl** link for all pages that contain the term *golgi app*.  (`search` is available for consumer notebooks only)

```
[GET] ../pages?search=golgi app&select=title,links,contentUrl
```
 
**expand**  

Get all notebooks and expand their sections and section groups.  

```
[GET] ../notebooks?expand=sections,sectionGroups
```
 
Get a specific section group and expand its sections and section groups.  

```
[GET] ../sectionGroups/{sectiongroup-id}?expand=sections,sectionGroups
```

Get a page and expand its parent section and parent notebook.

```
[GET] ../pages/{page-id}?expand=parentSection,parentNotebook
```

**expand** (multiple levels)  

Get all notebooks and expand their sections and section groups, and expand all sections in each section group.  

```
[GET] ../notebooks?expand=sections,sectionGroups(expand=sections)
```
 
>Expanding parents of child entities or expanding children of parent entities creates a circular reference and is not supported.

 
**expand & select** (multiple levels)  

Get the name and **self** link for a specific section group, and get the name and **self** links for all its sections.  

```
[GET] ../sectionGroups/{sectiongroup-id}?expand=sections(select=name,self)&select=name,self
```
 
Get the name and **self** link for all sections, and get the name and created time of each section's parent notebook.  

```
[GET] ../sections?expand=parentNotebook(select=name,createdTime)&select=name,self
```
 
Get the title and ID for all pages, and get the name of the parent section and parent notebook.

```
[GET] ../pages?select=id,title&expand=parentSection(select=name),parentNotebook(select=name)
```

**expand & levels** (multiple levels)  

Get all notebooks, sections, and section groups.  

```
[GET] ../notebooks?expand=sections,sectionGroups(expand=sections,sectionGroups(levels=max;expand=sections))
```
 
**filter**  

Get all sections that were created in October 2014.

```
[GET] ../sections?filter=createdTime ge 2014-10-01 and createdTime le 2014-10-31
```

Get the pages that were created by a specific app since January 1, 2015.

```
[GET] ../pages?filter=createdByAppId eq 'WLID-0000000048118631' and createdTime ge 2015-01-01
```

**filter & expand**  

Get all pages in a specific notebook. The API returns 20 entries by default.

```
[GET] ../pages?filter=parentNotebook/id eq '{notebook-id}'&expand=parentNotebook
```

Get the name and **pagesUrl** link for all sections from the *School* notebook. OData string comparisons are case sensitive, so use the **tolower** function as a best practice.

```
[GET] ../notebooks?filter=tolower(name) eq 'school'&expand=sections(select=name,pagesUrl)
```

**filter & select & orderby**   

Get the name and **pagesUrl** link for all sections that contain the term *spring* in the section name. Order sections by last modified date.

```
[GET] ../sections?filter=contains(tolower(name),'spring')&select=name,pagesUrl&orderby=lastModifiedTime desc
```
 
**orderby**  

Get the first 20 pages ordered by **createdByAppId** property and then by most recent created time. The API returns 20 entries by default.

```
[GET] ../pages?orderby=createdByAppId,createdTime desc
```

**search & filter & top**  

Get the five newest pages created since January 1, 2015 that contain the phrase *cell division*. The API returns 20 entries by default with a maximum of 100. The default sort order for pages is `lastModifiedTime desc`. (`search` is available for consumer notebooks only)

```
[GET] ../pages?search="cell division"&filter=createdTime ge 2015-01-01&top=5
```

**search & filter & top & skip**  

Get the next five pages in the result set. (`search` is available for consumer notebooks only)

```
[GET] ../pages?search=biology&filter=createdTime ge 2015-01-01&top=5&skip=5
```

And the next five. (`search` is available for consumer notebooks only)

```
[GET] ../pages?search=biology&filter=createdTime ge 2015-01-01&top=5&skip=10
```

>If both **search** and **filter** are applied to the same request, the results include only those entities that match both criteria.
 
**select**  

Get the name, created time, and **self** link for all sections in the user's notebooks.

```
[GET] ../sections?select=name,createdTime,self
```

Get the title, created time, and OneNote client links for a specific page.

```
[GET] ../pages/{page-id}?select=title,createdTime,links
```

**select & expand & filter** (multiple levels)  

Get the name and **pagesUrl** link for all sections in the user's default notebook.

```
[GET] ../notebooks?select=name&expand=sections(select=name,pagesUrl)&filter=isDefault eq true
```

**top & select & orderby**  

Get the title and **self** link for the first 50 pages, ordered alphabetically by title. The API returns 20 entries by default with a maximum of 100. The default sort order for pages is `lastModifiedTime desc`.

```
[GET] ../pages?top=50&select=title,self&orderby=title
```

**skip & top & select & orderby**  

Get pages 51 to 100. The API returns 20 entries by default with a maximum of 100.

```
[GET] ../pages?skip=50&top=50&select=title,self&orderby=title
```

>GET requests for pages that retrieve the default number of entries (that is, they don't specify a **top** expression) return an **@odata.nextLink** link in the response that you can use to get the next 20 entries.
 

<a name="query-options"></a>
## Supported OData query string options

When sending GET requests to the OneNote API, you can use OData query string options to customize your query and get just the information you need. They can also improve performance by reducing the number of calls to the service and the size of the response payload.

>For readability, the examples in this article don't use the %20 percent-encoding required for spaces in the URL query string: `filter=isDefault%20eq%20true`
 
| Query option | Example and description |  
|------|------|  
| count | <p>`count=true`</p><p>The count of entities in the collection. The value is returned in the **@odata.count** property in the response.</p> |  
| expand | <p>`expand=sections,sectionGroups`</p><p>The navigation properties to return inline in the response. The following properties are supported for **expand** expressions:<br /> - Pages: **parentNotebook**, **parentSection**<br /> - Sections: **parentNotebook**, **parentSectionGroup**<br /> - Section groups: **sections**, **sectionGroups**, **parentNotebook**, **parentSectionGroup**<br /> - Notebooks: **sections**, **sectionGroups**</p><p>By default, GET requests for pages expands **parentSection** and select the section's **id**, **name**, and **self** properties. Default GET requests for sections and section groups expand both **parentNotebook** and **parentSectionGroup**, and select the parents' **id**, **name**, and **self** properties. </p><p>Can be used for a single entity or a collection. Separate multiple properties with commas. Property names are case sensitive.</p> |   
| filter | <p>`filter=isDefault eq true`</p><p>A Boolean expression for whether to include an entry in the result set. Supports the following OData operators and functions:<br /> - Comparison operators: **eq**, **ne**, **gt**, **ge**, **lt**, **le**<br /> - Logical operators: **and**, **or**, **not**<br /> - String functions: **contains**, **endswith**, **startswith**, **length**, **indexof**, **substring**, **tolower**, **toupper**, **trim**, **concat**</p><p>[Property](#properties) names and OData string comparisons are case sensitive. We recommend using the OData **tolower** function for string comparisons. Example: `filter=tolower(name) eq 'spring'`</p> |  
| orderby | <p>`orderby=title,createdTime desc`</p><p>The [properties](#properties) to sort by, with an optional **asc** (default) or **desc** sort order. You can sort by any property of the entity in the requested collection.</p><p>The default sort order for notebooks, section groups, and sections is `name asc`, and for pages is `lastModifiedTime desc` (last modified page first).</p><p>Separate multiple properties with commas, and list them in the order that you want them applied. Property names are case sensitive.</p> |  
| search | <p>`search=cell div`</p><p>Available for consumer notebooks only.</p><p>The term or phrase to search for in the page title, page body, image alt text, and image OCR text. By default, search queries return results sorted by relevance.</p><p>OneNote uses Bing full-text search to support phrase search, stemming, spelling forgiveness, relevance and ranking, word breaking, multiple languages, and other full-text search features. Search strings are case insensitive.</p><p>Applies only to pages in notebooks owned by the user (not shared with the user). Indexed content is private and can only be accessed by the owner. Password-protected pages are not indexed. Applies only to the `pages` endpoint.</p> |  
| select | <p>`select=id,title`</p><p>The [properties](#properties) to return. Can be used for a single entity or for a collection. Separate multiple properties with commas. Property names are case sensitive.</p> |  
| skip | <p>`skip=10`</p><p>The number of entries to skip in the result set. Typically used for paging results.</p> |  
| top | <p>`top=50`</p><p>The number of entries to return in the result set, up to a maximum of 100. The default value is 20.</p> |  

OneNote also provides the `pagelevel` query string option you can use to get the level and order of pages within the parent section. Applies only to queries for pages in a specific section or queries for a specific page. For example: 

<p id="indent">`GET ../sections/{section-id}/pages?pagelevel=true`</p>
<p id="indent">`GET ../pages/{page-id}?pagelevel=true`</p>

### Supported OData operators and functions

The OneNote API supports the following OData operators and functions in **filter** expressions. When using OData expressions, remember:  
- Spaces in the URL query string must be replaced with the `%20` encoding.<br />&nbsp;&nbsp;Example: `filter=isDefault%20eq%20true`
- Property names and OData string comparisons are case sensitive. We recommend using the OData **tolower** function for string comparisons.<br />&nbsp;&nbsp;Example: `filter=tolower(name) eq 'spring'`

| Comparison operator | Example |  
|------|------|  
| eq<br />(equal to) | `createdByAppId eq '{app-id}'` |  
| ne<br />(not equal to) | `userRole ne 'Owner'` |  
| gt<br />(greater than) | `createdTime gt 2014-02-23` |  
| ge<br />(greater than or equal to) | `lastModifiedTime ge 2014-05-05T07:00:00Z` |  
| lt<br />(less than) | `createdTime lt 2014-02-23` |  
| le<br />(less than or equal to) | `lastModifiedTime le 2014-02-23` |  
 
| Logical operator | Example |  
|------|------|  
| and | `createdTime le 2014-01-30 and createdTime gt 2014-01-23` |  
| or | `createdByAppId eq '{app-id}' or createdByAppId eq '{app-id}'` |  
| not | `not contains(tolower(title),'school')` |  
 
| String function | Example |  
|------|------|   
| contains | `contains(tolower(title),'spring')` |  
| endswith | `endswith(tolower(title),'spring')` |  
| startswith | `startswith(tolower(title),'spring')` |  
| length | `length(title) eq 19` |  
| indexof | `indexof(tolower(title),'spring') eq 1` |  
| substring | `substring(tolower(title),1) eq 'spring'` |  
| tolower | `tolower(title) eq 'spring'` |  
| toupper | `toupper(title) eq 'SPRING'` |  
| trim | `trim(tolower(title)) eq 'spring'` |  
| concat | `concat(title,'- by MyRecipesApp') eq 'Carrot Cake Recipe - by MyRecipesApp'` |  
 

<a name="properties"></a>
## Page, section, section group, and notebook properties

The **filter**, **select**, **expand**, and **orderby** query expressions can include properties of OneNote entities. For example:

<p id="indent">`../sections?filter=createdTime ge 2015-01-01&select=name,pagesUrl&orderby=lastModifiedTime desc`</p>

Property names are case sensitive in query expressions.

For the list of properties and property types, see:

- [Pages](http://dev.onenote.com/docs#/reference/get-pages)
- [Sections](http://dev.onenote.com/docs#/reference/get-sections)
- [SectionGroups](http://dev.onenote.com/docs#/reference/get-sectiongroups)
- [Notebooks](http://dev.onenote.com/docs#/reference/get-notebooks)

The **expand** query string option can be used with the following navigation properties:

- Pages: **parentNotebook**, **parentSection**
- Sections: **parentNotebook**, **parentSectionGroup**
- Section groups: **sections**, **sectionGroups**, **parentNotebook**, **parentSectionGroup**
- Notebooks: **sections**, **sectionGroups**


<a name="request-response-info"></a>
## Request and response information for *GET* requests

| Request data | Description |  
|------|------|  
| Protocol | All requests use the SSL/TLS HTTPS protocol. |  
| Authorization header | <p>`Bearer {token}`, where *{token}* is a valid OAuth 2.0 access token for your registered app.</p><p>If missing or invalid, the request fails with a 401 status code. See [Authentication and permissions](..\howto\onenote-auth.md).</p> |  
| Accept header | <p>- `application/json` for OneNote entities and entity sets</p><p>- `text/html` for page content</p> | 

| Response data | Description |  
|------|------|  
| Success code | A 200 HTTP status code. |  
| Response body | An OData representation of the entity or entity set in JSON format, the page HTML, or file resource binary data.  |  
| Errors | If the request fails, the API returns [errors](../howto/onenote-error-codes.md) in the **@api.diagnostics** object in the response body. |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="root-url"></a>
### Constructing the OneNote service root URL

[!INCLUDE [service root url section](../includes/onenote/service-root-section.md)]


<a name="permissions"></a>
## Permissions for GET requests

To get OneNote content or structure, you'll need to request appropriate permissions. 

The following scopes allow GET requests to the OneNote API. Choose the lowest level of permissions that your app needs to do its work.

| Platform | Permission scope |  
|------|------|  
| Consumer | office.onenote, office.onenote_update_by_app, office.onenote_update |  
| Enterprise | Notes.Read, Notes.ReadWrite.CreatedByApp, Notes.ReadWrite, Notes.ReadWrite.All |  

For more information about permission scopes and how they work, see [OneNote permission scopes](../howto/onenote-auth.md).

<a name="see-also"></a>
## Additional resources

- [Input and output HTML for OneNote pages](../howto/onenote-input-output-html.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182)
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  