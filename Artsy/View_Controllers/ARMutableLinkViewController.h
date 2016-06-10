#import <UIKit/UIKit.h>


@interface ARMutableLinkViewController : UIViewController

- (instancetype)initWithPath:(NSString *)path;

@property (nonatomic, strong, readonly) NSString *originalPath;

@end
