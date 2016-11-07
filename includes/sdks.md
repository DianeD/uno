OneNote apps can use the OneDrive API SDK to get the access tokens that are required for all requests to the OneNote API. The SDK makes authentication easier for you. You just provide your identity information and integrate a few calls, and the SDK handles everything from sign in and consent to getting, storing, and refreshing tokens. Then, you can make REST calls to the OneNote API. Our [iOS tutorial](../../howto/onenote-tutorial.md#ios) shows how you can use the SDK in a OneNote app.

All versions of the SDK support Microsoft account authentication (for consumer notebooks), and some also support Azure Active Directory (for enterprise notebooks). See the [OneDrive documentation](https://dev.onedrive.com/sdks.htm) for the current list of supported platforms.

>The OneDrive API SDK replaces the Live SDK. The Live SDK is deprecated but will continue to support existing OneNote applications that use it. For new development, use the OneDrive API SDK.

At some point, we may provide libraries that both handle authentication and support native calls to the OneNote API, but for now you can use the OneDrive API SDK.

Alternatively, enterprise apps can use the [Active Directory Authentication Library](https://azure.microsoft.com/documentation/articles/active-directory-authentication-libraries/) (ADAL) to access Office 365 and SharePoint-hosted notebooks. You might consider using ADAL directly if there's no SDK available for your platform or if you want more control over the auth process. Our [ASP.NET MVC tutorial](../../howto/onenote-tutorial.md#aspnet) shows how you can use ADAL in a OneNote app.

**Important!** To interact with OneNote content and resources, you should always use the OneNote API. Don't use the OneDrive API.