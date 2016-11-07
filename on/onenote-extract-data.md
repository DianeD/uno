---
ms.Toctitle: Extract data
title: Extract data from captures 
description: Use the OneNote API to augment and transform content for a business card, online recipe, or online product listing.
ms.ContentId: 901068e3-1d4d-4233-856b-5a2a71cc58c2
ms.date: January 19, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

<style>#simpletable {margin:-5px 0px 0px 0px; border:none;} #simplecell {border:none; padding:15px 20px; background-color:white;} .rightalign {text-align:right; padding: 0px 20px 0px 0px;}</style>

# Extract data from captures

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

Use the OneNote API to extract business card data from an image, or recipe and product data from a URL.

<a name="attributes"></a>
## Extraction attributes

To extract and transform data, simply include a div that specifies the source content, extraction method, and fallback behavior in your [create-page](../howto/onenote-create-page.md) or [update-page](../howto/onenote-update-page.md) request. The API renders extracted data on the page in an easy-to-read format. 

```
<div
  data-render-src="image-or-url"
  data-render-method="extraction-method"
  data-render-fallback="fallback-action">
</div>
```

**data-render-src**

The content source. This can be an image of a business card or an absolute URL from many popular recipe or product websites. Required.

For best results when specifying a URL, use the canonical URL defined in the HTML of the source webpage, if one is defined. For example, a canonical URL might be defined in the source webpage like this:

<p id="indent">`<link rel="canonical" href="www.domainname.com/page/123/size12/type987" />`</p>


**data-render-method**

The extraction method to run. Required.

| Value | Description |
|:------|:------|
| extract.businesscard | A business card extraction. |
| extract.recipe | A recipe extraction. |
| extract.product | A product listing extraction. |
| extract | An unknown extraction type. |

For best results, specify the content type (`extract.businesscard`, `extract.recipe`, or `extract.product`) if you know it. If the type is unknown, use the `extract` method and the OneNote API will try to auto-detect the type.

**data-render-fallback**

The fallback behavior if the extraction fails. Defaults to **render** if omitted. 

| Value | Description |
|:------|:------|
| render | Renders the source image or a snapshot of the recipe or product webpage. |
| none | Does nothing.<br />This option is useful if you want to always include a snapshot of the business card or webpage on the page in addition to any extracted content. Be sure to send a separate `img` element in the request, as shown in the examples. |

<a name="biz-card"></a>
## Business card extractions

The OneNote API tries to find and render the following contact information based on an image of a person's or company's business card.

<table role="presentation" id="simpletable">
<tr>
<td id="simplecell">Name<br /><br />Title<br /><br />Organization<br /><br />Phone and fax numbers<br /><br />Mailing and physical addresses<br /><br />Email addresses<br /><br />Websites<br /></td>
<td id="simplecell" class="rightalign">![An example business card extraction.](images\onenote\biz-card-extraction.png)</td>
</tr>
</table>

A vCard (.VCF file) with the extracted contact information is also embedded in the page. The vCard is a convenient way to get the contact information when retrieving page HTML content.

### Common scenarios for business card extractions

**Extract business card information, and also render the business card image**

Specify the `extract.businesscard` method and the `none` fallback. Also send an `img` element with the `src` attribute that also references the image. If the API is unable to extract any content, it renders the business card image only.

```html 
<div
    data-render-src="name:scanned-card-image"
    data-render-method="extract.businesscard"
    data-render-fallback="none">
</div>
<img src="name:scanned-card-image" />
```

<br />
**Extract business card information, and render the business card image only if the extraction fails**

Specify the `extract.businesscard` method and use the default `render` fallback. If the API is unable to extract any content, it renders the business card image instead.

```html
<div
    data-render-src="name:scanned-card-image"
    data-render-method="extract.businesscard">
</div>
```
 
For business card extractions, the image is sent as a named part in a multipart request. See [Add images and files](../howto/onenote-images-files.md) for examples that show how to send an image in a request.


<a name="recipe"></a>
## Recipe extractions

The OneNote API tries to find and render the following information based on a recipe's URL.


<table role="presentation" id="simpletable">
<tr>
<td id="simplecell">Hero image<br /><br />Rating<br /><br />Ingredients<br /><br />Instructions<br /><br />Prep, cook, and total times<br /><br />Servings</td>
<td id="simplecell" class="rightalign">![An example recipe extraction.](images\onenote\recipe-extraction.png)</td>
</tr>
</table>

The API is optimized for recipes from many popular sites such as *Allrecipes.com*, *FoodNetwork.com*, and *SeriousEats.com*.

### Common scenarios for recipe extractions

**Extract recipe information, and also render a snapshot of the recipe webpage**

Specify the `extract.recipe` method and the `none` fallback. Also send an `img` element with the `data-render-src` attribute set to the recipe URL. If the API is unable to extract any content, it renders a snapshot of the recipe webpage only.

This scenario potentially provides the most information because the webpage may include additional information, such as customer reviews and suggestions.

```html 
<div
    data-render-src="http://allrecipes.com/recipe/guacamole/"
    data-render-method="extract.recipe"
    data-render-fallback="none">
</div>
<img data-render-src="http://allrecipes.com/recipe/guacamole/" />
```
 
