The OneNote service root URL uses the following format for all calls to the OneNote API.

`https://www.onenote.com/api/{version}/{location}/notes/`

<br />
The `version` segment in the URL represents the version of the OneNote API that you want to use.

- Use `v1.0` for stable production code.
- Use `beta` to try out a feature that's in development. Features and functionality in beta may change, so you shouldn't use it in your production code. 

<br />
The `location` segment in the URL represents the location of the notebooks that you want to access:

**Notebooks on OneDrive for Business**  
Use `me` for OneNote content that’s owned by the current user.  
Use `users/{id}` for OneNote content that the specified user (in the URL) has shared with the current user. Use the [Azure AD Graph API](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to get user IDs.

**SharePoint site notebooks**  
Team sites and other SharePoint sites can contain OneNote notebooks in their document libraries.  
Use `myOrganization/siteCollections/{id}/sites/{id}` for OneNote content in a site in the tenant that the current user is logged into. Only the current tenant is supported, accessed using the `myOrganization` keyword. Learn how to get [site IDs](#get-site-id).

**Unified group notebooks**  
Unified groups (also called *Office 365 groups*) are part of the Office 365 connected experience. Group members can share notebooks, files, and email.  
Use `myOrganization/groups/{id}` for OneNote content in the specified group that the current user is a member of. Unified groups are the only supported group type. Use the [Azure AD Graph API](https://msdn.microsoft.com/library/azure/ad/graph/api/api-catalog) to get group IDs.

<br />
<a name="get-site-id"></a>
**Use the *FromUrl* method to get the site collection and site IDs**  
You can use the **FromUrl** method to get the site collection and site IDs for a specified absolute site URL. You should make this call only when needed, and then store the values for future use.

The format of the site URL depends on your configuration, for example https://domain.sharepoint.com/site-a or https://domain.com/sites/site-a.

Example request:

```
GET https://www.onenote.com/api/v1.0/myOrganization/siteCollections/FromUrl(url='{full-path-to-SharePoint-site}')
Authorization: Bearer {token}
Accept: application/json
```

Example response:

```
{
  "@odata.context":"https://www.onenote.com/api/v1.0/$metadata#Microsoft.OneNote.Api.SiteMetadata",
  "siteCollectionId":"09d1a587-a84b-4264-3d15-669429be8cc5",
  "siteId":"d9e4d5c8-683f-4363-89ae-18c4e3da91e9"
}
```

Requirements for using **FromUrl** and working with SharePoint site notebooks:

- You can only create OneNote notebooks, section groups, sections, and pages on sites that have a default document library. (Some site templates don't create a default document library.) However, GET requests return OneNote content from all document libraries on the site.
- The OneNote service root URL is immutable, meaning you can't use a SharePoint REST API site path and then tack the `notes` endpoint onto it.
- The user on whose behalf you're calling must be a member of the site.
- **FromUrl** works only with sites that have been indexed. It may take several hours to index a new site.
