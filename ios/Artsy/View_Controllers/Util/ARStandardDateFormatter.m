#import <Mantle/Mantle.h>

#import "ARStandardDateFormatter.h"


@interface ARStandardDateFormatter ()
@property (nonatomic, strong) NSValueTransformer *stringTransformer;
@property (nonatomic, strong) NSISO8601DateFormatter *fractionalSecondsFormatter;
@end


@implementation ARStandardDateFormatter

- (instancetype)init
{
    self = [super init];
    if (self) {
        _fractionalSecondsFormatter = [[NSISO8601DateFormatter alloc] init];
        _fractionalSecondsFormatter.formatOptions = NSISO8601DateFormatWithInternetDateTime | NSISO8601DateFormatWithFractionalSeconds;
    }
    return self;
}

- (nullable NSDate *)dateFromString:(NSString *)string
{
    NSDate *date = [super dateFromString:string];
    if (!date) {
        date = [self.fractionalSecondsFormatter dateFromString:string];
    }
    return date;
}

+ (ARStandardDateFormatter *)sharedFormatter
{
    static ARStandardDateFormatter *_sharedFormatter = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedFormatter = [[self alloc] init];

        _sharedFormatter.stringTransformer = [MTLValueTransformer reversibleTransformerWithForwardBlock:^(NSString *str) {
            return [_sharedFormatter dateFromString:str];

        } reverseBlock:^(NSDate *date) {
            return [_sharedFormatter stringFromDate:date];
        }];

    });
    return _sharedFormatter;
}

@end
