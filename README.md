# Microsoft Graph Webhooks #

In this lab, you'll use the Microsoft Graph API to create a webhooks subscription on behalf of a user, and create a public endpoint that receives change notifications. Microsoft Graph webhooks uses a poke-pull model, and sends notifications for changes to messages, events, and contacts. 

## Prerequisites
1. You must have an Office 365 tenant and Microsoft Azure subscription to complete this lab. If you don't have one, the lab for **///diff lab?/// O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
1. You must have Visual Studio 2015 with Update 1 installed.

## Exercise 1: Create a webhooks subscription
In this exercise, you'll create an ASP.NET MVC5 application that creates a Microsoft Graph webhooks subscription and receives change notifications.

### Create an ASP.NET MVC5 application
Start by creating the ASP.NET MVC5 application and register it with Azure active Directory.

1. Launch **Visual Studio 2015** as an administrator. 
1. In Visual Studio select **File/New/Project**.
1. In the **New Project** dialog, select **Templates/Visual C#/Web** and click **ASP.NET Web Application**. Name the new project **GraphWebhooks** and then click **OK**.  
    
    ![](Images/01.png)
    > NOTE: Make sure you enter the exact same name for the Visual Studio Project that is specified in these lab instructions. The Visual Studio Project name becomes part of the namespace in the code. The code inside these instructions depends on the namespace matching the Visual Studio Project name specified in these instructions. If you use a different project name the code will not compile unless you adjust all the namespaces to match the Visual Studio Project name you enter when you create the project.
    
1. In the **New ASP.NET Project** dialog, click **MVC** and then click **Change Authentication**.
1. Select **Work And School Accounts**, enter your Office 365 tenant, and click **OK**.

	![](Images/02.png)

1. In the **New ASP.NET Project** dialog, uncheck **Host in the cloud**, and click **OK**. 

	![](Images/03.png)

1. Open the Web.config file in the root directory of the project and copy the value for the **ida:ClientId** key. Keep the file open, we'll be adding a key in the next section.

### Grant application permissions
Now you'll grant the permissions that your app needs to get notifications for new messages.

