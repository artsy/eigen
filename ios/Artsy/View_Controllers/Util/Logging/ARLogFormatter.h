


@interface ARLogFormatter : NSObject <DDLogFormatter>
@property (nonatomic, assign) NSInteger loggerCount;
@property (nonatomic, strong) NSDateFormatter *dateFormatter;
@end
