#import "ARLogFormatter.h"

// Human-readable context names for file loggers
static const NSDictionary *contextMap;


@implementation ARLogFormatter

+ (void)initialize
{
    contextMap = @{
        @(ARLogContextRequestOperation) : @"Network",
        @(ARLogContextAction) : @"Action",
        @(ARLogContextError) : @"Error",
        @(ARLogContextInfo) : @"Info"
    };
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _dateFormatter = [[NSDateFormatter alloc] init];
        [_dateFormatter setFormatterBehavior:NSDateFormatterBehavior10_4];
        [_dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss.SSS"];
        _loggerCount = 0;
    }
    return self;
}

- (NSString *)formatLogMessage:(DDLogMessage *)logMessage
{
    NSString *dateAndTime = [self.dateFormatter stringFromDate:(logMessage->_timestamp)];
    NSString *logMsg = logMessage->_message;

    return [NSString stringWithFormat:@"%@ [%@] | %@\n", dateAndTime, [contextMap[@(logMessage->_context)] uppercaseString], logMsg];

    return nil;
}

- (void)didAddToLogger:(id<DDLogger>)logger
{
    self.loggerCount++;
    NSAssert(self.loggerCount <= 1, @"This logger isn't thread-safe");
}

- (void)willRemoveFromLogger:(id<DDLogger>)logger
{
    self.loggerCount--;
}

@end
