#import <UIKit/UIKit.h>

@interface AROpaqueImageView : UIImageView
@property (nonatomic, strong, readwrite) NSURL *imageURL;
@property (nonatomic, strong, readwrite) UIColor *placeholderBackgroundColor;
@property (nonatomic, readwrite) BOOL *noAnimation;
@property (nonatomic, readwrite) BOOL *failSilently;
@property (nonatomic, readwrite) BOOL *highPriority;
@end
