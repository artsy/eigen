#import <Foundation/Foundation.h>

@class CSSearchableItemAttributeSet;

typedef void (^ARSearchAttributesCompletionBlock)(CSSearchableItemAttributeSet *attributeSet);

@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;

/// Creates new CSSearchableItemAttributeSet objects, including thumbnails.
///
/// This work is performed on a background queue, the caller is responsible for dispatching onto the main queue (or any
/// other required queue) from the completion block.
+ (void)searchAttributesWithArtwork:(Artwork *)artwork completion:(ARSearchAttributesCompletionBlock)completion;
+ (void)searchAttributesWithArtist:(Artist *)artist completion:(ARSearchAttributesCompletionBlock)completion;
+ (void)searchAttributesWithGene:(Gene *)gene completion:(ARSearchAttributesCompletionBlock)completion;
+ (void)searchAttributesWithFair:(Fair *)fair withProfile:(Profile *)fairProfile completion:(ARSearchAttributesCompletionBlock)completion;
+ (void)searchAttributesWithShow:(PartnerShow *)show inFair:(Fair *)fair completion:(ARSearchAttributesCompletionBlock)completion;

/// Only the entities that don’t require a second model to build the search attributes are currently supported.
/// This excludes Fair and Show models.
+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;
+ (void)addEntityToSpotlightIndex:(id)entity;

+ (void)indexAllUsersFavorites;

@end
