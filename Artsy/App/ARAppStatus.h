#import <Foundation/Foundation.h>

/// Determines app wide statuses


@interface ARAppStatus : NSObject

/// Is the app running locally as a developer.
+ (BOOL)isDev;

/// Is the app running on Testflight.
+ (BOOL)isBeta;

/// Is the app running on Testflight or locally as a developer.
+ (BOOL)isBetaOrDev;

/// Is the app running on Testflight, locally as a developer or an Artsymail email.
+ (BOOL)isBetaDevOrAdmin;

/// Is the app a demo release.
+ (BOOL)isDemo;

/// Is the app running tests?
+ (BOOL)isRunningTests;

/// Do they have an artsymail email?
+ (BOOL)isAdmin;

@end
