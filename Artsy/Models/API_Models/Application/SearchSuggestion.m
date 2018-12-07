#import "SearchSuggestion.h"
#import "ARMacros.h"
#import <ObjectiveSugar/NSString+ObjectiveSugar.h>

@implementation SearchSuggestion

+ (NSDictionary *)JSONKeyPathsByPropertyKey {
    return @{
         ar_keypath(SearchSuggestion.new, displayText) : @"display",
         ar_keypath(SearchSuggestion.new, isPublished) : @"published",
         ar_keypath(SearchSuggestion.new, imageURL) : @"image_url",
         ar_keypath(SearchSuggestion.new, model) : @"model",
         ar_keypath(SearchSuggestion.new, modelID) : @"id",
    };
}

// Based on https://github.com/artsy/gravity/blob/a13284a1daa955011afb3505c9864c678ad434a8/app/models/search/queries/global_auto_suggest_query.rb#L52-L67

+ (BOOL)searchResultIsSupported:(NSDictionary *)jsonDict
{
    NSArray *allSupported = @[@"artist",  @"profile",  @"gene",  @"city",  @"artwork",  @"fair",  @"tag",  @"feature",  @"article",  @"page",  @"sale"];
    return [allSupported containsObject:jsonDict[@"model"]];
}

- (NSString *)href
{
    NSArray *prefixless = @[@"profile", @"page", @"fair"];
    if ([prefixless containsObject:self.model]) {
        return self.modelID;
    } else if ([self.model isEqualToString:@"tag"] || [self.model isEqualToString:@"gene"]) {
        return NSStringWithFormat(@"/gene/%@", self.modelID);
    } else if ([self.model isEqualToString:@"artist"]) {
        return NSStringWithFormat(@"/artist/%@", self.modelID);
    } else if ([self.model isEqualToString:@"city"]) {
        return NSStringWithFormat(@"/shows/%@", self.modelID);
    } else if ([self.model isEqualToString:@"artwork"]) {
        return NSStringWithFormat(@"/artwork/%@", self.modelID);
    } else if ([self.model isEqualToString:@"article"]) {
        return NSStringWithFormat(@"/article/%@", self.modelID);
    } else if ([self.model isEqualToString:@"page"]) {
        return NSStringWithFormat(@"/artwork/%@", self.modelID);
    } else if ([self.model isEqualToString:@"sale"]) {
        return NSStringWithFormat(@"/auction/%@", self.modelID);
    } else if ([self.model isEqualToString:@"feature"]) {
        return NSStringWithFormat(@"/auction/%@", self.modelID);
    }

    @throw [[NSException alloc]  initWithName:@"Should not get here" reason:@"" userInfo:nil];

}

@end
