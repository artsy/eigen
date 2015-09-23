#import <Foundation/Foundation.h>

@class CSSearchableItemAttributeSet;
@class CSSearchableIndex;

typedef void (^ARSearchAttributesCompletionBlock)(CSSearchableItemAttributeSet *attributeSet);

@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;

/// All of these methods should only be used if Spotlight indexing is available.

/// This normally refers to the default index, but can be set to `nil` during testing, so no entities are indexed as
/// side-effects of testing favoriting, by calling `disableIndexing`.
+ (CSSearchableIndex *)searchableIndex;
+ (void)disableIndexing;

/// Only the entities that don’t require a second model to build the search attributes are currently supported.
/// This excludes Fair and Show models.
+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;

+ (void)indexAllUsersFavorites;

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
