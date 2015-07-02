#import "ARFeedItem.h"
#import "ARStandardDateFormatter.h"

static ARStandardDateFormatter *staticDateFormatter;


@implementation ARFeedItem

+ (NSValueTransformer *)standardDateTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)feedTimestampJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"feedItemID" : @"id"
    };
}

+ (NSString *)cellIdentifier
{
    return @"GenericCellIdentifier";
}

- (NSString *)cellIdentifier
{
    return [[self class] cellIdentifier];
}

- (NSArray *)dataForActivities
{
    return nil;
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        ARFeedItem *item = object;
        return [_feedItemID isEqualToString:item.feedItemID];
    }
    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return _feedItemID.hash;
}

- (NSString *)localizedStringForActivity
{
    return @"";
}

@end
