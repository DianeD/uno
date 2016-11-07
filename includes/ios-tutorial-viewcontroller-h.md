```objective-c
#import <UIKit/UIKit.h>
#import <OneDriveSDK/OneDriveSDK.h>
 
@interface ViewController : UIViewController<UIPickerViewDelegate, UIPickerViewDataSource>
 
@property (strong, nonatomic) ODClient *client;
 
// Variables to store the response data.
@property (strong, nonatomic) NSHTTPURLResponse *returnResponse;
@property (strong, nonatomic) NSMutableData *returnData;
 
// Outlet connections for controls.
@property (weak, nonatomic) IBOutlet UIPickerView *sectionPicker;
@property (weak, nonatomic) IBOutlet UIButton *createPageButton;
 
@end
```