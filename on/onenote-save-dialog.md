---
ms.Toctitle: Use the save dialog
title: Use the OneNote save dialog 
description: Learn how to use the OneNote save dialog, the quick and easy way to send web content to OneNote.
ms.ContentId: 919b5d94-5f13-44a0-8ad0-84595c1beb93
ms.date: November 18, 2015

---
[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]

<style>#indent {margin:2px 0px 0px 25px;}</style>

# Use the OneNote save dialog on your webpages

_**Applies to:** Consumer notebooks on OneDrive only_

The OneNote save dialog makes it easy for web developers to send webpages to OneNote. All you need to do is embed a URL with the necessary parameters, and the save dialog does the  
 authenticating and prompts the user to choose a destination.

## Preview the save dialog

Follow these steps to see the OneNote save dialog in action:
 
1. Copy the following anchor tag into the HTML of your own webpage.

    ```html
<a href="https://www.onenote.com/clipper/save?sourceUrl=http://dev.onenote.com/&
imgUrl=http://antyapps.pl/wp-content/uploads/2013/09/onenote-logo-630x347.jpg&
title=Use the OneNote save dialog on your webpages&
description=It's easy to send web content to OneNote with the OneNote save dialog!&
notes=Sending the OneNote Dev Center webpage to OneNote."
onclick="window.open(this.href, 'targetWindow', 'width=525, height=525'); return false;">
Try the OneNote save dialog</a>
    ```

2. Click the link. After you authenticate with your Microsoft account, you’ll see this dialog:

	![The OneNote save dialog](images\onenote\OneNoteSaveDialog.png)
    
3. Choose the notebook and section where you want to save the page, and click **Clip**. The dialog will save the OneNote Dev Center page.

We recommend that you launch the save dialog in a window whose dimensions are 525 x 525 pixels. If you’d like to create a button that uses the OneNote logo, see our [Branding guidelines](../howto/onenote-branding.md) for design help.

The next section breaks down the URL used in the link so you can construct your own.

## Construct the save dialog URL
 
The base URL for launching the OneNote save dialog is `https://www.onenote.com/clipper/save`

This is what the full URL looks like with placeholders for each of the query string parameters:

```
https://www.onenote.com/clipper/save?sourceUrl={url}&imgUrl={url}&title={text}&description={text}&notes={text}`
```

The following table describes each of the query string parameters. Only **sourceUrl** is required, but you should populate the **imgUrl**, **title**, and **description** parameters to ensure a good user experience.

| Parameter | Description |  
|------|------|  
| sourceUrl | Required<br /><br />The URL of the webpage that you want to send to OneNote. A screen shot of the page is added to the notebook and section that the user chooses. |  
| imgUrl | Recommended<br /><br />An image that appears in the upper-left corner of the save dialog after the user has authenticated. This image should provide a preview of the webpage or a visual cue to help the user verify the target page. This image isn't sent to OneNote. |  
| title | Recommended<br /><br />The title of the OneNote page. |  
| description | Recommended<br /><br />A description of the webpage. Like the image passed to the **imgUrl** parameter, this text should help the user verify the page. This text appears in the dialog but isn't sent to OneNote. Descriptions truncate after 90 characters. |  
| notes | Optional<br /><br />Notes about the webpage. This prepopulates the text box in the dialog. The user can also add notes in the dialog before sending the page. Notes are shown in OneNote. |  
 

<a name="see-also"></a>
## Additional resources

- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  
