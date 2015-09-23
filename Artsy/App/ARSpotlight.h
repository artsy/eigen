#import <Foundation/Foundation.h>

@class CSSearchableItemAttributeSet;
@class CSSearchableIndex;

typedef void (^ARSearchAttributesCompletionBlock)(CSSearchableItemAttributeSet *attributeSet);

@interface ARSpotlight : NSObject

+ (NSURL *)webpageURLForEntity:(id)entity;

+ (BOOL)isSpotlightAvailable;

/// This normally refers to the default index, but can be set to `nil` during testing, so no entities are indexed as
/// side-effects of testing favoriting, by calling `disableIndexing`.
+ (CSSearchableIndex *)searchableIndex;
+ (void)disableIndexing;

/// All of these methods should only be used if Spotlight indexing is available.

+ (void)indexAllUsersFavorites;

/// Only the entities that don’t require a second model to build the search attributes are currently supported.
/// This excludes Fair and Show models.
+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;

+ (CSSearchableItemAttributeSet *)searchAttributesWithArtwork:(Artwork *)artwork
                                            includeIdentifier:(BOOL)includeIdentifier
                                                   completion:(ARSearchAttributesCompletionBlock)completion;
+ (CSSearchableItemAttributeSet *)searchAttributesWithArtist:(Artist *)artist
                                           includeIdentifier:(BOOL)includeIdentifier
                                                  completion:(ARSearchAttributesCompletionBlock)completion;
+ (CSSearchableItemAttributeSet *)searchAttributesWithGene:(Gene *)gene
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
+ (CSSearchableItemAttributeSet *)searchAttributesWithFair:(Fair *)fair
                                               withProfile:(Profile *)fairProfile
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
+ (CSSearchableItemAttributeSet *)searchAttributesWithShow:(PartnerShow *)show
                                                    inFair:(Fair *)fair
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;

@end

