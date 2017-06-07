#import <Emission/ARComponentViewController.h>

@interface ARInboxComponentViewController : ARComponentViewController

- (instancetype)initWithInbox;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end
