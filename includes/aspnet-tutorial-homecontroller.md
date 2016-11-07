```csharp
using System;
using System.Collections.Generic;
using System.Web.Mvc;
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

namespace OneNote_WebApp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {

        // Route segments to OneNote resource endpoints.
        public static string OneNoteRoot = "https://www.onenote.com/api/v1.0/me/notes/";
        public static string SectionsEndpoint = "sections?select=name,id&top=10&orderby=lastModifiedTime%20desc";
        public static string PagesEndpoint = "sections/{0}/pages";

        // Path to the image file to add to the page. 
        // Change this to point to a local PNG file before running the app.
        public static string PathToImageFile = @"C:\<local-path>\logo.png";

        // Get sections, add them to SectionsViewModel, and load the view. 
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

        // Create and configure the HttpClient used for requests to the OneNote API. 
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

        [Authorize]
        [HttpGet]
        // Build the 'GET sections' request and parse the response. The request gets the 10 most recently modified sections.
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

        [Authorize]
        [HttpPost]
        // Build the multipart POST request and parse the response. The request creates a page in the selected section.
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

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
```