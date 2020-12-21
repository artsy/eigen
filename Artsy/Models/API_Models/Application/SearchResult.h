#import <Mantle/Mantle.h>
#import "SearchResultable.h"

@interface SearchResult : MTLModel <MTLJSONSerializing, SearchResultable>

@property (readonly, nonatomic, copy) NSString *modelString;
@property (readonly, nonatomic, copy) NSString *modelID;
@property (readonly, nonatomic, copy) NSString *displayText;
@property (readonly, nonatomic, copy) NSString *label;
@property (readonly, nonatomic, copy) NSString *searchDetail;
@property (readonly, nonatomic, strong) NSNumber *isPublished;
@property (readonly, nonatomic, copy) NSString *imageURL;

+ (BOOL)searchResultIsSupported:(NSDictionary *)dict;
- (NSURLRequest *)imageRequest;

@end
