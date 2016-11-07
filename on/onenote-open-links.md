---
ms.Toctitle: Open the OneNote clients
title: Open the OneNote clients 
description: Use the **links** property to open OneNote pages and notebooks in OneNote Online or the native client.
ms.ContentId: 445543de-14db-4a53-bf2c-356d233e71fd
ms.date: November 18, 2015

---
[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

# Open the OneNote clients

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

You can use the **links** property of a page or notebook to open OneNote to the particular page or notebook. 

The **links** property is a JSON object that contains two URLs:

``` 
{ 
    "links": {
        "oneNoteClientUrl": {
            "href": "onenote:https://..."
        },
        "oneNoteWebUrl": {
            "href": "https://..."
        }
    }
}
```

The URLs will open the page or notebook in the native OneNote client application or in OneNote Online.

<p id="outdent">**oneNoteClientUrl**</p>
<p id="indent">Opens the native client if it is already installed on the device. This URL includes the *onenote* prefix.<br />Opens the language-specific version if one is installed on the device. Otherwise, uses the platform language setting.</p> 

<p id="outdent">**oneNoteWebUrl**</p>
<p id="indent">Opens OneNote Online if the default browser on the device supports OneNote Online.<br />Uses the browser language setting.</p>

<br />
The OneNote API returns the **links** property in the HTTP response for the following operations:

- Create a page by sending a [`POST pages`](../howto/onenote-create-page.md) request
- Create a notebook by sending a `POST notebooks` request
- Get page metadata by sending a [`GET pages`](../howto/onenote-get-content.md#get-pages) or [`GET pages/{id}`](../howto/onenote-get-content.md#get-page) request
- Get notebook metadata by sending a [`GET notebooks`](../howto/onenote-get-content.md#get-notebooks) or [`GET notebooks/{id}`](../howto/onenote-get-content.md#get-notebook) request

The following examples show how to check the status code of the response, parse the JSON to extract the URLs, and then open the client.

## iOS example

The following example gets the OneNote client URLs from the JSON response. It uses the AFNetworking library (http://afnetworking.com/) to extract the two URLs. In the example, **created** is a pointer to the ONSCPSStandardResponse object used to store the response values, and **responseObject** holds the parsed JSON.

```
    /* Import the JSON library */
    #import "AFURLRequestSerialization.h"

    - (void)connectionDidFinishLoading:(NSURLConnection *)connection {
            if(delegate) {
                  int status = [returnResponse statusCode];
                  ONSCPSStandardResponse *standardResponse = nil;
                  if (status == 201) {
                        ONSCPSCreateSuccessResponse *created = 
                              [[ONSCPSCreateSuccessResponse alloc] init];
                        created.httpStatusCode = status;
                        NSError *jsonError;
                        NSDictionary *responseObject = 
                              [NSJSONSerialization JSONObjectWithData:returnData options:0 error:&jsonError];
                        if(responseObject && !jsonError) {
                              created.oneNoteClientUrl = ((NSDictionary *)
                                    ((NSDictionary *)responseObject[@"links"])[@"oneNoteClientUrl"])[@"href"];
                              created.oneNoteWebUrl = ((NSDictionary *)
                                    ((NSDictionary *)responseObject[@"links"])[@"oneNoteWebUrl"])[@"href"];
                        }
                  standardResponse = created;
                  }
                  else {
                        ONSCPSStandardErrorResponse *error = [[ONSCPSStandardErrorResponse alloc] init];
                        error.httpStatusCode = status;
                        error.message = [[NSString alloc] initWithData:returnData 
                              encoding:NSUTF8StringEncoding];
                        standardResponse = error;
                  }
                  // Send the response back to the client.
                  if (standardResponse) {
                        [delegate exampleServiceActionDidCompleteWithResponse: standardResponse];
                  }
            }
      }
``` 

Now that you've parsed the URLs from the response, you can open OneNote by using the following code. Use **oneNoteClientUrl** to open the installed OneNote client or **oneNoteWebURL** to open OneNote Online.

```objective-c
NSURL *url = [NSURL URLWithString:standardResponse.oneNoteWebUrl];
[[UIApplication sharedApplication] openURL:url];
```

## Android example

First, check for the success status code and then parse the JSON. The example assumes a POST request was sent, so it checks for a 201 status code. If you made a GET request, check for a 200 status code instead.

```java
public ApiResponse getResponse() throws Exception {
    /* Get the HTTP response code and message from the connection object */
    int responseCode = mUrlConnection.getResponseCode();
    String responseMessage = mUrlConnection.getResponseMessage();
    String responseBody = null;

    /* Get the response if the new page was created successfully. */
    if ( responseCode == 201) {
        InputStream is = mUrlConnection.getInputStream();

        /* Verify that this byte array is big enough. */
        byte[] b1 = new byte[1024];
        StringBuffer buffer = new StringBuffer();

        /* Copy the body of the response into the new string. */
        /* Make sure the buffer is big enough. */
        while ( is.read(b1) != -1)
            buffer.append(new String(b1));

      /* When the returned data is complete, close the connection 
         and convert the byte array into a string. */
        mUrlConnection.disconnect();
        responseBody =  buffer.toString();
    }

    /* Create a new JSON object, and an object to hold the response URLs. */
    JSONObject responseObject = null;
    ApiResponse response = new ApiResponse();
    try {

        /* Store and verify the HTTP response code. */
        response.setResponseCode(responseCode);
        response.setResponseMessage(responseMessage);
        if ( responseCode == 201) {

            /* Retrieve the two URLs from the links property. */
            responseObject = new JSONObject(responseBody);
            String clientUrl = responseObject.getJSONObject(
                "links").getJSONObject("oneNoteClientUrl").getString("href");
            String webUrl = responseObject.getJSONObject(
                "links").getJSONObject("oneNoteWebUrl").getString("href");
            response.setOneNoteClientUrl(clientUrl);
            response.setOneNoteWebUrl(webUrl);
        }
    } catch (JSONException ex) {

        /* If the JSON was malformed or incomplete... */
        String msg = ex.getMessage();
        msg = msg;
    }
    return response;
}
```

Using the response properties, your app can open OneNote Online, as shown in the following example.

```java 
if (response.getResponseCode() == 201) {
    Uri uriUrl = Uri.parse(response.getOneNoteWebUrl);  
    Intent launchBrowser = new Intent(Intent.ACTION_VIEW, uriUrl); 
    startActivity(launchBrowser);
}
```
 
Or your app can open the native OneNote client on an Android device. When using the **oneNoteClientUrl** property, you must surround the GUID strings with braces `{ }` before starting the Intent. The following example shows how to do that.

```java 
if (response.getResponseCode() == 201) {

    // Get the URL from the OneNote API JSON response.
    String onenoteClientUrl = obtainClientLinkFromJSONResponse();
    String androidClientUrl = 
        onenoteClientUrl.replaceAll(
            "=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&",
            "={$1}&");

    // Open the URL: Open the newly created OneNote page.
    Uri uriUrl = Uri.parse(androidClientUrl);  
    Intent launchBrowser = new Intent(Intent.ACTION_VIEW, uriUrl); 
    startActivity(launchBrowser);
}
```

<a name="see-also"></a>
## Additional resources

- [Get OneNote content and structure](../howto/onenote-get-content.md)
- [Create OneNote pages](../howto/onenote-create-page.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)
