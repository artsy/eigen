#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>

@interface ARAppBackgroundFetchDelegate : NSObject <JSApplicationBackgroundFetchDelegate>

+ (NSString *)pathForDownloadedShowFeed;

@end
