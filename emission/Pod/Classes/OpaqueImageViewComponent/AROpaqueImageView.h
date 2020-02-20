#import <UIKit/UIKit.h>

@interface AROpaqueImageView : UIImageView
@property (nonatomic, strong, readwrite) NSURL *imageURL;
@property (nonatomic, strong, readwrite) UIColor *placeholderBackgroundColor;
@property (nonatomic, assign, readwrite) BOOL noAnimation;
@property (nonatomic, assign, readwrite) BOOL failSilently;
@property (nonatomic, assign, readwrite) BOOL highPriority;
@end
