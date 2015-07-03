#import <UIKit/UIKit.h>


@interface ARProfileViewController : UIViewController

- (instancetype)initWithProfileID:(NSString *)profileID;

@property (nonatomic, strong, readonly) NSString *profileID;

@end
