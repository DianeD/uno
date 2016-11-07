```objective-c
#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

static NSString const *serviceRootUrl = @"https://www.onenote.com/api/v1.0/me/notes/";
NSMutableDictionary *sectionNamesAndIds;
NSArray *sectionNamesForPicker;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.sectionPicker.delegate = self;
    self.sectionPicker.dataSource = self;
    
    [ODClient clientWithCompletion:^(ODClient *odClient, NSError *error) {
        if (!error){
            self.client = odClient;
            [self getSections];
        }
        else {
            NSLog(@"Error with auth: %@", [error localizedDescription]);
        }
    }];
}

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

// Format the "created" date. OneNote requires the ISO 8601 format.
- (NSString *)formatDate {
    NSDate *now = [NSDate date];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    NSLocale *enUSPOSIXLocale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
    [dateFormatter setLocale:enUSPOSIXLocale];
    [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
    return [dateFormatter stringFromDate:now];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

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
@end

```