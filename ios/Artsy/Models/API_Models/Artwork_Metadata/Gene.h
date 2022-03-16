#import "ARFollowable.h"
#import "ARShareableObject.h"
#import "ARHasImageBaseURL.h"
#import "ARUserActivity.h"

#import <Mantle/Mantle.h>

@class AFHTTPRequestOperation;


@interface Gene : MTLModel <MTLJSONSerializing, ARFollowable, ARShareableObject, ARHasImageBaseURL, ARContinuityMetadataProvider>

@property (readonly, nonatomic, copy) NSString *name;
@property (readonly, nonatomic, copy) NSString *geneID;
@property (readonly, nonatomic, copy) NSString *uuid;

@property (readonly, nonatomic, copy) NSString *geneDescription;

@property (readonly, nonatomic, copy) NSNumber *artistCount;
@property (readonly, nonatomic, copy) NSNumber *artworkCount;
@property (readonly, nonatomic, copy) NSNumber *followCount;
@property (readonly, nonatomic, copy) NSNumber *published;
@property (readonly, nonatomic, copy) NSArray *urlFormats;

@property (readonly, nonatomic, copy) NSArray *artworks;

- (instancetype)initWithGeneID:(NSString *)geneID;

- (NSURL *)smallImageURL;
- (NSURL *)largeImageURL;
@end
