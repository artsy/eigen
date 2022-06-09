#import "ARLogger.h"
#import <CocoaLumberjack/DDASLLogger.h>
#import <CocoaLumberjack/DDTTYLogger.h>
#import <CocoaLumberjack/DDFileLogger.h>

#import "ARFonts.h"
#import "ARHTTPRequestOperationLogger.h"
#import "ARLogFormatter.h"

#import <EDColor/EDColor.h>

@implementation ARLogger

+ (BOOL)shouldLogNetworkRequests;
{
#ifdef DEBUG
    return YES;
#else
    return NO;
#endif
}

+ (instancetype)sharedLogger
{
    static ARLogger *_sharedLogger = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedLogger = [[self alloc] init];
    });

    return _sharedLogger;
}

- (void)startLogging
{
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyGrayRegular] backgroundColor:nil forFlag:DDLogFlagDebug];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyYellowRegular] backgroundColor:nil forFlag:DDLogFlagInfo];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyRedRegular] backgroundColor:nil forFlag:DDLogFlagError];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor colorWithHex:0x66cc4c] backgroundColor:nil forFlag:DDLogFlagInfo context:ARLogContextRequestOperation];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor colorWithHex:0xe56633] backgroundColor:nil forFlag:DDLogFlagError context:ARLogContextRequestOperation];

    //Console.app + Xcode log window// We could reuse the formatter, but then our date formatter would
    // need to be thread-safe
    // See: https://github.com/robbiehanson/CocoaLumberjack/wiki/CustomFormatters
    [[DDASLLogger sharedInstance] setLogFormatter:[[ARLogFormatter alloc] init]];
    [[DDTTYLogger sharedInstance] setLogFormatter:[[ARLogFormatter alloc] init]];
    [DDTTYLogger sharedInstance].colorsEnabled = YES;
    [DDLog addLogger:[DDASLLogger sharedInstance]];
    [DDLog addLogger:[DDTTYLogger sharedInstance]];
    [self addDDFileLogger];

    if ([self.class shouldLogNetworkRequests]) {
        [[ARHTTPRequestOperationLogger sharedLogger] startLogging];
    }
}

- (void)dealloc
{
    [self stopLogging];
}

- (void)stopLogging
{
    [[ARHTTPRequestOperationLogger sharedLogger] stopLogging];
}

// At the moment, everything gets logged to one log. We can change this to sort based on context and to only log Errors.
- (void)addDDFileLogger
{
    DDFileLogger *logger = [[DDFileLogger alloc] init];
    logger.rollingFrequency = -1;

    // Have up to 30 1MB files
    logger.maximumFileSize = 1024 * 1024;
    logger.logFileManager.maximumNumberOfLogFiles = 30;
    [logger setLogFormatter:[[ARLogFormatter alloc] init]];
    [DDLog addLogger:logger];
}

@end
