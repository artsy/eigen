#import <Mantle/Mantle.h>
#import "SearchResultable.h"

/// Objects returned via the search
@interface SearchSuggestion : MTLModel <MTLJSONSerializing, SearchResultable>

/// User-facing string
@property (readonly, nonatomic, copy) NSString *displayText;
/// Should we show it? E.g. is it only for admins
@property (readonly, nonatomic, strong) NSNumber *isPublished;

/// The avatar to show
@property (readonly, nonatomic, copy) NSString *imageURL;
/// This is mainly to conform to SearchResultable and isn't used here
@property (readonly, nonatomic, copy) NSString *href;

/// The ID property, for routing
@property (readonly, nonatomic, copy) NSString *modelID;
/// The model object in lowercase
@property (readonly, nonatomic, copy) NSString *model;

/// A fair for example has a profile id which is what we
/// should be using instead of the fair's id
@property (readonly, nonatomic, copy) NSString *profileID;

/// Can we show this in Eigen yet?
+ (BOOL)searchResultIsSupported:(NSDictionary *)jsonDict;

@end