1. Browse to the [Azure Management Portal](https://manage.windowsazure.com) and sign in with the account that lets you manage your Office 365 directory.
2. In the left-hand navigation, click **Active Directory**.
3. Select the directory you share with your Office 365 subscription.
4. Paste the client ID that you copied into the **Search** box, and click the checkmark.

    ![](Images/04.png)

5. Click the application and open the **Configure** tab.
6. In the **keys** section, select a duration of one or two years. You'll copy this value after you save your changes.

    ![](Images/GenerateKey.png)

7. Scroll down to the **permissions to other applications** section, and click the **Add application** button.
9. In the **Permissions to other applications** dialog, click the **PLUS** icon next to the **Microsoft Graph** application.
10. Click the checkmark icon in the lower right corner.
11. For the new **Microsoft Graph** application permission entry, select the **Delegated Permissions** dropdown on the same line, and then select the **Read user mail** permission.

    ![](Images/GrantPermissions.png)

12. Click the **Save** button at the bottom of the page.
13. Make a copy of the key that was generated. You won't be able to access it after you close the browser.
1. In Visual Studio, in the Web.config file, in the appSettings** section, insert the following lines. Then replace *ENTER_YOUR_KEY* with the application key that you copied.

   ```xml
    <add key="ida:AppKey" value="ENTER_YOUR_KEY" />
    <add key="ida:NotificationUrl" value="ENTER_YOUR_PROXY_URL/listen" />
    <add key="ida:Resource" value="https://graph.microsoft.com/" />
   ```
You'll edit the **NotificationUrl** key later.

### Install dependencies
1. In Visual Studio, open **Tools/Nuget Package Manager/Package Manager Console**, and run the following commands:

```
Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
Install-Package Newtonsoft.Json
```

### Set up the ngrok proxy
You must have a public HTTPS endpoint to create a subscription and receive notifications from Microsoft Graph. While testing, you can optionally use ngrok to allow messages from Microsoft Graph to temporarily tunnel to your local port. This makes it easier to test and debug webhooks. See the [ngrok website](https://ngrok.com/) to learn more about using ngrok.  

You'll use the HTTPS Forwarding URL that ngrok provides in your endpoint. To configure the proxy, you'll need the HTTP port number for your project.

1. In Visual Studio, in Solution Explorer, select the **GraphWebhooks** project.
1. In the **Properties** window, copy the **URL** port number (not the SSL URL). If the window isn't showing, choose **View/Properties Window**.
1. [Download ngrok](https://ngrok.com/download) for Windows.  
2. Unzip the package and run ngrok.exe.  
3. Replace the two *<port-number>* placeholder values in the following command with your actual value, and run it in the ngrok console.

```
ngrok http <port-number> -host-header=localhost:<port-number>
```

4. Copy the HTTPS Forwarding URL that's shown in the console to use in the notification URL for your webhooks subscription. It'll look something like this: `https://21698db0.ngrok.io` 
4. In Visual Studio, open Web.config and replace *ENTER_YOUR_PROXY_URL* with the HTTPS Forwarding URL from ngrok. It'll look something like this: `https://21698db0.ngrok.io/listen`
   
> **Note:** Keep the console open while testing. If you close it, the tunnel closes and you'll need to generate a new URL and update the sample.

### Set up authentication
TBA

### Configure routing
1. In the **App_Start** folder, open RouteConfig.cs and replace the Default route with the following:
```c#
routes.MapRoute(
    name: "Default",
    url: "{controller}/{action}",
    defaults: new { controller = "Subscription", action = "Index" }
);
```

### Create the subscription model
In this step you'll create a model that represents a Subscription object. 

1. Right-click the **Models** folder and choose **Add/Class**. 
1. Name the model **Subscription.cs** and click **Add**.
1. Add the following *using* statement. The samples uses the [Json.NET](http://www.newtonsoft.com/json) framework to deserialize JSON responses.

```c#
using Newtonsoft.Json;
```

1. Replace the **Subscription** class with the following code. This also includes a view model wrapper to display in the UI.

```c# 
// A webhooks subscription.
public class Subscription
{
    // The type of change in the subscribed resource that raises a notification.
    [JsonProperty(PropertyName = "changeType")]
    public string ChangeType { get; set; }

    // The string that MS Graph should send with each notification. Maximum length is 255 characters. 
    // To verify that the notification is from MS Graph, compare the value received with the notification to the value you sent with the subscription request.
    [JsonProperty(PropertyName = "clientState")]
    public string ClientState { get; set; }

    // The URL of the endpoint that receives the subscription response and notifications. Requires https.
    [JsonProperty(PropertyName = "notificationUrl")]
    public string NotificationUrl { get; set; }

    // The resource to monitor for changes.
    [JsonProperty(PropertyName = "resource")]
    public string Resource { get; set; }

    // The date and time when the webhooks subscription expires.
    // The time is in UTC, and can be up to three days from the time of subscription creation.
    [JsonProperty(PropertyName = "subscriptionExpirationDateTime")]
    public DateTimeOffset SubscriptionExpirationDateTime { get; set; }

    // The unique identifier for the webhooks subscription.
    [JsonProperty(PropertyName = "subscriptionId")]
    public string SubscriptionId { get; set; }
}

// The data that displays in the Subscription view.
public class SubscriptionViewModel
{
    public Subscription Subscription { get; set; }
}
```

### Create the subscriptions controller
In this step you'll create a controller that will send a *POST /subscriptions* request to Microsoft Graph on behalf of the signed in user. 

**Create the controller class**

1. Right-click the **Controllers** folder and choose **Add/Controller**. 
1. Select **MVC 5 Controller - Empty** and click **Add**.
1. Name the controller **SubscriptionController** and click **Add**.
1. Add the following *using* statements:

```c#
using GraphWebhooks.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
```

**Get an access token**

All requests to Microsoft Graph require an access token.

1. Add the following method. This gets an access token by calling the **AcquireTokenSilent** method, and then adds the token to the HTTP client that we'll use for the *POST /subscriptions* request.

```c#
// Create webhooks subscriptions.
public async Task<ActionResult> CreateSubscription()
{
    // Get the userObjectId and store it for future requests.
    string userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
    HttpRuntime.Cache.Insert("userObjectId", userObjectId, null, DateTime.MaxValue, new TimeSpan(24, 0, 0), System.Web.Caching.CacheItemPriority.NotRemovable, null);

    // Get an access token.
    string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
    string clientSecret = ConfigurationManager.AppSettings["ida:AppKey"];
    string resourceId = ConfigurationManager.AppSettings["ida:Resource"];
    string resource = "https://graph.microsoft.com/";
    string authority = ConfigurationManager.AppSettings["ida:AADInstance"] + ConfigurationManager.AppSettings["ida:TenantId"];

    // Build the request.
    // Send the request and parse the response.
}
```

**Build the *POST /subscriptions* request**

1. Replace the *// Build the request.* comment with the following code. This builds the *POST /subscriptions* request.

```c#
// Build the request.
string subscriptionsEndpoint = "https://graph.microsoft.com/beta/subscriptions/";
HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, subscriptionsEndpoint);
string message = string.Format(
    "{{\"resource\":\"{0}\",\"changeType\":\"{1}\",\"notificationUrl\":\"{2}\",\"clientState\":\"{3}\"}}",
    "me/messages",
    "Created",
    ConfigurationManager.AppSettings["ida:NotificationUrl"],
    Guid.NewGuid().ToString());
request.Content = new StringContent(message, System.Text.Encoding.UTF8, "application/json");
```

This sample creates a subscription for the *me/messages* resource for *Created* change type. See the ///docs/// for other supported resources and change types. 

**Send the request and parse the response**

1. Replace the *// Send the request and parse the response.* comment with the following code. This sends the request, parses the response, and loads the view.

```c#
// Send the request and parse the response.
HttpResponseMessage response = await client.SendAsync(request);
if (response.IsSuccessStatusCode)
{

    // Parse the JSON response.
    string stringResult = await response.Content.ReadAsStringAsync();
    SubscriptionViewModel viewModel = new SubscriptionViewModel
    {
        Subscription = JsonConvert.DeserializeObject<Subscription>(stringResult)
    };
    return View("Subscription", viewModel);
}
else
{
    return View("Error");
}
```

### Create the index and subscription views
In this step you'll create a view for the app start page and a view that displays the properties of the subscription you create. 

**Create the index view** 

1. Right-click the **Views/Subscription** folder and choose **Add/View**. 
1. Name the view **Index**.
1. Replace the HTML with the following:

```html
<h2>Microsoft Graph Webhooks</h2>

<div>
    <p>You can subscribe to webhooks for specific resources (such as Outlook messages or events) to be notified about changes to the resource.</p>
    <p>This sample creates a subscription for the <i>me/messages</i> resource for the <i>Created</i> change type. The request looks like this:</p>
    <code>
        {<br />
        "resource": "me/messages",<br/>
        "changeType": "Created",<br />
        "notificationUrl": "https://your-notification-endpoint",<br />
        "clientState": "your-client-state"<br />
        }
    </code>
    <br />
    <p>See the ///docs/// for other supported resources and change types.</p>
    @using (Html.BeginForm("CreateSubscription", "Subscription"))
    {
        <button type="submit">Create subscription</button>
    }
</div>
```

**Create the subscription view** 

1. Right-click the **Views/Subscription** folder and choose **Add/View**. 
1. Name the view **Subscription**.
1. Select the **Empty** template, select **SubscriptionViewModel (GraphWebhooks.Models)**, and then click **Add**.
1. In the **Subscription.cshtml* file that's created, add the following HTML:

```html
<div>
    <table>
        <tr>
            <td>
                @Html.LabelFor(m => m.Subscription.Resource, htmlAttributes: new { @class = "control-label col-md-2" })
                <br />
                @Html.TextAreaFor(m => m.Subscription.Resource, 16, 60, new { @class = "form-control" })
            </td>
            <td>
                @Html.LabelFor(m => m.Subscription.ChangeType, htmlAttributes: new { @class = "control-label col-md-2" })
                <br />
                @Html.TextAreaFor(m => m.Subscription.ChangeType, 16, 60, new { @class = "form-control" })
            </td>
            <td>
                @Html.LabelFor(m => m.Subscription.SubscriptionId, htmlAttributes: new { @class = "control-label col-md-2" })
                <br />
                @Html.TextAreaFor(m => m.Subscription.SubscriptionId, 16, 60, new { @class = "form-control" })
            </td>
            <td>
                @Html.LabelFor(m => m.Subscription.SubscriptionExpirationDateTime, htmlAttributes: new { @class = "control-label col-md-2" })
                <br />
                @Html.TextAreaFor(m => m.Subscription.SubscriptionExpirationDateTime, 16, 60, new { @class = "form-control" })
            </td>
        </tr>
    </table>
</div>
<br />
<div>
    @using (Html.BeginForm("LoadView", "Notification"))
    {
        <button type="submit">Watch for notifications</button>
    }
</div>
```

### Create the notification model
In this step you'll create a model that represents a Notification object. 

1. Right-click the **Models** folder and choose **Add/Class**. 
1. Name the model **Notification.cs** and click **Add**.
1. Add the following *using* statement. The samples uses the [Json.NET](http://www.newtonsoft.com/json) framework to deserialize JSON responses.

```c#
using Newtonsoft.Json;
```

1. Replace the **Notification** class with the following code. This also defines a class for the **ResourceData** object. 

```c# 
    // A change notification.
    public class Notification
    {
        // The type of change.
        [JsonProperty(PropertyName = "changeType")]
        public string ChangeType { get; set; }

        // The client state used to verify that the notification is from Microsoft Graph. Compare the value received with the notification to the value you sent with the subscription request.
        [JsonProperty(PropertyName = "clientState")]
        public string ClientState { get; set; }

        // The endpoint of the resource that changed. For example, a message uses the format ../Users/{user-id}/Messages/{message-id}
        [JsonProperty(PropertyName = "resource")]
        public string Resource { get; set; }

        // The date and time when the webhooks subscription expires.
        // The time is in UTC, and can be up to three days from the time of subscription creation.
        [JsonProperty(PropertyName = "subscriptionExpirationDateTime")]
        public string SubscriptionExpirationDateTime { get; set; }

        // The unique identifier for the webhooks subscription.
        [JsonProperty(PropertyName = "subscriptionId")]
        public string SubscriptionId { get; set; }

        // Properties of the changed resource.
        [JsonProperty(PropertyName = "resourceData")]
        public ResourceData ResourceData { get; set; }
    }

    public class ResourceData
    {

        // The ID of the resource.
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        // The OData etag property.
        [JsonProperty(PropertyName = "@odata.etag")]
        public string ODataEtag { get; set; }

        // The OData ID of the resource. This is the same value as the resource property.
        [JsonProperty(PropertyName = "@odata.id")]
        public string ODataId { get; set; }

        // The OData type of the resource: "#Microsoft.Graph.Message", "#Microsoft.Graph.Event", or "#Microsoft.Graph.Contact".
        [JsonProperty(PropertyName = "@odata.type")]
        public string ODataType { get; set; }
    }
```

### Create the notifications controller
In this step you'll create a controller that exposes the notification endpoint. 

**Create the controller class**

1. Right-click the **Controllers** folder and choose **Add/Controller**. 
1. Select **MVC 5 Controller - Empty** and click **Add**.
1. Name the controller **NotificationController** and click **Add**.
1. Add the following *using* statements:

```c#
using GraphWebhooks.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
```

**Create the notification endpoint**

1. Replace the **Notification** class with the following code.

```c#
public class NotificationController : Controller
{
    // The notificationUrl endpoint that's registered with the webhooks subscription.
    [Route("/notification/listen")]
    [HttpPost]
    public ActionResult Listen()
    {

        // Validate the new subscription by sending the token back to Microsoft Graph.
        // This response is required for each subscription.
        if (Request.QueryString["validationToken"] != null)
        {
            var token = Request.QueryString["validationToken"];
            return Content(token, "plain/text");
        }

        // Parse the received notifications.
        else
        {
            List<Notification> notifications = new List<Notification>();
            using (var inputStream = new System.IO.StreamReader(Request.InputStream))
            {
                JObject jsonObject = JObject.Parse(inputStream.ReadToEnd());
                if (jsonObject != null)
                {

                    // Notifications are sent in a 'value' array.
                    JArray value = JArray.Parse(jsonObject["value"].ToString());
                    foreach (var notification in value)
                    {
                        Notification current = JsonConvert.DeserializeObject<Notification>(notification.ToString());
                        current.ResourceData = JsonConvert.DeserializeObject<ResourceData>(notification["resourceData"].ToString());

                        // Verify the message is from Microsoft Graph. This sample only uses the current subscription.
                        if (current.ClientState == (string)HttpRuntime.Cache.Get("clientState                            {
                            if (current.SubscriptionId == (string)HttpRuntime.Cache.Get("subscriptionId"))
                            {
                                notifications.Add(current);
                            }
                        }
                        else
                        {
                            // 
                            return new HttpStatusCodeResult(200);
                        }
                    }

                    // Query for the changed resources. No need to await the result, so continue and respond to Microsoft Graph.
                    //ChangedResourceAsync(notifications);
                }
            }
            return new HttpStatusCodeResult(200);
        }
    }
}
```