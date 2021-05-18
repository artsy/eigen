#import "ArtsyEcho.h"

#import <Foundation/Foundation.h>
#import <react-native-config/ReactNativeConfig.h>

#import "ARAppStatus.h"


@implementation ArtsyEcho

- (instancetype)init
{
    NSURL *url = [[NSURL alloc] initWithString:@"https://echo.artsy.net"];
    self = [self initWithServerURL:url localFilename:@"EchoNew"];

    if (self) {
        [self setup];
    }

    return self;
}

- (void)checkForUpdates:(void (^)(BOOL updatedDataOnServer))updateCheckCompleted
{
    if ([ARAppStatus isRunningTests]) {
        // Prevent all networking in a testing environment.
        updateCheckCompleted(NO);
        return;
    }

    if (![[ReactNativeConfig envFor:@"_OSS_"] isEqualToString:@"true"]) {
        [super checkForUpdates:updateCheckCompleted];
    }
}

- (BOOL)isFeatureEnabled:(NSString *)featureFlag
{
    Feature *currentFeature = self.features[featureFlag];
    if (currentFeature) {
        return currentFeature.state;
    } else {
        return NO;
    }
}

@end
