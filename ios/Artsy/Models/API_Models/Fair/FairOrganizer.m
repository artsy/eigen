#import "FairOrganizer.h"


@implementation FairOrganizer

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"fairOrganizerID" : @"id",
        @"profileID" : @"profile_id",
        @"defaultFairID" : @"default_fair_id",
    };
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        FairOrganizer *fairOrganizer = object;
        return [fairOrganizer.fairOrganizerID isEqualToString:self.fairOrganizerID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.fairOrganizerID.hash;
}

@end
