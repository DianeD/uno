---
ms.Toctitle: Quick Start tutorial
title: "Tutorial: Create a OneNote app" 
description: Create your first OneNote app.
ms.ContentId: 513111e6-35e9-4d7d-b986-4ca2fa33b6cb
ms.date: January 12, 2016
---

[!INCLUDE [Add the O365API repo styles](../includes/controls/addo365apistyles.xml)]
[!INCLUDE [Add the ONAPI repo styles](../includes/controls/addonapistyles.xml)]

# Tutorial: Create a OneNote app

*__Applies to:__ Consumer notebooks on OneDrive | Enterprise notebooks on Office 365*

This tutorial shows you how to create a simple app that uses the OneNote API to get and create OneNote content. The app we'll create makes two calls using the OneNote REST API:

<p id="outdent">**Get the *name* and *id* of the 10 most recently modified sections**</p>
<p id="indent">`GET ../notes/sections?select=name,id&top=10&orderby=lastModifiedTime%20desc`</p>
<p id="outdent">**Create a page in a specific section**</p>
<p id="indent">`POST ../notes/sections/{id}/pages`</p>

Choose your platform:

- [Create a OneNote app for iOS](#ios)

- [Create a OneNote app for ASP.NET](#aspnet)

>This tutorial is intended to demonstrate how to access the OneNote API, but it doesn't contain production-ready code. When creating your app, carefully review your code for potential security, validation, and other code-quality issues.

<a name="ios"></a>
## Create a OneNote app for iOS

The app uses the [OneDrive SDK for iOS](https://github.com/OneDrive/onedrive-sdk-ios) to handle authentication and network calls.<!--This tutorial provides examples for both the [Swift](https://developer.apple.com/swift/) and Objective C programming languages. -->

<a name="prereqs-ios"></a>
### Prerequisites
Here's what you'll need to follow this tutorial:

- [Xcode 7](https://developer.apple.com/xcode/) from Apple.
- The [CocoaPods](https://cocoapods.org/) dependency manager. If you're new to using CocoaPods, see [CocoaPods guides](https://guides.cocoapods.org/).
- A native client app registered on the [Azure Management Portal](http://manage.windowsazure.com/) or a mobile client app registered on the [Microsoft account Developer Center](http://go.microsoft.com/fwlink/p/?LinkId=193157). (Learn how to [register an app](../howto/onenote-auth.md).)

<br />
<p id="top-padding">**To create a OneNote app for iOS:**</p>
<p id="indent">1. [Create the project](#create-project-ios)</p>
<p id="indent">2. [Add the OneDrive SDK dependency](#add-dependencies-ios)</p>
<p id="indent">3. [Build the UI](#build-ui-ios)</p>
<p id="indent">4. [Add auth support](#add-auth-ios)</p>
<p id="indent">5. [Call the OneNote API](#call-api-ios)</p>

[Complete code example](#complete-example-ios) for key sample files are included at the end of the tutorial. 


<a name="create-project-ios"></a>
### Create the project in Xcode

1. In Xcode, create a **Single View Application** project for iOS named *OneNote-iOS-App*. Choose <!--Swift or -->Objective C, and choose iPhone devices. 
2. After the project is created, close Xcode. You'll open the workspace after you create a Podfile.
 

<a name="add-dependencies-ios"></a>
### Add the OneDrive SDK dependency

The app in this tutorial uses the OneDrive SDK for both Microsoft account (formerly *Live Connect*) and Azure Active Directory authentication. Microsoft account authentication is used for access to consumer notebooks on OneDrive. Azure AD authentication is used for access to enterprise notebooks on Office 365.

1.  Run these commands in Terminal to create a Podfile and open the file in Xcode.

   ```
   cd {path to the OneNote-iOS-App project directory} 
   touch podfile 
   open -a xcode podfile 
   ```

2. Add the OneDrive SDK dependency to the Podfile, and then save the file.

   ```
   pod 'OneDriveSDK'
   ```

3. Run these commands in Terminal to install the dependency and open the project workspace in Xcode. You should receive confirmation when the installation is complete.

   ```
   pod install
   open onenote-ios-app.xcworkspace/
   ```

#### Xcode 7 apps that target iOS 9.0

If you're targeting iOS 9 with Xcode 7, you need to enable PFS exceptions. See the **iOS 9 App Transport Security** section in the OneDrive SDK for iOS [readme](https://github.com/OneDrive/onedrive-sdk-ios) for instructions.


<a name="build-ui-ios"></a>
### Build the UI

Add a picker that displays the user's 10 most recently modified sections and a button that creates a OneNote page in the selected section.

1. In Xcode, open Main.storyboard and change the size class control (below the canvas) to *wCompact/hAny*. 

2. Drag a Picker View and a Button from the Object Library to the canvas. Use *Create page* for the button text. 

2. Create connections for the picker view:  
   a. Control-drag the picker view to the View Controller icon above the canvas. Choose the **dataSource** outlet.  
   b. Repeat for the **delegate** outlet.  
   c. Choose **View > Assistant Editor > Show Assistant Editor** and open ViewController.h in the second window.  
   d. Control-drag the picker view in the canvas into the **@interface** code block. Insert an **Outlet** connection named *sectionPicker*.  

2. Create connections for the button:  
   a. Control-drag the button in the canvas into the **@interface** code block. Insert an **Outlet** connection named *createPageButton*.  
   b. Open ViewController.m in the assistant editor.  
   c. Control-drag the button in the canvas into the **@implementation** code block. Insert an **Action** connection named *createPage* for the **Touch Up Inside** event. 

2. Declare the **UIPickerViewDelegate** and **UIPickerViewDataSource** protocols.

   ViewController.h should look like this:

   ```objective-c
    import <UIKit/UIKit.h>

    @interface ViewController : UIViewController<UIPickerViewDelegate, UIPickerViewDataSource>
 
    @property (weak, nonatomic) IBOutlet UIPickerView *sectionPicker;
    @property (weak, nonatomic) IBOutlet UIButton *createPageButton;
 
    @end
   ```

2. In ViewController.m, add the following delegate methods for the picker view.

   ```objective-c
    #pragma mark - Delegate Methods
   -(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView {
       return 1;
   }

   -(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component {
       return sectionNamesForPicker.count;
   }

   -(NSString *)pickerView:(UIPickerView*)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component {
       return [sectionNamesForPicker objectAtIndex:row];
   }
   ```

   Don`t worry about the errors for **sectionNamesForPicker**. We'll add the variable later.

2. In the **viewDidLoad** method, add the following code to connect the picker after the line `[super viewDidLoad]`.

   ```objective-c
    self.sectionPicker.delegate = self;
    self.sectionPicker.dataSource = self;
   ```

<a name="add-auth-ios"></a>
### Add auth support

The OneDrive SDK handles authentication and authorization for you. You'll just need to provide identifiers for your application and then use the ODClient. The SDK invokes the sign-in UI the first time the user runs the app and then stores the account information. (Learn more about [auth in the SDK](https://github.com/OneDrive/onedrive-sdk-ios/blob/master/docs/auth.md).) 

1. In AppDelegate.m, import the OneDrive SDK.

   ```objective-c
    #import <OneDriveSDK/OneDriveSDK.h>
   ```

2. Replace the **didFinishLaunchingWithOptions** method with the following code. 

   Then, replace the placeholder property values with the information for your registered app(s). If you're only testing with one app, you can comment out the properties that you're not using.   

   ```objective-c
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
        // Set the client ID and permission scopes of your app registered on the Microsoft account Developer Center.
        static NSString *const msaClientId = @"000000001A123456";
        static NSString *const msaScopesString = @"wl.signin,wl.offline_access,office.onenote_update";
    
        // Set the client ID and redirect URI of your app registered on the Azure Management Portal.
        static NSString *const aadClientId = @"0b18d05c-386d-4133-b481-az1234567890";
        static NSString *const aadRedirectUri = @"http://localhost/";
    
        // Set properties on the ODClient.
        NSArray *const msaScopes = [msaScopesString componentsSeparatedByString:@","];
        [ODClient setMicrosoftAccountAppId:msaClientId
                                    scopes:msaScopes];
    
        [ODClient setActiveDirectoryAppId:aadClientId
                               capability:@"Notes"
                              redirectURL:aadRedirectUri];
        return YES;
    }
   ```

   >This app lets you sign in with one account at a time (Microsoft account or work or school account). To see how to support both account types and store multiple accounts, see the [CloudRoll](https://github.com/OfficeDev/O365-iOS-CloudRoll) sample.
 
2. In ViewController.h, import the OneDrive SDK and declare a property for the ODClient object. All calls to the SDK are made through the ODClient object.

   a. Add the import statement:

   ```objective-c
   #import <OneDriveSDK/OneDriveSDK.h>
   ```

   b. Add the **client** property to the **@interface** code block.

   ```objective-c
   @property (strong, nonatomic) ODClient *client;
   ```

2. In ViewController.m, add the following code to the end of the **viewDidLoad** method to get an authenticated ODClient. 

  The SDK invokes the sign-in UI the first time the user runs the app and then stores the account information. 

   ```objective-c
    [ODClient clientWithCompletion:^(ODClient *odClient, NSError *error) {
        if (!error){
            self.client = odClient;
            [self getSections];
        }
        else {
            NSLog(@"Error with auth: %@", [error localizedDescription]);
        }
    }];
   ```

   We'll add the **getSections** method in the next section.

2. In ViewController.m, add the **sendRequest** method to the **@implementation** code block. 

   This method adds the required **Authorization** header to the *GET sections* and the *POST pages* requests, and creates the data transfer task. 

   ```objective-c
    // Send the request.
    - (void)sendRequest:(NSMutableURLRequest *)request {

        // Add the required Authorization header with access token.
        [self.client.authProvider appendAuthHeaders:request completion:^(NSMutableURLRequest *requests, NSError *error) {

            // This app also uses the OneDrive SDK to send HTTP requests.
            [[self.client.httpProvider dataTaskWithRequest:(request)
                    completionHandler:^(NSData *data,
                    NSURLResponse *response,
                    NSError *error) {
                        [self handleResponse:data response:response error:error];
            }] resume];
        }];
    }
   ```

Now you're ready to make calls to the OneNote service.
 

<a name="call-api-ios"></a>
### Call the OneNote API

When the app loads, it gets the name and ID of the 10 most recently modified sections and populates the picker with the section names. The new page is created in the selected section.

1. In ViewController.h, add properties that store the response.

   ```objective-c
   // Variables to store the response data.
   @property (strong, nonatomic) NSHTTPURLResponse *returnResponse;
   @property (strong, nonatomic) NSMutableData *returnData;
   ```

   Add all the code in the following steps to the **@implementation** code block in ViewController.m. Don't worry about the errors you see while you're creating the app. They'll go away after the code is complete.

2. In ViewController.m, add variables for the OneNote service root URL, the dictionary for the section names and IDs, and an array for the section names that will populate the picker.

   ```objective-c
   static NSString const *serviceRootUrl = @"https://www.onenote.com/api/v1.0/me/notes/";
   NSMutableDictionary *sectionNamesAndIds;
   NSArray *sectionNamesForPicker;
   ```

2. Add the **getSections** method to build the *GET sections* request.

   ```objective-c
    // Build the "GET sections" request.
    - (void)getSections {

        // Construct the request URI and the request.
        NSString *sectionsEndpoint =
                [serviceRootUrl stringByAppendingString:@"sections?select=name,id&top=10&orderby=lastModifiedTime%20desc"];
        NSMutableURLRequest *request =
                [[NSMutableURLRequest alloc] initWithURL:[[NSURL alloc] initWithString:sectionsEndpoint]];
        request.HTTPMethod = @"GET";
        if (self.client)
        {
        
            // Send the HTTP request.
            [self sendRequest:request];
        }
        _createPageButton.enabled = false;
    }
   ```

2. Add the *handleResponse* method to handle the response from the *GET sections* and *POST pages* requests.

   ```objective-c                    
   // Handle the response.
   - (void)handleResponse:(NSData *)data response:(NSURLResponse *)response error:(NSError *) error {
       
       // Log the response.
       NSLog(@"Response %@ with error %@.\n", response, error);
       NSString *stringData = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
       NSLog(@"Body: %@.\n", stringData);
       
       // Store the response.
       self.returnData = [[NSMutableData alloc] init];
       NSMutableData *convertedData = [data mutableCopy];
       [self.returnData appendData:convertedData];
       self.returnResponse = (NSHTTPURLResponse *)response;
    
       NSInteger status = [self.returnResponse statusCode];
    
       // Check for "GET sections" success.
       if (status == 200) {
           NSLog(@"Sections retrieved!\n");
        
           // Get the section data and populate the picker.
           [self getSectionNamesAndIds];
       }
    
       // Check for "POST pages" success.
       else if (status == 201) {
           NSLog(@"Page created!\n");
        
           // Get the page object and parse out some properties.
           NSDictionary *pageProperties = [self convertData];
           NSString *selfLink = [pageProperties objectForKey:@"self"];
           NSDictionary *links = [pageProperties objectForKey:@"links"];
           NSString *clientUrl = [[links objectForKey:@"oneNoteClientUrl"] objectForKey:@"href"];
           NSString *webUrl = [[links objectForKey:@"oneNoteWebUrl"] objectForKey:@"href"];
           NSLog(@"Link to new page endpoint: %@\n", selfLink);
           NSLog(@"Link open page in the installed client: %@\n", clientUrl);
           NSLog(@"Link to open page in OneNote Online: %@\n", webUrl);
       }
       else {
           NSLog(@"Status code: %ld. Check the logged response for more information.", (long)status);
       }
   }
   ```

2. Add the **convertData** method to convert the response data to JSON. 

   ```objective-c
   // Get the OneNote entity data from the response.
   - (NSDictionary *)convertData {
    
       // Convert the message body to JSON.
       NSError *parseError;
       NSDictionary *data = [NSJSONSerialization JSONObjectWithData:self.returnData options:kNilOptions error:&parseError];
    
       if (!parseError) {
           return data;
       }
       else {
           NSLog(@"Error parsing response: %@", [parseError localizedDescription]);
           return nil;
       }
   }
   ```

2. Add the **getSectionNamesAndIds** method to store the section names and IDs and populate the picker. 

   ```objective-c
   // Store the section names and IDs, and populate the section picker.
   - (void)getSectionNamesAndIds {
    
       // Get the "value" array that contains the returned sections.
       NSDictionary *results = [self convertData];
    
       // Add the name-id pairs to sectionNamesAndIds, which is used to map section names to IDs.
       if ([results objectForKey:@"value"] != nil) {
           NSDictionary *sections =[results objectForKey:@"value"];
           sectionNamesAndIds = [[NSMutableDictionary alloc] init];
           for (NSMutableDictionary *dict in sections) {
               NSString *sectionName = [dict objectForKey:@"name"];
               NSString *sectionId = [dict objectForKey:@"id"];
               sectionNamesAndIds[sectionName] = sectionId;
           }
       }
    
       // Populate the picker with the section names.
       sectionNamesForPicker = [sectionNamesAndIds allKeys];
       dispatch_async(dispatch_get_main_queue(), ^{[_sectionPicker reloadComponent:0];});
    
       _createPageButton.enabled = true;
   }
   ```

2. Edit the **createPage** method that was created for you when you added the button action. This code creates a simple HTML page.  

   ```objective-c
   // Create a simple page.
   - (IBAction)createPage:(id)sender {
    
       // Get the ID of the section that's selected in the picker.
       NSInteger row = [self.sectionPicker selectedRowInComponent:0];
       NSString *selectedSectionName = sectionNamesForPicker[row];
       NSString *selectedSectionId = sectionNamesAndIds[selectedSectionName];
    
       // Construct the request URI and the request.
       NSString *pagesEndpoint = [NSString stringWithFormat:@"sections/%@/pages", selectedSectionId];
       NSString *fullEndpoint = [serviceRootUrl stringByAppendingString:pagesEndpoint];
       NSString *date = [self formatDate];
       NSString *simpleHtml = [NSString stringWithFormat:@"<html>"
                               "<head>"
                               "<title>A page created from simple HTML from iOS</title>"
                               "<meta name=\"created\" content=\"%@\" />"
                               "</head>"
                               "<body>"
                               "<p>This is some <b>simple</b> <i>formatted</i> text.</p>"
                               "</body>"
                               "</html>", date];
    
       NSData *presentation = [simpleHtml dataUsingEncoding:NSUTF8StringEncoding];
       NSMutableURLRequest * request = [[NSMutableURLRequest alloc] initWithURL:[[NSURL alloc] initWithString:fullEndpoint]];
       request.HTTPMethod = @"POST";
       request.HTTPBody = presentation;
       [request addValue:@"text/html" forHTTPHeaderField:@"Content-Type"];
       if (self.client)
       {
        
           // Send the HTTP request.
           [self sendRequest:request];
       }
   }
   ```

2. Add the **formatDate** method to get and ISO 8601-formatted date for the **meta** tag timestamp.

   ```objective-c
   // Format the "created" date. OneNote requires the ISO 8601 format.
   - (NSString *)formatDate {
       NSDate *now = [NSDate date];
       NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
       NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
       [dateFormatter setLocale:enUSPOSIXLocale];
       [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
       return [dateFormatter stringFromDate:now];
   }
   ```

After you've created the app, you can test it by running it on an iPhone or iPhone emulator. Sign in using your Microsoft account or work or school account.

When the app opens, pick the section where you want to create a page, and then choose **Create page**. Then check the output window in Xcode for the log messages. If the calls work, the output window will show the resource URI of the new page and the links to open the page in OneNote.


<a name="next-steps"></a>
**Next steps:**

Add functionality, input validation, and error handling.

For example, add a sign out button that calls this method:

```objective-c
- (IBAction)signOut:(UIButton *)sender  {
    [self.client signOutWithCompletion:^(NSError *signOutError) {
        self.client = nil;
        NSLog(@"Logged out.");
    }];
}
```

See the [Develop with the OneNote API](../howto/onenote-create-page.md) articles to learn more about what you can do with the OneNote API.

<a name="complete-example-ios"></a>
### Complete code example

**AppDelegate.m**

[!INCLUDE [ios complete example](../includes/onenote/ios-tutorial-appdelegate-m.md)]

<br />
**ViewController.h**

[!INCLUDE [ios complete example](../includes/onenote/ios-tutorial-viewcontroller-h.md)]

<br />
**ViewController.m**

[!INCLUDE [ios complete example](../includes/onenote/ios-tutorial-viewcontroller-m.md)]

<a name="aspnet"></a>
## Create a OneNote app for ASP.NET MVC

This web application uses [Azure Active Directory Authentication Library (ADAL) for .NET](http://go.microsoft.com/fwlink/?LinkId=258232) to authenticate work and school accounts from multiple tenants.

<a name="prereqs-aspnet"></a>
### Prerequisites
Here's what you'll need to follow this tutorial:

- [Visual Studio 2015](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx). You can use the free Visual Studio Community edition.
- A web application registered on the [Azure Management Portal](http://manage.windowsazure.com/), with the following delegated permissions: 
    - **Sign in and read user profile** for Windows Azure Active Directory
    - **View and modify OneNote notebooks** for OneNote  

  <br />Visual Studio registers the web app for you during app creation, but you'll still need to add permissions for OneNote and generate an app key. (Learn more about [app registration](../howto/onenote-auth.md#register-aad).)

<br />
<p id="top-padding">**To create a OneNote app using ASP.NET MVC:**</p>
<p id="indent">1. [Create the project](#create-project-aspnet)</p>
<p id="indent">2. [Add the ADAL for .NET library](#add-dependencies-aspnet)</p>
<p id="indent">3. [Build the UI](#build-ui-aspnet)</p>
<p id="indent">4. [Add auth support](#add-auth-aspnet)</p>
<p id="indent">5. [Call the OneNote API](#call-api-aspnet)</p>

[Complete code examples](#complete-example-aspnet) for key sample files are included at the end of the tutorial. 


<a name="create-project-aspnet"></a>
### Create the project in Visual Studio

1. In Visual Studio, create an **ASP.NET Web Application** project named *OneNote-WebApp*.  

2. Choose the **MVC** template and make sure that MVC is selected for the **Add folders and core references** option.   

2. Choose **Change Authentication**, and then choose **Work And School Accounts**.  

2. Choose **Cloud - Multiple Organizations** and enter the domain name of your developer tenant (for example, *contoso.onmicrosoft.com*). 

You can keep or clear the Microsoft Azure **Host in the cloud** setting, as desired. It's not required for this tutorial. Keep all other default settings.

<br />
Visual Studio registers the web app with Azure for you, but you need to finish configuring it in the [Azure Management Portal](http://manage.windowsazure.com/).

1. In your tenant directory in the portal, choose **Applications** and then click the *OneNote-Web* app to open its configuration page.
 
2. In the **Keys** section, choose a duration for a new key.

2. In the **Permissions to other applications** section, add the OneNote application and then add the **View and modify OneNote notebooks** delegated permission. (*[learn more](../howto/onenote-auth.md#onenote-perms-aad)*)

2. Save your changes to the app, and make a copy of the new key before you close the portal. You'll use it soon.


<a name="add-dependencies-aspnet"></a>
### Add ADAL for .NET

The app uses the [Active Directory Authentication Library](http://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) (ADAL) to authenticate and authorize to Azure AD. The app was created using version 2.19.208020213.

1.  In Visual Studio, choose **Tools > NuGet Package Manager > Package Manager Console** and run the following command in the console. 

   ```powershell
   Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
   ```


<a name="build-ui-aspnet"></a>
### Build the UI

This app uses two views for HomeController: Index.cshtml and Page.cshtml.

1. Replace the contents of Views/Home/Index.cshtml with the following code. 
  This adds a drop-down list to select the parent section, a text box to input the page name, and a button.

   ```html
   @model OneNote_WebApp.Models.SectionsViewModel

   @{
       ViewBag.Title = "Index";
   }

   <h2>OneNote ASP.NET MVC web application</h2>

   @Html.Label("Choose a section to create the page in.")

   @using (Html.BeginForm("CreatePageAsync", "Home", new AjaxOptions { UpdateTargetId = "create-page" }))
   {
       <div id="create-page">
           @Html.DropDownListFor(
               m => m.SectionId,
               new SelectList(Model.Sections, "Id", "Name", Model.SectionId))
           @Html.ValidationMessageFor(m => m.SectionId)
           <br />
           <br />
           <table>
               <tr>
                   <td>
                       @Html.Label("Enter a name for the new page.")
                       <br />
                       @Html.TextBox("page-name", null, new { @style = "width=80" })
                   </td>
               </tr>
           </table>
           <button>Create page</button>
       </div>
   }
   ```

2. In the Views/Home folder, create a new view named *Page* and add the following code. This view displays properties for the newly created page.

   ```html
   @model OneNote_WebApp.Models.PageViewModel

   @{
        ViewBag.Title = "Page";
   }

   <h2>Page: @Model.Title</h2>

   <table>
       <tr>
           <td>@Html.Label("Self link: ")</td>
           <td>@Model.Self</td>
       </tr>
       <tr>
           <td>@Html.Label("Native client link: ")</td>
           <td><a href="@Model.PageLinks.ClientUrl">@Model.PageLinks.ClientUrl</a></td>
       </tr>
       <tr>
           <td>@Html.Label("Web client link: ")</td>
           <td><a href="@Model.PageLinks.WebUrl">@Model.PageLinks.WebUrl</a></td>
       </tr>
   </table>
   ```

<a name="add-auth-aspnet"></a>
### Add auth support

The ADAL for .NET client library handles the authentication and authorization process. You'll just need to provide identifiers for your application and add a couple calls. 

1. In the root Web.config file, add the following key/value pairs to the **appSettings** node. Notice that the ClientId and AADInstance have already been added by Visual Studio.

   ```html
   <add key="ida:AppKey" value="ENTER-your-app-key-here" />
   <add key="ida:OneNoteResourceId" value="https://onenote.com/" />
   ```
   
2. Replace the placeholder value for the app key with the key you generated earlier.

2. In App_Start/Start.Auth.cs, add the following **using** statement.

   ```csharp
   using Microsoft.IdentityModel.Clients.ActiveDirectory;
   ```

2. Replace the global variables in the **Startup** class with the following code. The **GetAuthorizedClient** method in HomeController also uses the four public variables.

   ```csharp
   public static string ClientId = ConfigurationManager.AppSettings["ida:ClientId"];
   public static string AppKey = ConfigurationManager.AppSettings["ida:AppKey"];
   public static string AADInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
   public static string OneNoteResourceId = ConfigurationManager.AppSettings["ida:OneNoteResourceId"];
   private string Authority = AADInstance + "common"; 
   ```

2. In the **ConfigureAuth** method, replace the **app.UseOpenIdConnectAuthentication** method with the following code. ADAL stores tokens and other information in the token cache. (To see what's cached, add this line before returning the task: `var cache = context.TokenCache.ReadItems();`)

   ```csharp
   app.UseOpenIdConnectAuthentication(
      new OpenIdConnectAuthenticationOptions
      {
          ClientId = ClientId,
          Authority = Authority,
          TokenValidationParameters = new System.IdentityModel.Tokens.TokenValidationParameters
          {
              ValidateIssuer = false
          },
          Notifications = new OpenIdConnectAuthenticationNotifications()
          {
               AuthorizationCodeReceived = (context) =>
               {
                   var code = context.Code;
                   ClientCredential credential = new ClientCredential(ClientId, AppKey);
                   Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext authContext =
                      new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(Authority);
                   AuthenticationResult result = authContext.AcquireTokenByAuthorizationCode(
                       code,
                       new Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path)),
                       credential,
                       OneNoteResourceId
                   );
                   return Task.FromResult(0);
               },
               AuthenticationFailed = (context) =>
               {
                   context.HandleResponse();
                   if (context.Exception.HResult == -2146233088) //IDX10311: Nonce is null
                   {
                       context.OwinContext.Response.Redirect("Home/Index");
                   }
                   return Task.FromResult(0);
               }
           }
       });
   ```

2. In Controllers/HomeController.cs, add the following **using** statements.

   ```csharp
   using Microsoft.IdentityModel.Clients.ActiveDirectory;
   using Microsoft.Owin.Security;
   using Microsoft.Owin.Security.OpenIdConnect;
   using Newtonsoft.Json;
   using System.IO;
   using System.Net.Http;
   using System.Net.Http.Headers;
   using System.Security.Claims;
   using System.Text;
   using System.Threading.Tasks;
   using OneNote_WebApp.Models;
   ```

2. In the **HomeController** class, add the **GetAuthorizedClient** method. This method creates and configures the HttpClient used to make the REST requests to the OneNote service.
  It also gets the access token and adds it to the client. 

   ```csharp
   private HttpClient GetAuthorizedClient()
   {
       HttpClient client = new HttpClient();

       string userObjectId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
       string tenantId = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;
       ClientCredential credential = new ClientCredential(Startup.ClientId, Startup.AppKey);
       AuthenticationContext authContext = new AuthenticationContext(Startup.AADInstance + tenantId);

       try
       {
           // Call AcquireTokenSilent to get the access token. This first tries to get the token from cache.
           AuthenticationResult authResult = authContext.AcquireTokenSilent(
               Startup.OneNoteResourceId,
               credential,
               new UserIdentifier(userObjectId, UserIdentifierType.UniqueId));
           client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);
           client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
       }
       catch (AdalSilentTokenAcquisitionException)
       {
           HttpContext.GetOwinContext().Authentication.Challenge(
               new AuthenticationProperties() { RedirectUri = "/" },
               OpenIdConnectAuthenticationDefaults.AuthenticationType);
           return null;
       }

       return client;
   }
   ```

Now you're ready to make calls to the OneNote service and parse the response.
 

<a name="call-api-aspnet"></a>
### Call the OneNote API

When the app loads, it gets the name and ID of the 10 most recently modified sections and populates the drop-down list with the section names. The new OneNote page is created in the selected section.

1. In the **HomeController** class, add global variables for the OneNote endpoints and the path to the image file to add to the new page.

   ```csharp
   public static string OneNoteRoot = "https://www.onenote.com/api/v1.0/me/notes/";
   public static string SectionsEndpoint = "sections?select=name,id&top=10&orderby=lastModifiedTime%20desc";
   public static string PagesEndpoint = "sections/{0}/pages";
   public static string PathToImageFile = @"C:\<local-path>\logo.png";
   ```

2. Change the placeholder path and file name in the **PathToImageFile** variable to point to a local PNG image.

2. Replace the **Index** method with the following code. This gets the sections, prepares **SectionsViewModel** for the Index view, and loads the view.

   ```csharp
   public async Task<ActionResult> Index()
   {
       SectionsViewModel viewModel = new SectionsViewModel();
       try
       {
           viewModel.Sections = await GetSectionsAsync();
       }
       catch (Exception ex)
       {
           return View("Error", new HandleErrorInfo(new Exception(ex.Message), "Home", "GetSectionsAsync"));
       }
       return View(viewModel);
   }
   ```

2. Add the **GetSectionsAsync** method to build and send the *GET sections* request and to parse the response.

   ```csharp    
   [Authorize]
   [HttpGet]   
   public async Task<IEnumerable<Section>> GetSectionsAsync()
   {
       List<Section> sections = new List<Section>();
         
       HttpClient client = GetAuthorizedClient();
       HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, OneNoteRoot + SectionsEndpoint);
       HttpResponseMessage response = await client.SendAsync(request);
       if (response.IsSuccessStatusCode)
       {

           // Parse the JSON response.
           string stringResult = await response.Content.ReadAsStringAsync();
           Dictionary<string, dynamic> result = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(stringResult);
           foreach (var item in result["value"])
           {
               var current = item.ToObject<Dictionary<string, string>>();
               Section section = new Section
               {
                   Name = current["name"],
                   Id = current["id"]
               };
               sections.Add(section);
           }
       }
       else
       {
           throw new Exception("Error getting sections: " + response.StatusCode.ToString());
       }
       return sections;
   }
   ```

2. Add the **CreatePageAsync** method to build and send the *POST pages* multipart request and to parse the response. This request creates a simple HTML page. 

   ```csharp       
   [Authorize]
   [HttpPost]
   public async Task<ActionResult> CreatePageAsync()
   {
       HttpClient client = GetAuthorizedClient();

       // Get user input.
       string selectedSectionId = Request.Form["SectionId"];
       string pageName = Request.Form["page-name"];
       string pagesEndpoint = string.Format("sections/{0}/pages", selectedSectionId);

       // Define the page content, which includes an uploaded image.
       const string imagePartName = "imageBlock1";
       string iso8601Date = DateTime.Now.ToString("o");
       string pageHtml = "<html>" +
                         "<head>" +
                         "<title>" + pageName + "</title>" +
                         "<meta name=\"created\" content=\"" + iso8601Date + "\" />" +
                         "</head>" +
                         "<body>" +
                         "<h1>This is a page with an image</h1>" +
                         "<img src=\"name:" + imagePartName +
                         "\" alt=\"No mis monos\" width=\"250\" height=\"200\" />" +
                         "</body>" +
                         "</html>";

       HttpResponseMessage response;

       // Build the 'POST pages' request.
       var stream = new FileStream(PathToImageFile, FileMode.Open);
       using (var imageContent = new StreamContent(stream))
       {
           try
           {
               imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
               MultipartFormDataContent pageContent = new MultipartFormDataContent
               {
                   {new StringContent(pageHtml, Encoding.UTF8, "text/html"), "Presentation"},
                   {imageContent, imagePartName}
               };

               response = await client.PostAsync(OneNoteRoot + pagesEndpoint, pageContent);
               if (!response.IsSuccessStatusCode)
               {
                   throw new Exception(response.StatusCode + ": " + response.ReasonPhrase);
               }
               else
               {

                   // Parse the JSON response.
                   string stringResult = await response.Content.ReadAsStringAsync();
                   Dictionary<string, dynamic> pageData = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(stringResult);
                   Dictionary<string, dynamic> linksData = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(pageData["links"].ToString());
                   Links pageLinks = new Links
                   {
                       ClientUrl = new Uri(linksData["oneNoteClientUrl"]["href"].ToString()),
                       WebUrl = new Uri(linksData["oneNoteWebUrl"]["href"].ToString())
                   };
                   PageViewModel pageViewModel = new PageViewModel
                   {
                       Title = pageData["title"],
                       Self = new Uri(pageData["self"]),
                       PageLinks = pageLinks
                   };
                   return View("../home/page", pageViewModel);
               }
           }
           catch (Exception ex)
           {
               return View("Error", new HandleErrorInfo(new Exception(ex.Message), "Home", "CreatePageAsync"));
           }
       }
   }
   ```

2. In the Models folder, add new class named *Resource.cs* and use the following code. This defines the domain models that represent OneNote sections and pages, and the view models that represent OneNote data in the **Index** and **Page** views.

   ```csharp
   using System;
   using System.Collections.Generic;
   using System.IO;

   namespace OneNote_WebApp.Models
   {

       // Common properties of OneNote entities.
       public class Resource
       {
           public string Id { get; set; }
           public string CreatedBy { get; set; }
           public DateTimeOffset CreatedTime { get; set; }
           public string LastModifiedBy { get; set; }
           public DateTimeOffset LastModifiedTime { get; set; }
           public Uri Self { get; set; }
       }
      
       // A OneNote section with some key properties. 
       public class Section : Resource
       {
           public bool IsDefault { get; set; }
           public string Name { get; set; }
           public ICollection<Page> Pages { get; set; }
           public Uri PagesUrl { get; set; }
       }
   
       // A OneNote page with some key properties.
       // This app doesn't use the Page model.
       public class Page : Resource
       {
           public Stream Content { get; set; }
           public Uri ContentUrl { get; set; }
           public Links PageLinks { get; set; }
           public string Title { get; set; }
       }
            
       // The links that open a OneNote page in the installed client or in OneNote Online.
       public class Links
       {
           public Uri ClientUrl { get; set; }
           public Uri WebUrl { get; set; }
       }
      
       // The view model used to populate the section drop-down list.
       public class SectionsViewModel
       {
           public string SectionId { get; set; }
           public IEnumerable<Section> Sections { get; set; }
       }
      
       // The view model used to display properties of the new page.
       public class PageViewModel
       {
           public string Title { get; set; }
           public Uri Self { get; set; }
           public Links PageLinks { get; set; }
       }
   }
   ```


After you've created the app, you can run it with F5 debugging.

If you get an *No assembly found containing an OwinStartupAttribute...* error, add the following attribute after the **using** statements in the Startup.cs class in the root directory. (*[learn more](http://www.asp.net/aspnet/overview/owin-and-katana/owin-startup-class-detection) about this error*)

```
[assembly: OwinStartup(typeof(OneNote_WebApp.Startup))]
```

Sign in to the app using a work or school account that has at least one notebook that contains at least one section. In the app, pick the section where you want to create a page, enter a name for the new page, and then choose **Create page**. If successful, the app displays the title and self, and page links of the new page.

<a name="complete-example-aspnet"></a>
### Complete code examples


**Startup.Auth.cs**

[!INCLUDE [aspnet complete example](../includes/onenote/aspnet-tutorial-startup-auth.md)]

<br />
**HomeController**

[!INCLUDE [aspnet complete example](../includes/onenote/aspnet-tutorial-homecontroller.md)]

<br />
**Index.cshtml**, **Page.cshtml**, and **Resource.cs** are shown in their entirety in the instructions.


**Next steps:** See the [Develop with the OneNote API](../howto/onenote-create-page.md) articles to learn more about what you can do with the OneNote API.


<!--

## Create a OneNote app for Android

This tutorial creates an app that uses the Office 365 SDK for Android to authenticate and to access the OneNote APIs. If you prefer to use Live Connect (consumer auth), Azure AD (enterprise auth), or the OneNote API (REST) directly 
 check out the [Android REST API Explorer for OneNote](https://github.com/OneNoteDev/Android-REST-API-Explorer).

This example accesses Office 365 notebooks, though the SDK also supports SharePoint-hosted notebooks and Live Connect auth for consumer notebooks. (The SDK includes a sample that uses Live Connect(xx).)

After you've set up your development environment() and registered your app(), we'll follow these steps in Android Studio:

1. Create a project and configure dependencies
2. Set up authentication 
3. Construct the API client
4. Use client methods to call the OneNote API 

**Note:** If you're new to Android development, visit the [Get Started with Android Studio](http://developer.android.com/develop/index.html) site for help setting up your development environment and building Android apps.

Before you begin, you'll need:
- The client ID and redirect URI of a native client application that's registered in Azure Active Directory. (See instructions for [setting up accounts](http://blogs.msdn.com/b/onenotedev/archive/2015/04/30/set-up-your-azure-office-365-tenant.aspx) and [registering the app](http://blogs.msdn.com/b/onenotedev/archive/2015/04/30/register-your-application-in-azure-ad.aspx).)
- The [View and modify OneNote notebooks permission scope for OneNote](http://blogs.msdn.com/b/onenotedev/archive/2015/04/30/register-your-application-in-azure-ad.aspx#SpecifyOneNotePerms). We'll use the highest level of OneNote permissions to simplify testing, but you should request the lowest level required by your app as a best practice.
- OneNote [provisioned for your work or school account](http://blogs.msdn.com/b/onenotedev/archive/2015/04/30/set-up-your-azure-office-365-tenant.aspx#ProvisionOneDriveForBusiness).

### Create a project and configure dependencies in build.gradle

1. From the Android Studio splash screen, choose **Start a new Android Studio project**. Enter a name and choose **Next**.
2. Choose **Phone and Tablet**, set **Minimum SDK** to API 18, and then choose **Next**. 
3. Choose **Blank Activity**, then choose **Next**. Keep the default activity settings, and choose **Finish**.
4. In Project view, expand **Gradle Scripts**, and double-click **build.gradle (Module: app)** to open it.
5. In the dependencies closure, add the following dependencies:

	compile 'com.microsoft.services:onenote-services:0.14.2'
	compile 'com.microsoft.orc:orc-engine-android:0.14.2@aar'
	compile 'com.microsoft.aad:adal:1.1.3@aar'

6. Choose the **Sync Project with Gradle Files** button in the toolbar. This downloads the dependencies so Android Studio can assist in coding with them.
7. Open AndroidManifest.xml (app/manifests), and add the following line to the manifest section:

```
	 <uses-permission android:name="android.permission.INTERNET" />
```

8. Open activity_main.xml (app/res/layout) and add the following `id` tag to the "Hello World" text view control.

```
	android:id="@+id/messages"
```
  
### Set up authentication and initialize the dependency manager 

1. Right-click the **values** folder (app/res/values) and choose **New > Values resource file**. Name the file *adal_settings*. 
2. In the `resources` section, add the following code. Then, replace the placeholder values for the client ID and redirect URI with your actual values. (You can get them on the application's Configure tab in the [Azure Management Portal](https://manage.windowsazure.com).)

```
	<string name="AADAuthority">https://login.microsoftonline.com/common</string>
	<string name="AADResourceId">https://onenote.com</string>
	<string name="AADClientId">Your Client ID</string>
	<string name="AADRedirectUrl">Your Redirect URI</string>
```

3. Open the `MainActivity` class (app/java/{package-name}), and add the following imports.

```java
	import android.content.Intent;
	import android.util.Log;
	import android.widget.TextView;
	import com.google.common.util.concurrent.FutureCallback;
	import com.google.common.util.concurrent.Futures;
	import com.google.common.util.concurrent.SettableFuture;
	import com.microsoft.aad.adal.AuthenticationCallback;
	import com.microsoft.aad.adal.AuthenticationContext;
	import com.microsoft.aad.adal.AuthenticationResult;
	import com.microsoft.aad.adal.PromptBehavior;
	import com.microsoft.onenote.api.Page;
	import com.microsoft.onenote.api.orc.OneNoteApiClient;
	import com.microsoft.services.android.impl.ADALDependencyResolver;
	import java.security.NoSuchAlgorithmException;
	import java.util.List;
	import javax.crypto.NoSuchPaddingException;
	import static com.microsoft.aad.adal.AuthenticationResult.AuthenticationStatus;
```

4. Add the following instance fields to the `MainActivity` class:

```java
	private AuthenticationContext mAuthContext;
	private ADALDependencyResolver mResolver;
	private TextView messagesTextView;
```

5. Add the following method to the `MainActivity` class. This constructs and initializes ADAL's `AuthenticationContext`, carries out interactive logon, and constructs the ADALDependencyResolver using `AuthenticationContext`.

```java
    protected SettableFuture<Boolean> logon() {
        final SettableFuture<Boolean> result = SettableFuture.create();

        try {
            mAuthContext = new AuthenticationContext(this, getString(R.string.AADAuthority), true);
            mAuthContext.acquireToken(
                this,
                getString(R.string.AADResourceId),
                getString(R.string.AADClientId),
                getString(R.string.AADRedirectUrl),
                PromptBehavior.Auto,
                new AuthenticationCallback<AuthenticationResult>() {
                    @Override
                    public void onSuccess(final AuthenticationResult authenticationResult) {
                        if (authenticationResult != null
                                && authenticationResult.getStatus() == AuthenticationStatus.Succeeded) {
                            mResolver = new ADALDependencyResolver(
                            mAuthContext,
                            getString(R.string.AADResourceId),
                            getString(R.string.AADClientId));
                            result.set(true);
                        }
                    }
	                @Override
                    public void onError(Exception e) {
                    result.setException(e);
	               }
                });
        } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
            e.printStackTrace();
            result.setException(e);
        }
        return result;
    }
```

6. Add the following method to the `MainActivity` class. This passes the authentication result back to `AuthenticationContext`.

```java
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
	    mAuthContext.onActivityResult(requestCode, resultCode, data);
	}
```

7. Add the following code to the MainActivity.onCreate method. This caches the `messages` TextView, and then calls `logon()` and hooks up to its completion. 

```java
    messagesTextView = (TextView) findViewById(R.id.messages);
    Futures.addCallback(logon(), new FutureCallback<Boolean>() {
        @Override
        public void onSuccess(Boolean result) {
			// construct the API client
        }

        @Override
        public void onFailure(Throwable t) {
            Log.e("logon", t.getMessage());
        }
    });
```

### Construct the API client

1. Add the following code to the `onSuccess` method of the FutureCallback that you just added in the previous step. This creates the API client and calls a method that uses the API client.

```java
	mClient = new OneNoteApiClient(oneNoteBaseUrl, mResolver);
	getPages();
    //createNotebook();
```

2. Add the following instance fields to the `MainActivity` class. OneNote support for Office 365 notebooks is in Preview, so we'll use the `/beta` path for the OneNote base URL.

```java
	private static final String oneNoteBaseUrl = "https://www.onenote.com/api/beta/";
	private OneNoteApiClient mClient;
```

### Use client methods to call the OneNote API

1. Add the following method to the `MainActivity` class. This uses the API client to get the name and ID of your three newest OneNote pages.

```java
    protected void getPages() {
        Futures.addCallback(
            mClient.getme()
                    .getNote()
                    .getPages()
                    .top(3)
                    .select("title,self")
                    .orderBy("createdTime desc")
                    .read(),
            new FutureCallback<List<Page>>() {
                @Override
                public void onSuccess(final List<Page> result) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            for (Page page : result) {
                                String data = String.format(
                                        "Title: %1$s, Endpoint: %2$s\n",
                                        page.getTitle(), page.getSelf());
                                messagesTextView.append(data);}
                        }
                    });
                }
                @Override
                public void onFailure(final Throwable t) {
                    Log.e("getPages", t.getMessage());
                }
            });
    }		
```

2. Run the app. If successful, the app displays the names and endpoint URIs of the last three pages you created in your Office 365 notebooks.

You can use the SDK to do the same operations that are [supported in the REST API](http://dev.onenote.com/docs#/reference). For example, use the following method to create a notebook and then show its `id` and `oneNoteWebUrl` properties. 

1. In the `MainActivity` class, add these `import` statements.  

```java
    import com.microsoft.onenote.api.Notebook;
    import java.util.Random;
```

2. And then add the following method. 

```java
    protected void createNotebook() {
        Random random =new Random();
        Notebook notebook = new Notebook();
        notebook.setName("Notebook" + random.nextInt(1000));
        Futures.addCallback(
            mClient.getme()
                    .getNote()
                    .getNotebooks()
                    .add(notebook),
            new FutureCallback<Notebook>() {
                @Override
                public void onSuccess(final Notebook result) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            String data = String.format(
                                    "ID: %1$s\nWeb link: %2$s",
                                    result.getId(),
                                    result.getLinks().getOneNoteWebUrl().getHref());
                            messagesTextView.setText(data);
                        }
                    });
                }
                @Override
                public void onFailure(final Throwable t) {
                    Log.e("createNotebook", t.getMessage());
                }
            });
    }
