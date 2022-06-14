#import <Mantle/Mantle.h>

#import "ARStandardDateFormatter.h"


@interface ARStandardDateFormatter ()
@property (nonatomic, strong) NSValueTransformer *stringTransformer;
@end


@implementation ARStandardDateFormatter

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
