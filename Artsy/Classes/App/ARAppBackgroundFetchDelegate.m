#import "ARAppBackgroundFetchDelegate.h"
#import "ARFileUtils.h"


@implementation ARAppBackgroundFetchDelegate

+ (void)load
{
    //[JSDecoupledAppDelegate sharedAppDelegate].backgroundFetchDelegate = [[self alloc] init];
}

+ (NSString *)pathForDownloadedShowFeed
{
    return [ARFileUtils cachesPathWithFolder:@"PartnerShows" filename:@"feed.dict"];
}

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler
{
    ARActionLog(@"Fetching show feed in the background.");

    [ArtsyAPI getFeedResultsForShowsWithCursor:nil pageSize:10 success:^(NSDictionary *JSON) {
        if ([JSON isKindOfClass:[NSDictionary class]]) {

            NSString *path = [self.class pathForDownloadedShowFeed];
            [NSKeyedArchiver archiveRootObject:JSON toFile:path];

            ARActionLog(@"Downloaded show feed in the background");

            if (completionHandler) {
                completionHandler(UIBackgroundFetchResultNewData);
            }

            return;
        }

        ARErrorLog(@"Error feed is in an unexpected format");
        if (completionHandler) {
            completionHandler(UIBackgroundFetchResultFailed);
        }

    } failure:^(NSError *error) {
        ARErrorLog(@"Error downloading feed from the background : %@", error.localizedDescription);
        if (completionHandler) {
            completionHandler(UIBackgroundFetchResultFailed);
        }
    }];
}

@end
