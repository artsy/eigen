#import "ARPartnerShowFeedItem.h"


@interface ARPartnerShowFeedItem () <ARFeedHostItem>
@property (nonatomic, strong) PartnerShow *show;
@end


@implementation ARPartnerShowFeedItem

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return [super.JSONKeyPathsByPropertyKey mtl_dictionaryByAddingEntriesFromDictionary:@{
        @"showID" : @"id",
        @"feedTimestamp" : @"created_at",
    }];
}

+ (NSString *)cellIdentifier
{
    return @"PartnerShowCellIdentifier";
}

- (NSString *)localizedStringForActivity
{
    return NSLocalizedString(@"New Show", @"New Show Items text for Feed Item");
}

- (SEL)setHostPropertySelector
{
    return @selector(setShow:);
}

- (Class)hostedObjectClass;
{
    return [PartnerShow class];
}

@end
