```objective-c
#import "AppDelegate.h"
#import <OneDriveSDK/OneDriveSDK.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


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

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end

```