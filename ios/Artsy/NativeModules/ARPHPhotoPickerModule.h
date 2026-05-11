#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <PhotosUI/PhotosUI.h>

@interface ARPHPhotoPickerModule : NSObject <RCTBridgeModule, PHPickerViewControllerDelegate>
@end
