---
ms.TocTitle: Subscribe for webhooks
Title: Subscribe for webhooks to get change notifications
Description: Keep up-to-date with changes that your users make in OneNote by subscribing for webhooks.
ms.ContentId: 0793a8f9-4805-4666-9d45-3b79c278d765
ms.topic: article (how-tos)
ms.date: February 2, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]


# Subscribe for webhooks to get change notifications

*__Applies to:__ Consumer notebooks on OneDrive*

Keep up-to-date with changes that your users make in OneNote by subscribing to the Webhooks service.

If you have a web application or web service that exposes a public endpoint, you can receive near real-time notifications when changes are made to your users' personal OneNote notebooks on OneDrive.  

Notifications are sent when a change is made in a notebook that's owned by one of your users. This includes changes at any level in the notebook hierarchy, including changes to page content. 

Notifications don't contain any detailed information about changes or users. They alert you when a change is made, so your event handler can then query for specific details. 
 The Webhooks service doesn't support fine-grained subscriptions for specific types of changes or resources.

Notifications are sent as POST requests that contain a JSON object, as shown in the following example.

```json
{
  "value":[
    {
	  "subscriptionId":"client-id-of-your-registered-application",
	  "userId":"id-of-the-user-who-owns-the-changed-resource" 
	}
  ]
}
```

Your service must promptly respond to the notification with one of the following HTTP status codes:

- 200 OK
- 202 Accepted
- 204 No Content

If we don't receive the response, we'll retry a few times with exponential backoff and ultimately discard the message.

<br />
Here's more information about notifications:

- Notifications are scoped to content that's owned by your users, regardless of who made the change. Notifications are not sent for changes made to content that's shared with your users.
  So if Bob (not your user) makes a change to a notebook owned by Alice (your user), you'll receive a notification with Alice's user ID. You won't receive a notification if Alice changes Bob's notebook.

- The **userId** in the notification matches the ID that's returned in the **X-AuthenticatedUserId** header of OneNote API responses.

- Changes made within a short time span may be combined into a single notification.  

- Notifications are typically sent within a few minutes of the change. This latency ensures that changes are available to the API, even though the change may be available immediately in the client.


## Notifications workflow 

A typical high-level notifications workflow goes something like this:

1. Changes are made to a notebook that's owned by one of your users.
2. OneNote sends one or more POST requests to your registered callback URL. Each POST request represents one or more changes.
3. Your service responds to each POST request with a 200, 202, or 204 HTTP status code. 
3. The notifications trigger an event handler in your callback API. 
3. You query the OneNote service for detailed changes.

Querying based on the timestamp of the latest change is the best way to ensure you capture all changes. Store the timestamp of the most recent **lastModifiedTime** from the results, then use it in your next change query.

This request uses the **lastModifiedTime** property to return all pages that have changed since your stored timestamp:

```
GET ../me/notes/pages?filter=lastModifiedTime%20ge%20{stored-iso-8601-timestamp}
```

After you query for changes, update your stored timestamp with the latest **lastModifiedTime**.

>The Webhooks service is not intended to be used as a sync mechanism. You should periodically query for changes in the event that a notification is unable to be sent or received.  


<a name="subscribe"></a>
## How to subscribe to the Webhooks service
To subscribe to the OneNote Webhooks service, you'll need to:

- Register a callback URL that’s a public endpoint (HTTP or HTTPS)<!-- hosted on the same domain as your app--> where you'll receive HTTP POST requests from the OneNote Webhooks service. The Webhooks service will not follow HTTP redirects.

- Request the following permissions for your application: 
   - `wl.offline_access` (Microsoft account permission)
   - `office.onenote`, `office.onenote_create`, `office.onenote_update_by_app`, or `office.onenote_update` for the OneNote API, depending on what your app does
 
<br />
When you're ready to subscribe, contact us at [@onenotedev](http://twitter.com/onenotedev). Someone from our team will work with you to get you set up. 

As your users register with your application, you should make a call to the OneNote API on their behalf (for example: *GET ../me/notes/notebooks*). This call will:

- Ensure that OneNote registers the user for callback notifications.
- Allow you retrieve and store the user's ID, which is returned in the **X-AuthenticatedUserId** response header.


### Expiration model
For webhook notifications, we register the IDs of your users. Each interaction made by a given user renews the user's registration for six months.

A registration becomes inactive after a six month period in which you haven't called the OneNote API on the user's behalf. You won't receive notifications for inactive users, including users who uninstall your app or revoke its permissions. 
 Because change notifications don't contain details about the user or the change, the potential risk to user privacy is mitigated. Inactive users are re-registered whenever you call the OneNote API on their behalf.


<a name="see-also"></a>
## Additional resources

- [OneNote development](../howto/onenote-landing.md)
- [Get Onenote content and structure](../howto/onenote-get-content.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://stackoverflow.com/questions/tagged/onenote-api+onenote) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)
