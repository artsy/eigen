#import "Mantle.h"

@interface SearchResult : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, copy) Class model;

@property (readonly, nonatomic, copy) NSString *modelID;
@property (readonly, nonatomic, copy) NSString *displayText;
@property (readonly, nonatomic, copy) NSString *label;
@property (readonly, nonatomic, copy) NSString *searchDetail;
@property (readonly, nonatomic, strong) NSNumber *isPublished;

+ (BOOL)searchResultIsSupported:(NSDictionary *)dict;
- (NSURLRequest *)imageRequest;
@end
