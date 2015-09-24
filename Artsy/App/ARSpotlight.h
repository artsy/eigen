#import <Foundation/Foundation.h>
#import "ARShareableObject.h"

@class CSSearchableItemAttributeSet;
@class CSSearchableIndex;

typedef void (^ARSearchAttributesCompletionBlock)(CSSearchableItemAttributeSet *attributeSet);

@protocol ARSpotlightMetadataProvider <ARShareableObject>
- (NSURL *)spotlightThumbnailURL;
- (NSString *)spotlightDescription;
@optional
- (NSString *)spotlightMarkdownDescription;
- (NSDate *)startDate;
- (NSDate *)endDate;
@end

@interface ARSpotlight : NSObject

+ (NSURL *)webpageURLForEntity:(id<ARSpotlightMetadataProvider>)entity;

+ (BOOL)isSpotlightAvailable;

/// This normally refers to the default index, but can be set to `nil` during testing, so no entities are indexed as
/// side-effects of testing favoriting, by calling `disableIndexing`.
+ (CSSearchableIndex *)searchableIndex;
+ (void)disableIndexing;

/// All of these methods should only be used if Spotlight indexing is available.

+ (void)indexAllUsersFavorites;

/// Only the entities that don’t require a second model to build the search attributes are currently supported.
/// This excludes Fair and Show models.
+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id<ARSpotlightMetadataProvider>)entity;

+ (CSSearchableItemAttributeSet *)searchAttributesForEntity:(id<ARSpotlightMetadataProvider>)entity
                                          includeIdentifier:(BOOL)includeIdentifier
                                                 completion:(ARSearchAttributesCompletionBlock)completion;

@end


@class Fair;
@class Profile;

@interface ARFairSpotlightMetadataProvider : NSProxy <ARSpotlightMetadataProvider>
@property (readonly, nonatomic, strong) Fair *fair;
@property (readonly, nonatomic, strong) Profile *profile;
- (instancetype)initWithFair:(Fair *)fair withProfile:(Profile *)profile;
@end
