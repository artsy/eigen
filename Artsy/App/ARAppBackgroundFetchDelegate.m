#import "ARAppBackgroundFetchDelegate.h"
#import "ARRouter.h"
#import "ARNetworkConstants.h"
#import "ArtsyWatchAPI.h"
#import "ARFileUtils.h"
#import "ArtsyAPI+Private.h"


@implementation ARAppBackgroundFetchDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].backgroundFetchDelegate = [[self alloc] init];
}

+ (NSString *)pathForDownloadedShowFeed
{
    return [ARFileUtils cachesPathWithFolder:@"PartnerShows" filename:@"feed.dict"];
}

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler
{
    ARActionLog(@"Fetching show feed in the background.");

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {

        // Do not trust that we can use the keychain like we can normally with ARRouter
        NSMutableURLRequest *request = [[ARRouter newShowFeedRequestWithCursor:nil pageSize:5] mutableCopy];
        [request setValue:xappToken forHTTPHeaderField:ARXappHeader];

        // Use a unique URL client to grab the data, this bypasses all our security
        // around logging in/out, we have a unique xappToken either by having access
        // to the local one or by grabbing a new one.

        NSURLSession *session = [NSURLSession sharedSession];
        NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            id JSON = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            if ([JSON isKindOfClass:[NSDictionary class]]) {

                // Save the downloaded JSON to a known place for ARShowFeed to grab
                // when the app is opened

                NSString *path = [self.class pathForDownloadedShowFeed];
                [NSKeyedArchiver archiveRootObject:JSON toFile:path];

                ARActionLog(@"Downloaded show feed in the background");

                // Try be smart around whether  we needed to do our parsing
                // to quote runkeeper "don't DDOS yourself" we keep track of
                // the cursor that would be needed next time

                NSString *cursorDefault = @"ARBackgroundFetchCursor";
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSString *cursor = JSON[@"next"];

                BOOL sameCursor = [[defaults stringForKey:cursorDefault] isEqualToString:cursor];
                if (completionHandler && !sameCursor) {
                    [defaults setObject:cursor forKey:cursorDefault];
                    [defaults synchronize];

                    completionHandler(UIBackgroundFetchResultNewData);

                } else if (completionHandler && sameCursor){
                    completionHandler(UIBackgroundFetchResultNoData);
                }
                return;
            }

            ARErrorLog(@"Error feed is in an unexpected format");
            if (completionHandler) {
                completionHandler(UIBackgroundFetchResultFailed);
            }
        }];
        [task resume];

    } failure:^(NSError *error) {
        ARErrorLog(@"Could not get an xapp token for background fetch");
        if (completionHandler) {
            completionHandler(UIBackgroundFetchResultFailed);
        }
    }];
}

@end
