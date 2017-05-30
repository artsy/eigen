#import <Emission/ARComponentViewController.h>

@interface ARMessagesComponentViewController : ARComponentViewController

- (instancetype)initWithMessages;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end
