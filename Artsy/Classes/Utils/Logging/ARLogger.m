#import <CocoaLumberjack/DDASLLogger.h>
#import <CocoaLumberjack/DDTTYLogger.h>
#import <CocoaLumberjack/DDFileLogger.h>
#import "ARHTTPRequestOperationLogger.h"
#import "ARLogFormatter.h"

@implementation ARLogger

+ (BOOL)shouldLogNetworkRequests;
{
    return ![ARDeveloperOptions options][@"suppress_network_logs"];
}

+ (instancetype)sharedLogger {
    static ARLogger *_sharedLogger = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedLogger = [[self alloc] init];
    });

    return _sharedLogger;
}

- (void)startLogging
{
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyLightGrey] backgroundColor:nil forFlag:(LOG_FLAG_DEBUG)];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyAttention] backgroundColor:nil forFlag:LOG_FLAG_INFO];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor artsyRed] backgroundColor:nil forFlag:LOG_FLAG_ERROR];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor colorWithHex:0x66cc4c] backgroundColor:nil forFlag:LOG_FLAG_INFO context:ARLogContextRequestOperation];
    [[DDTTYLogger sharedInstance] setForegroundColor:[UIColor colorWithHex:0xe56633] backgroundColor:nil forFlag:LOG_FLAG_ERROR context:ARLogContextRequestOperation];

    //Console.app + Xcode log window// We could reuse the formatter, but then our date formatter would
    // need to be thread-safe
    // See: https://github.com/robbiehanson/CocoaLumberjack/wiki/CustomFormatters
    [[DDASLLogger sharedInstance] setLogFormatter: [[ARLogFormatter alloc] init]];
    [[DDTTYLogger sharedInstance] setLogFormatter: [[ARLogFormatter alloc] init]];
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
