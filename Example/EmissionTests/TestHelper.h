#import <UIKit/UIKit.h>

@interface TestHelper : NSObject <UIApplicationDelegate>

@property (nonatomic, strong, readonly) UIWindow *window;
@property (nonatomic, strong, readonly) NSURL *fixturesURL;
@property (nonatomic, strong, readonly) NSArray<NSDictionary *> *artworksPages;
@property (nonatomic, strong, readonly) NSArray<NSDictionary *> *artworks;

+ (instancetype)sharedHelper;

@end
