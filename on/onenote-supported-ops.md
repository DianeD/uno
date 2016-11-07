---
ms.TocTitle: Supported operations
Title: Supported REST operations 
Description: Lists all REST operations that are supported by the OneNote API.
ms.ContentId: 55d9973a-316a-4ccf-8c47-59a36ad7b4f1
ms.topic: article (how-tos)
ms.date: April 5, 2015
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

<style>#operation {margin:5px 0px 0px 10px;} #description {margin:-11px 0px 5px 50px} .small {font-size:90%;}</style>


# Supported REST operations

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

This article lists the REST operations you can use with the OneNote API. Click an operation to try it with your own consumer notebooks on OneDrive from our [interactive Apigee console](../howto/onenote-landing.md#console).

<p id="top-padding">**In this article**</p>
<p id="indent">[Page operations](#pages)</p>
<p id="indent">[Section operations](#sections)</p>
<p id="indent">[Section group operations](#section-groups)</p>
<p id="indent">[Notebook operations](#notebooks)</p>
<p id="indent">[Resource operations](#resources)</p>


<a name="pages"></a>
## Page operations

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/pages`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpages%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all pages.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/pages?search`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22searchpages%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Search pages. <span class="small">(*Consumer OneDrive only*)</span></p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sections/{id}/pages`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getsectionpages%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all pages in a specific section.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sections/{id}/pages?pagelevel`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpagelevelandorder%22%2C%22params%22%3A%7B%22query%22%3A%7B%22pagelevel%22%3A%22true%22%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get the indentation level and order of pages in a section. [`GET /pages/{id}?pagelevel`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpage%22%2C%22params%22%3A%7B%22query%22%3A%7B%22pagelevel%22%3A%22true%22%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22undefined%22%3A%22%5Cu0001%5Cu0001%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D) is also supported.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/pages/{id}`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpage%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get a specific page.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/pages/{id}/preview`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpagepreview%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get text and image preview content for a specific page.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/pages/{id}/content`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getpagecontent%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Accept%22%3A%22text%2Fhtml%22%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get the HTML content of a specific page.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/pages`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createpage%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22multipart%2Fform-data%3B%20boundary%3DNewPart%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a page in the default section. <span class="small">(*Personal notebooks on OneDrive or OneDrive for Business only*)</span></p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/pages?sectionName`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createpage%22%2C%22params%22%3A%7B%22query%22%3A%7B%22sectionName%22%3A%22name%22%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22multipart%2Fform-data%3B%20boundary%3DNewPart%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a page in a named section in the default notebook. <span class="small">(*Personal notebooks on OneDrive or OneDrive for Business only*)</span></p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/sections/{id}/pages`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createpageinsection%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22multipart%2Fform-data%3B%20boundary%3DNewPart%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a page in a specific section.</p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/pages/{id}/copyToSection`</p>
<p id="description">Copy a page to a section. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![PATCH](images\onenote\patch.png)&nbsp;`/pages/{id}/content`</p>
<p id="description">Update the HTML content of a page.</p><!--POST /pages/{id}/patchcontent is also supported.-->

<p id="operation">[![DELETE](images\onenote\delete.png)&nbsp;`/pages/{id}`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22deletepage%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22delete%22%7D)</p>
<p id="description">Delete a specific page.</p>
<p id="description">**Warning!** Using the OneNote API to delete pages is permanent. Deleted pages cannot be recovered.</p>

<br />
Learn more about [*GET* requests](../howto/onenote-get-content.md) (including supported query string options) and how to [create pages](../howto/onenote-create-page.md), [update page content](../howto/onenote-update-page.md), and [copy pages](../howto/onenote-copy.md).

<a name="sections"></a>
## Section operations

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sections`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getallsections%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all sections.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/notebooks/{id}/sections`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getnotebooksections%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all sections in a specific notebook.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sectionGroups/{id}/sections`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getsectiongroupssections%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all sections in a specific section group.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sections/{id}`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getsection%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get a specific section.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/notebooks/{id}/sections`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createsectioninnotebook%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a section in a specific notebook.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/sectionGroups/{id}/sections`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createsectioninsectiongroup%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a section in a specific section group.</p>

<p id="operation">![PATCH](images\onenote\patch.png)&nbsp;`/sections/{id}`</p>
<p id="description">Change the name of a section. Send the new name using the *application/json* content type in the message body, like this: `{ "name": "New section name" }`</p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/sections/{id}/copyToNotebook`</p>
<p id="description">Copy a section to a notebook. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/sections/{id}/copyToSectionGroup`</p>
<p id="description">Copy a section to a section group. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/sections/{id}/permissions`</p>
<p id="description">Get [permissions](../howto/onenote-manage-perms.md) for the section. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/sections/{id}/permissions/{id}`</p>
<p id="description">Get a specific [permission](../howto/onenote-manage-perms.md) for the section. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/sections/{id}/permissions`</p>
<p id="description">Create or update a [permission](../howto/onenote-manage-perms.md) for the section. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![DELETE](images\onenote\delete.png)&nbsp;`/sections/{id}/permissions/{id}`</p>
<p id="description">Delete a [permission](../howto/onenote-manage-perms.md) for the section. <span class="small">(*Office 365 only*)</span></p>

<br />
Learn more about [*GET* requests](../howto/onenote-get-content.md) (including supported query string options) and how to [copy sections](../howto/onenote-copy.md).


<a name="section-groups"></a>
## Section group operations

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sectionGroups`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getallsectiongroups%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all section groups.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/notebooks/{id}/sectionGroups`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getnotebooksectiongroups%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all section groups in a specific notebook.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sectionGroups/{id}/sectionGroups`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getsectiongroupssectiongroups%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all section groups in a specific section group.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/sectionGroups/{id}`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getsectiongroup%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get a specific section group.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/notebooks/{id}/sectionGroups`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createsectiongroupinnotebook%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a section group in a specific notebook.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/sectionGroups/{id}/sectionGroups`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createsectiongroupinsectiongroup%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a section group in a specific section group.</p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/sectiongroups/{id}/permissions`</p>
<p id="description">Get [permissions](../howto/onenote-manage-perms.md) for the section group. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/permissions/{id}`</p>
<p id="description">Get a specific [permission](../howto/onenote-manage-perms.md) for the section group. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/permissions`</p>
<p id="description">Create or update a [permission](../howto/onenote-manage-perms.md) for the section group. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![DELETE](images\onenote\delete.png)&nbsp;`/permissions/{id}`</p>
<p id="description">Delete a [permission](../howto/onenote-manage-perms.md) for the section group. <span class="small">(*Office 365 only*)</span></p>

<br />
Learn more about [*GET* requests](../howto/onenote-get-content.md) (including supported query string options).


<a name="notebooks"></a>
## Notebook operations

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/notebooks`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getallnotebooks%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get all notebooks.</p>

<p id="operation">[![GET](images\onenote\get.png)&nbsp;`/notebooks/{id}`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22getnotebook%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%7D%2C%22body%22%3A%7B%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%7D%7D%2C%22verb%22%3A%22get%22%7D)</p>
<p id="description">Get a specific notebook.</p>

<p id="operation">[![POST](images\onenote\post.png)&nbsp;`/notebooks`](https://apigee.com/onenote/embed/console/onenote/?req=%7B%22resource%22%3A%22createnotebook%22%2C%22params%22%3A%7B%22query%22%3A%7B%7D%2C%22template%22%3A%7B%7D%2C%22headers%22%3A%7B%22Content-Type%22%3A%22application%2Fjson%22%7D%2C%22body%22%3A%7B%22undefined%22%3A%22%5Cu0001%5Cu0001%22%2C%22attachmentParamName%22%3A%22file%20attachment%22%2C%22attachmentFormat%22%3A%22mime%22%2C%22attachmentContentDisposition%22%3A%22form-data%22%2C%22bodyText%22%3A%22%7B%20name%3A%20%5C%22name%5C%22%20%7D%22%7D%7D%2C%22verb%22%3A%22post%22%7D)</p>
<p id="description">Create a notebook.</p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/notebooks/{id}/copyNotebook`</p>
<p id="description">Copy a notebook. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/notebooks/{id}/permissions`</p>
<p id="description">Get [permissions](../howto/onenote-manage-perms.md) for the notebook. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/permissions/{id}`</p>
<p id="description">Get a specific [permission](../howto/onenote-manage-perms.md) for the notebook. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![POST](images\onenote\post.png)&nbsp;`/permissions`</p>
<p id="description">Create or update a [permission](../howto/onenote-manage-perms.md) for the notebook. <span class="small">(*Office 365 only*)</span></p>

<p id="operation">![DELETE](images\onenote\delete.png)&nbsp;`/permissions/{id}`</p>
<p id="description">Delete a [permission](../howto/onenote-manage-perms.md) for the notebook. <span class="small">(*Office 365 only*)</span></p>

<br />
Learn more about [*GET* requests](../howto/onenote-get-content.md) (including supported query string options) and how to [copy notebooks](../howto/onenote-copy.md).

>Use the `classNotebooks` endpoint to [work with class notebooks](../howto/onenote-classnotebook.md) and the `staffNotebooks` endpoint to [work with staff notebooks](../howto/onenote-staffnotebook.md).


<a name="resources"></a>
## Resource operations

<p id="operation">![GET](images\onenote\get.png)&nbsp;`/resources/{id}/content`</p>
<p id="description">Get the binary content of an image or file resource.</p>

<br />
Learn more about [*GET* requests](../howto/onenote-get-content.md) and how to [add images and files to a page](../howto/onenote-images-files.md).



<a name="see-also"></a>
## Additional resources

- [Get OneNote content and structure](../howto/onenote-get-content.md)
- [Create OneNote pages](../howto/onenote-create-page.md)
- [Update OneNote page content](../howto/onenote-update-page.md)
- [Add images and files to OneNote pages](../howto/onenote-images-files.md)
- [Copy notebooks, sections, and pages](../howto/onenote-copy.md)
- [Input and output HTML for OneNote pages](../howto/onenote-input-output-html.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182)
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  

