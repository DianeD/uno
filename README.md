# Microsoft Graph Webhooks #

In this lab, you'll use the Microsoft Graph API to create a webhooks subscription on behalf of a user, and create a public endpoint that receives change notifications. Microsoft Graph webhooks uses a poke-pull model, and sends notifications for changes to messages, events, and contacts. 

## Prerequisites
- You must have an Office 365 tenant and Microsoft Azure subscription to complete this lab. If you don't have one, the lab for **///diff lab?/// O3651-7 Setting up your Developer environment in Office 365** shows you how to obtain a trial.
- You must have Visual Studio 2015 with Update 1 installed.

## Exercise 1: Create a webhooks subscription and receive notifications
In this exercise, you'll create an ASP.NET MVC5 application that creates a subscription for Microsoft Graph webhooks and receives change notifications.

### Create an ASP.NET MVC5 application
1. Launch **Visual Studio 2015** as an administrator. 

1. In Visual Studio select **File/New/Project**. 

1. In the **New Project** dialog, select **Templates/Visual C#/Web** and click **ASP.NET Web Application**. Name the new project **GraphWebhooks**, and then click **OK**.  
    
   > NOTE: Make sure you use the exact same name that is specified in these instructions for your Visual Studio project. Otherwise, your namespace name will differ from the one in these instructions and your code will not compile.
 
    ![](Images/01.png)
   
1. In the **New ASP.NET Project** dialog, click **MVC** and then click **Change Authentication**.

1. Select **Work And School Accounts**, enter your Office 365 tenant, and click **OK**.

	![](Images/02.png)

1. In the **New ASP.NET Project** dialog, uncheck **Host in the cloud**, and click **OK**.

1. Open the Web.config file in the root directory of the project and copy the value for the **ida:ClientId** key. Keep the file open, we'll be adding a key in the next section.

### Grant application permissions
You need to grant the permissions that your app needs to get notifications. This app subscribes to Outlook email notifications, so it needs the **Mail.Read** permission scope.

1. Browse to the [Azure Management Portal](https://manage.windowsazure.com) and sign in with the account that lets you manage your Office 365 directory.

2. In the left-hand navigation, click **Active Directory**.

3. Select the directory you share with your Office 365 subscription.

4. Paste the client ID that you copied into the **Search** box, and click the checkmark.

    ![](Images/04.png)

5. Click the application and open the **Configure** tab.

6. In the **keys** section, select a duration of one or two years. You'll copy the generated value after you save your changes.

    ![](Images/GenerateKey.png)

7. Scroll down to the **permissions to other applications** section, and click the **Add application** button.

9. In the **Permissions to other applications** dialog, click the **PLUS** icon next to the **Microsoft Graph** application.

10. Click the checkmark icon in the lower right corner.

11. For the new **Microsoft Graph** application permission entry, select the **Delegated Permissions** dropdown on the same line, and then select the **Read user mail** permission.

    ![](Images/GrantPermissions.png)

12. Click the **Save** button at the bottom of the page.

13. Make a copy of the key that was generated. You won't be able to access it after you close the browser.

1. In Visual Studio, in the Web.config file, in the **appSettings** section, insert the following lines. Then replace *ENTER_YOUR_KEY* with the application key that you copied.

   ```xml
    <add key="ida:AppKey" value="ENTER_YOUR_KEY" />
    <add key="ida:NotificationUrl" value="ENTER_YOUR_PROXY_URL/notification/listen" />
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
You must have a public HTTPS endpoint to create a subscription and receive notifications from Microsoft Graph. While testing, you can use ngrok to temporarily allow messages from Microsoft Graph to tunnel to your local port. This makes it easier to test and debug webhooks. To learn more about using ngrok, see the [ngrok website](https://ngrok.com/).  

You'll use the HTTPS Forwarding URL that ngrok provides in your endpoint. To configure the proxy, you need the HTTP port number for your project.

1. In Visual Studio, in Solution Explorer, select the **GraphWebhooks** project.

1. In the **Properties** window, copy the **URL** port number (not the SSL URL port number). If the window isn't showing, choose **View/Properties Window**.

1. [Download ngrok](https://ngrok.com/download) for Windows.  

1. Unzip the package and run ngrok.exe.  

1. Replace the two *<port-number>* placeholder values in the following command with your actual port number, and run it in the ngrok console.

   ```
ngrok http <port-number> -host-header=localhost:<port-number>
   ```

1. Copy the HTTPS URL that's shown in the console. 

	![](Images/ngrok.png)

1. In Visual Studio, open Web.config and replace *ENTER_YOUR_PROXY_URL* with the HTTPS URL you copied. The **ida:NotificationUrl** key will look something like this: `https://21698db0.ngrok.io/notification/listen`
   
> NOTE: Keep the console open while testing. If you close it, the tunnel closes and you'll need to generate a new URL and update the sample.

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

**Create the model class**

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

1. Add the **CreateSubscription** method. This gets an access token by calling the **AcquireTokenSilent** method, and then adds the token to the HTTP client that we'll use for the *POST /subscriptions* request.

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

### Create the subscription view
In this step you'll create a view that displays the properties of the subscription you create. 

1. Right-click the **Views/Subscription** folder and choose **Add/View**. 

1. Name the view **Subscription**.

1. Select the **Empty** template, select **SubscriptionViewModel (GraphWebhooks.Models)**, and then click **Add**.

1. In the **Subscription.cshtml* file that's created, xxx


////////////////////
### Check Authentication Flow
At this point you can test the default authentication flow for your application.

  1. In Visual Studio, press **F5**. The browser will automatically launch taking you to the HTTPS start page for the web application.

   > **Note:** If you receive an error that indicates ASP.NET could not connect to the SQL database, please see the [SQL Server Database Connection Error Resolution document](../../SQL-DB-Connection-Error-Resolution.md) to quickly resolve the issue. 

  1. To sign in, click the **Sign In** link in the upper-right corner.

  1. Login using your **Organizational Account**.

  1. Upon a successful login, since this will be the first time you have logged into this app, Azure AD will present you with the common consent dialog that looks similar to the following image:

    ![](Images/ConsentDialog.png)

  1. Click **Accept** to approve the app's permission request on your data in Office 365.

  1. You will then be redirected back to your web application. However notice in the upper right corner, it now shows your email address & the **Sign Out** link.
 
  1. In Visual Studio, press **Shift+F5** to stop debugging.

Congratulations... your app is configured with Azure AD and leverages OpenID Connect and OWIN to facilitate the authentication process!


### Add Navigation
In this step you will create a link on home page to navigate to notebooks list page

1. Locate the **Views/Shared** folder in the project.
1. Open the **_Layout.cshtml** file found in the **Views/Shared** folder.

Congratulations! You have created an ASP.NET MVC application that uses the Microsoft Graph to get notifications when the user creates a new message in Outlook.










