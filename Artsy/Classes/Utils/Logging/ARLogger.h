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

// ARLogContextRequestOperation context is specifically for logging http responses directly from the
// server. To log specifically formatted text errors after a failed request, use ARLogContextNetwork
// logs. These macros are used by ARHTTPRequestOperationLogger. This logger has its own log level so
// that you may log only failed requests without affecting the global log level of ARLogger.

#define ARHTTPRequestOperationDebugLog(frmt, ...)  LOG_OBJC_MAYBE(YES, ddLogLevel, LOG_FLAG_DEBUG, ARLogContextRequestOperation, frmt, ##__VA_ARGS__)
#define ARHTTPRequestOperationSuccessLog(frmt, ...)  LOG_OBJC_MAYBE(YES, ddLogLevel, LOG_FLAG_INFO, ARLogContextRequestOperation, frmt, ##__VA_ARGS__)
#define ARHTTPRequestOperationFailureLog(frmt, ...)  LOG_OBJC_MAYBE(YES, ddLogLevel, LOG_FLAG_ERROR, ARLogContextRequestOperation, frmt, ##__VA_ARGS__)

#define ARLogInfo(frmt, ...)   LOG_MAYBE(NO  LOG_LEVEL_DEF, ARLogContextInfo,   0, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)
#define ARActionLog(frmt, ...)    LOG_MAYBE(LOG_ASYNC_ENABLED, LOG_LEVEL_DEF, ARLogContextAction, 0, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)
#define ARErrorLog(frmt, ...)    LOG_MAYBE(LOG_ASYNC_ENABLED, LOG_LEVEL_DEF, ARLogContextError, 0, nil, __PRETTY_FUNCTION__, frmt, ##__VA_ARGS__)

