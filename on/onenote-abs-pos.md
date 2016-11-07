---
ms.TocTitle: Create absolute positioned elements
Title: Create absolute positioned elements 
Description: Create OneNote pages that contain div, img, and object elements that can be positioned independently.
ms.ContentId: 34933340-b850-49ac-a25a-8cfa12cd14ff
ms.topic: article (how-tos)
ms.date: November 30, 2015
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

# Create absolute positioned elements

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

The body of a OneNote page can contain multiple direct `div`, `img`, and `object` child elements that can be positioned independently on the page.

<p id="top-padding">**In this article**</p>
<p id="indent">[Attributes and positioning behavior](#attributes)</p>
<p id="indent">[Response information](#request-response-info)</p>
<p id="indent">[Permissions](#permissions)</p>

<a name="attributes"></a>
## Attributes and positioning behavior

Use the `data-absolute-enabled` and [`style`](#style-attributes) attributes to create absolute positioned elements on a page, as follows:

- The body element must specify `data-absolute-enabled="true"`. If omitted or set to `false`, all body content is rendered inside a `_default` absolute positioned div that the API creates, and all position settings are ignored.

- Only `div`, `img`, and `object` elements can be absolute positioned elements. 

- Absolute positioned elements must specify `style="position:absolute"`.

- Absolute positioned elements must be direct children of the `body` element. Any direct children of the body that aren't absolute positioned `div`, `img`, or `object` elements are rendered as static content inside the absolute positioned `_default` div.

- Absolute positioned elements are positioned at their specified top and left coordinates, relative to the 0:0 starting position at the top, left corner of the page above the title area.

- If an absolute positioned element omits the top or left coordinate, the missing coordinate is set to its default value: `top:120px` or `left:48px`. These default coordinates specify a position just below the title area. Be aware that omitting coordinates can result in elements that are stacked on top of each other.

- Absolute positioned elements cannot be nested or contain positioned elements. The API ignores any position settings specified on nested elements inside an absolute positioned div, renders the nested content inside the absolute positioned parent div, and returns a warning in the **api.diagnostics** property in the response.

<br />
**Example:** The following example contains a direct `p` child, an absolute positioned div, and a non-absolute positioned div.

   **Input HTML** 

   ```html 
   <body data-absolute-enabled="true">
       <p>This content will appear in the _default div.</p>
       <div style="position:absolute;top:175px;left:100px" data-id="div1">
         <p>This content will appear in an absolute positioned div.</p>
       </div>
       <div>
           <p>This content will also appear in the _default div.</p>
       </div>
   </body>
   ```

The API renders the non-absolute positioned div in the default div. Note that the nested  `<div>` tags are discarded because they do not define any semantic information (such as `data-id`).

**Output HTML**

   ```html 
   <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
       <div data-id="_default" style="position:absolute;left:48px;top:120px;width:624px">
           <p>This content will appear in the _default div.</p>
           <p>This content will also appear in the _default div.</p>
       </div>
       <div data-id="div1" style="position:absolute;left:99px;top:174px;width:624px">
           <p>This content will appear in an absolute positioned div.</p>
       </div>
   </body>
   ```

**Example:** The following example creates a page that contains one absolute positioned div and one absolute positioned image.

<br />
**Input HTML** 

```html 
<html>
    <head>
        <title>Page Title</title>
    </head>
    <body data-absolute-enabled="true">
        <div style="position:absolute;width:280px;top:120px;left:68px">
            <p>Some text</p>
            <img style="width:120px" src="http://officeimg.vo.msecnd.net/en-us/files/018/949/ZA103278226.png" />
            <div>
                <p>More text inside a regular, nested div</p>
            </div>
        </div>
        <img style="position:absolute;width:360px;top:350px;left:300px" src="http://officeimg.vo.msecnd.net/en-us/files/018/949/ZA103278226.png" />
    </body>
</html>
```
 
The OneNote API evaluates the input HTML and preserves all semantic content and any structural information that is supported by OneNote. The resulting page renders as shown in the following image (but without the visible borders for the div and image). 

![Resulting page with absolute positioned div and image](images\onenote\abs-pos.png)

Notice the changes to the non-contributing, nested div from the input HTML. The API preserves the div's content but discards the `<div>` tags because the div doesn't define semantic information (such as `data-id`).

For more information about how the OneNote API handles input and output HTML, see [Input and output HTML for OneNote pages](../howto/onenote-input-output-html.md).

<a name="style-attributes"></a>
### Supported CSS style attributes

All absolute positioned elements can specify top and left positions. Divs and images can specify width, and images can also specify height. For example:

```html
<img style="position:absolute;top:140px;left:95px;width:480px;height:665px" src="..." />
```

| Attribute | Supported element | Description |  
|:------|:------|:------|  
| top | div, img, object | The y-axis coordinate of the element's top border, in pixels only. Default is 120 pixels.<p>Example: `top:140px`</p> |  
| left |  div, img, object  | The x-axis coordinate of the element's left border, in pixels only. Default is 48 pixels.<p>Example: `left:95px`</p> |  
| width |  div, img  | The width of the element, in pixels only.<p>Example: `width:480px`</p> |  
| height | img | The height of the element, in pixels only. For divs, height is calculated at runtime and any specified height value is ignored.<p>Example: `height:665px`</p> |  
 
Other position attributes, such as `z-index`, are ignored. Absolute positioned images can use either the `data-render-src` or `src` attribute.


<a name="request-response-info"></a>
## Response information
The OneNote API returns the following information in the response.

| Response data | Description |  
|:------|:------|  
| Success code | A 201 HTTP status code for a successful POST request, and a 204 HTTP status code for a successful PATCH request. |  
| Errors or warnings | <p>You'll receive a warning in the **api.diagnostics** property of the response for any of the following conditions:</p><ul><li>The `style="position:absolute"` attribute is specified on an element, but the `body` element does not specify `data-absolute-enabled="true"`. All position settings are ignored.</li><li>The `style="position:absolute"` attribute is specified on an element that is not a direct child of the body element. If the element is a `div`, `img`, or `object`, make it a direct child of the body; otherwise the position settings will be ignored.</li><li>The `style="position:absolute"` attribute is specified on an element is not a `div`, `img`, and ``object` element.</li></ul> |  
| X-CorrelationId header | A GUID that uniquely identifies the request. You can use this value along with the value of the Date header when working with Microsoft support to troubleshoot issues. |  


<a name="permissions"></a>
## Permissions

To create or update OneNote pages, you'll need to request appropriate permissions. Choose the lowest level of permissions that your app needs to do its work.

**Permissions for _POST pages_**

[!INCLUDE [Create perms](../includes/onenote/create-perms.md)]

**Permissions for _PATCH pages_**

[!INCLUDE [Update perms](../includes/onenote/update-perms.md)]

For more information about permission scopes and how they work, see [OneNote permission scopes](../howto/onenote-auth.md).


<a name="see-also"></a>
## Additional resources

- [Create OneNote pages](../howto/onenote-create-page.md)
- [Update OneNote page content](../howto/onenote-update-page.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182)
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  


