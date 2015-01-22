#import "SearchResult.h"
#import "ARRouter.h"

static NSDictionary *classMap;

@implementation SearchResult

+ (BOOL)searchResultIsSupported:(NSDictionary *)dict
{
    return [[classMap allKeys] containsObject:dict[@"model"]];
}

+ (void)initialize
{
    classMap = @{
        @"artwork": [Artwork class],
        @"gene": [Gene class],
        @"artist": [Artist class],
        @"profile" : [Profile class],
        @"feature" : [SiteFeature class],

        // This is _NOT_ from the API, but comes from ARFairSearchVC
        @"partnershow" : [PartnerShow class]

    };
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"modelID" : @"id",
        @"displayText" : @"display",
        @"model" : @"model",
        @"label" : @"label",
        @"searchDetail" : @"search_detail",
        @"isPublished" : @"published",
    };
}

+ (NSValueTransformer *)modelJSONTransformer
{
    return [MTLValueTransformer transformerWithBlock:^(NSString *str) {
        return classMap[str];
    }];
}

- (NSURLRequest *)imageRequest
{
    return [ARRouter directImageRequestForModel:self.model andSlug:self.modelID];
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:self.class]){
        return [self.model isEqual:[object model]] && [self.modelID isEqualToString:[object modelID]];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return NSStringWithFormat(@"%@:%@", self.model, self.modelID).hash;
}


@end
