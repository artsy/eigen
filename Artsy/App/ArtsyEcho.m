#import "ArtsyEcho.h"
#import <Keys/ArtsyKeys.h>
#import <Foundation/Foundation.h>
#import "ARAppStatus.h"

@implementation ArtsyEcho

- (instancetype)init
{
    ArtsyKeys *keys = [ArtsyKeys new];
    NSURL *url = [[NSURL alloc] initWithString:@"https://echo-api-production.herokuapp.com/"];
    self = [self initWithServerURL:url accountID:1 APIKey:[keys artsyEchoProductionToken] localFilename:@"Echo"];

    return self;
}

- (void)checkForUpdates:(void (^)(BOOL updatedDataOnServer))updateCheckCompleted
{
    if ([ARAppStatus isRunningTests]) {
        // Prevent all networking in a testing environment.
        updateCheckCompleted(NO);
    } else {
        ArtsyKeys *keys = [ArtsyKeys new];
        if(![[keys artsyEchoProductionToken] isEqualToString:@"-"]) {
            [super checkForUpdates:updateCheckCompleted];
        }
    }
}

- (NSDictionary *)featuresMap
{
    NSMutableDictionary *mutableOptions = [NSMutableDictionary dictionary];
    for (NSString *key in self.features) {
        [mutableOptions setObject:@(self.features[key].state) forKey:key];
    }
    return [mutableOptions copy];
}

@end
