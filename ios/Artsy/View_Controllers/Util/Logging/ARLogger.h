#import <CocoaLumberjack/DDLogMacros.h>
#import <AFNetworkActivityLogger/AFNetworkActivityLogger.h>

#ifdef DEBUG
static const int ddLogLevel = DDLogLevelVerbose;
static const int httpLogLevel = AFLoggerLevelInfo;
#else
static const int ddLogLevel = DDLogLevelWarning;
static const int httpLogLevel = AFLoggerLevelError;
#endif

// If you update this enum, update `contextMap` in the implementation too please
typedef NS_ENUM(NSInteger, ARLogContext) {
    // starting at 1 because 0 is the default
    ARLogContextInfo = 1,
    ARLogContextAction,
    ARLogContextError,
    ARLogContextRequestOperation
};


@interface ARLogger : NSObject
/// Call this ASAP to get logging up and running
- (void)startLogging;
- (void)stopLogging;
+ (BOOL)shouldLogNetworkRequests;
+ (instancetype)sharedLogger;
@end

#pragma mark -
#pragma mark Context specific macros

#define ARLogInfo(frmt, ...) LOG_MAYBE(NO, LOG_LEVEL_DEF, DDLogFlagInfo, ARLogContextInfo, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)
#define ARActionLog(frmt, ...) LOG_MAYBE(LOG_ASYNC_ENABLED, LOG_LEVEL_DEF, DDLogFlagDebug, ARLogContextAction, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)

#define ARErrorLog(frmt, ...) LOG_MAYBE(LOG_ASYNC_ENABLED, LOG_LEVEL_DEF, DDLogFlagError, ARLogContextError, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)
