#import "ARFollowable.h"
#import "ARShareableObject.h"
#import "ARHasImageBaseURL.h"
#import "ARUserActivity.h"

#import <Mantle/Mantle.h>

@class AFHTTPRequestOperation;


@interface Artist : MTLModel <MTLJSONSerializing, ARFollowable, ARShareableObject, ARHasImageURLs, ARContinuityMetadataProvider>

@property (readonly, nonatomic, copy) NSString *artistID;
@property (readonly, nonatomic, copy) NSString *uuid;
@property (readonly, nonatomic, copy) NSString *sortableID;
@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *years;
@property (readonly, nonatomic, copy) NSString *birthday;
@property (readonly, nonatomic, copy) NSString *nationality;
@property (readonly, nonatomic, copy) NSString *blurb;

- (instancetype)initWithArtistID:(NSString *)artistID;

- (NSURL *)squareImageURL;
@end
