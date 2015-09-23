#import <Foundation/Foundation.h>

extern NSString *const ARUserActivityTypeArtwork;
extern NSString *const ARUserActivityTypeArtist;
extern NSString *const ARUserActivityTypeGene;
extern NSString *const ARUserActivityTypeFair;
extern NSString *const ARUserActivityTypeShow;

@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent;
+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent;

@end