<br />
**Extract recipe information, and render a snapshot of the recipe webpage only if the extraction fails**

Specify the `extract.recipe` method and use the default render fallback. If the API is unable to extract any content, it renders a snapshot of the recipe webpage instead.

```html  
<div
    data-render-src="http://www.foodnetwork.com/recipes/alton-brown/creme-brulee-recipe.html"
    data-render-method="extract.recipe">
</div>
```

<br />
**Extract recipe information, and also render a link to the recipe**

Specify the `extract.recipe` method and the `none` fallback. Also send an `a` element with the `src` attribute set to the recipe URL (or you can send any other information you want to add to the page). If the API is unable to extract any content, only the recipe link is rendered.

```html  
<div
    data-render-src="http://www.seriouseats.com/recipes/2014/09/diy-spicy-kimchi-beef-instant-noodles-recipe.html"
    data-render-method="extract.recipe"
    data-render-fallback="none">
</div>
<a href="http://www.seriouseats.com/recipes/2014/09/diy-spicy-kimchi-beef-instant-noodles-recipe.html">Recipe URL</a>
``` 


<a name="product"></a>
## Product listing extractions

<table role="presentation" id="simpletable">
<tr>
<td id="simplecell">Title<br /><br />Rating<br /><br />Primary image<br /><br />Description<br /><br />Features<br /><br />Specifications</td>
<td id="simplecell" class="rightalign">![An example product listing extraction.](images\onenote\product-extraction.png)</td>
</tr>
</table>

The API is optimized for products from many popular sites such as *Amazon.com* and *HomeDepot.com*.

### Common scenarios for recipe extractions

**Extract product information, and also render a snapshot of the product webpage**

Specify the `extract.product` method and the `none` fallback. Also send an `img` element with the `data-render-src` attribute set to the product URL. If the API is unable to extract any content, it renders a snapshot of the product webpage only.

This scenario potentially provides the most information because the webpage may include additional information, such as customer reviews and suggestions.

```html 
<div
    data-render-src="http://www.amazon.com/Microsoft-Band-Small/dp/B00P2T2WVO"
    data-render-method="extract.product"
    data-render-fallback="none">
</div>
<img data-render-src="http://www.amazon.com/Microsoft-Band-Small/dp/B00P2T2WVO" />
```

<br />
**Extract product information, and render a snapshot of the product webpage only if the extraction fails**

Specify the `extract.product` method and use the default render fallback. If the API is unable to extract any content, it renders a snapshot of the product webpage instead.

```html 
<div
    data-render-src="http://www.sears.com/craftsman-19hp-42-8221-turn-tight-174-hydrostatic-yard-tractor/p-07120381000P"
    data-render-method="extract.product">
</div>
```
 
<br />
**Extract product information, and also render a link to the product**

Specify the `extract.product` method and the `none` fallback. Also send an `a` element with the `src` attribute set to the product URL (or you can send any other information you want to add to the page). If the API is unable to extract any content, only the page link is rendered.

```html 
<div
    data-render-src="http://www.homedepot.com/p/Active-Ventilation-5-Watt-Solar-Powered-Exhaust-Attic-Fan-RBSF-8-WT/204203001"
    data-render-method="extract.product"
    data-render-fallback="none">
</div>
<a href="http://www.homedepot.com/p/Active-Ventilation-5-Watt-Solar-Powered-Exhaust-Attic-Fan-RBSF-8-WT/204203001">Product URL</a>
```


<a name="unknown"></a> 
## Unknown content type extractions

If you don't know the content type (business card, recipe, or product) that you're sending, you can use the unqualified `extract` method and let the OneNote API automatically detect the type. You might want to do this if your app sends different capture types.

>If you do know the content type that you're sending, you should use the `extract.businesscard`, `extract.recipe`, or `extract.product` method. In some cases, this can help to optimize the extraction results.
 
### Common scenarios for unknown extractions

**Send an image or a URL, and render the supplied image or a snapshot of the webpage if the extraction fails**

Specify the `extract` method so the API automatically detects the content type, and use the default render fallback. If the API is unable to extract any content, it renders the supplied image or snapshot of the webpage instead.

```html 
<div
    data-render-src="some image or url"
    data-render-method="extract">
</div>
```


<a name="request-response-info"></a>
## Response information

| Response data | Description |  
|------|------|  
| Success code | A 201 HTTP status code for a successful POST request, and a 204 HTTP status code for a successful PATCH request. |  
| Errors or warnings | <p>If the extraction fails, the API processes as much of the request as possible and returns a 20136 warning code in the **@api.diagnostics** property in the response body. The extraction will fail if:<br /> - The required `data-render-src` or `data-render-method` attributes are missing.<br /> - The `data-render-src`, `data-render-method`, or `data-fallback-method` values are empty or invalid.</p><p>Sometimes the API can extract only part of the target content even when it is available. In this case, the service processes as much of the request as possible but does not return a warning.</p> |  
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
- [Add images and files](../howto/onenote-images-files.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182)
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  


