#import <Foundation/Foundation.h>

/// Determines app wide statuses


@interface ARAppStatus : NSObject

/// Is the app running on Testflight or locally as a developer.
+ (BOOL)isBetaOrDev;

/// Is the app a demo release.
+ (BOOL)isDemo;

/// Is the app running tests?
+ (BOOL)isRunningTests;
@end
