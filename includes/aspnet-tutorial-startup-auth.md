```csharp
using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace OneNote_WebApp
{
    public partial class Startup
    {

        // Properties used for authorization.
        public static string ClientId = ConfigurationManager.AppSettings["ida:ClientId"];
        public static string AppKey = ConfigurationManager.AppSettings["ida:AppKey"];
        public static string AADInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        public static string OneNoteResourceId = ConfigurationManager.AppSettings["ida:OneNoteResourceId"];
        private string Authority = AADInstance + "common";

        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions { });

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
        }
    }
}
```