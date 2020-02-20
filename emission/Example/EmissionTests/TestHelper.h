#import <UIKit/UIKit.h>
#import <Specta/Specta.h>

#import "RCTTestRunner.h"

NS_ASSUME_NONNULL_BEGIN

@interface TestHelper : NSObject <UIApplicationDelegate>

@property (nonatomic, strong, readwrite) UIWindow *window;
@property (nonatomic, strong, readonly) NSURL *fixturesURL;
@property (nonatomic, strong, readonly) NSArray<NSDictionary *> *artworksPages;
@property (nonatomic, strong, readonly) NSArray<NSDictionary *> *artworks;
@property (nonatomic, strong, readonly) RCTTestRunner *reactTestRunner;

+ (instancetype)sharedHelper;

- (void)runReactTestInRecordMode:(BOOL)recordMode
                          module:(NSString *)moduleName
                           props:(NSDictionary * _Nullable)props;

@end

NS_ASSUME_NONNULL_END
