#import <UIKit/UIKit.h>


@interface ARMessageItemProvider : UIActivityItemProvider
- (instancetype)initWithMessage:(NSString *)message path:(NSString *)path;
@end