```

3.  In the `onSuccess` method, comment out the call to `getPages()` and uncomment `createNotebook()`, as shown below:

```java
	//getPages();
	createNotebook();
```

For examples of other OneNote operations, take a look at the [OneNoteTest](https://github.com/OfficeDev/Office-365-SDK-for-Android/blob/master/tests/e2e-test-app/app/src/main/java/com/microsoft/office365/test/integration/tests/OneNoteTests.java) file. 
  **Note!** Unlike the asynchronous calls used in the previous examples, these calls are sent synchronously by using the `get` method. For example: 

```java
	List<Notebook> notebooks = client.getme().getNote().getNotebooks().read().get();
```

### OneNoteSample project uses Live Connect

There's a OneNoteSample project in the SDK that uses Live Connect authentication to get your notebooks that are stored on OneDrive. To run it, just import the project into Android Studio and set your client ID in the `Constants` class.

-->

<a name="see-also"></a>
## Additional resources

- [Create OneNote pages](../howto/onenote-create-page.md)
- [Add images and files](../howto/onenote-images-files.md)
- [OneNote development](../howto/onenote-landing.md)
- [OneNote Dev Center](http://dev.onenote.com/)
- [OneNote Developer Blog](http://go.microsoft.com/fwlink/?LinkID=390183)
- [OneNote development questions on Stack Overflow](http://go.microsoft.com/fwlink/?LinkID=390182) 
- [OneNote GitHub repos](http://go.microsoft.com/fwlink/?LinkID=390178)  



