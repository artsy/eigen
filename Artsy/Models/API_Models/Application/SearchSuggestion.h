#import <Mantle/Mantle.h>
#import "SearchResultable.h"

@interface SearchSuggestion : MTLModel <MTLJSONSerializing, SearchResultable>

@property (readonly, nonatomic, copy) NSString *displayText;
@property (readonly, nonatomic, strong) NSNumber *isPublished;

@property (readonly, nonatomic, copy) NSString *imageURL;
@property (readonly, nonatomic, copy) NSString *href;

@property (readonly, nonatomic, copy) NSString *modelID;
@property (readonly, nonatomic, copy) NSString *model;

+ (BOOL)searchResultIsSupported:(NSDictionary *)jsonDict;

@end
