#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARHomeComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *selectedArtist;

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID
                                   tab:(NSInteger)selectedTab
                              emission:(nullable AREmission*)emission NS_DESIGNATED_INITIALIZER;


- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
