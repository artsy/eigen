#import "Sale+Extensions.h"

@implementation Sale (Extensions)
+ (Sale *)saleWithStart:(NSDate *)start end:(NSDate *)end
{
    return [Sale modelFromDictionary:@{ @"startDate" : start, @"endDate" : end }];
}
@end
