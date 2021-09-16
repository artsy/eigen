#import <UIKit/UIKit.h>

@protocol ARShareableObject;

@interface ARSharingController : NSObject

+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL;
+ (instancetype)sharingControllerWithObject:(id)object thumbnailImageURL:(NSURL *)thumbnailImageURL image:(UIImage *)image;

- (NSString *)objectID;
- (void)presentActivityViewControllerFromView:(UIView *)view;
// Frame is ignored on iPhones; we use it on iPad to present a popover.
- (void)presentActivityViewControllerFromView:(UIView *)view frame:(CGRect)frame;

@property (nonatomic, readonly) id<ARShareableObject> object;

@end
