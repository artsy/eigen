#import "SystemTime.h"

#import "ARMacros.h"

#import <ISO8601DateFormatter/ISO8601DateFormatter.h>

@interface SystemTime ()
@property (nonatomic, readonly, strong) NSString *time;
@property (nonatomic, readonly, assign) NSInteger day;
@property (nonatomic, readonly, assign) NSInteger wday;
@property (nonatomic, readonly, assign) NSInteger month;
@property (nonatomic, readonly, assign) NSInteger hour;
@property (nonatomic, readonly, assign) NSInteger year;
@property (nonatomic, readonly, assign) NSInteger min;
@property (nonatomic, readonly, assign) NSInteger sec;
@property (nonatomic, readonly, assign) BOOL dst;
@property (nonatomic, readonly, assign) NSInteger unix;
@property (nonatomic, readonly, assign) float utcOffset;
@property (nonatomic, readonly, strong) NSString *zome;
@property (nonatomic, readonly, strong) NSString *iso8601;
@end


@implementation SystemTime

#pragma mark - MTLJSONSerializing

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(SystemTime.new, utcOffset) : @"utc_offset",
    };
}

- (NSDate *)date
{
    ISO8601DateFormatter *dateFormatter = [[ISO8601DateFormatter alloc] init];
    return [dateFormatter dateFromString:self.iso8601];
}

- (NSTimeInterval)timeIntervalSinceDate:(NSDate *)date
{
    return [self.date timeIntervalSinceDate:date];
}

@end
