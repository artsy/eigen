#import <Foundation/Foundation.h>


@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithFair:(Fair *)fair andProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithShow:(PartnerShow *)show andFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;

@property (assign, getter=isEligibleForPublicIndexing) BOOL eligibleForPublicIndexing;
@property (nonatomic, assign, getter=isEligibleForSearch) BOOL eligibleForSearch;
@property (nonatomic, assign, getter=isEligibleForHandoff) BOOL eligibleForHandoff;

@end
