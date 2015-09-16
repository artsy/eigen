#import <Foundation/Foundation.h>

@class ARUserActivity;

typedef void (^ARUserActivityCompletionBlock)(ARUserActivity *activity);


@interface ARUserActivity : NSUserActivity

/// Creates a new ARUserActivity object. This object must be strongly held
/// by the controller that creates it in order to be properly indexed
+ (void)activityWithArtwork:(Artwork *)artwork completion:(ARUserActivityCompletionBlock)completion;
+ (void)activityWithArtist:(Artist *)artist completion:(ARUserActivityCompletionBlock)completion;
+ (void)activityWithGene:(Gene *)gene completion:(ARUserActivityCompletionBlock)completion;
+ (void)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile completion:(ARUserActivityCompletionBlock)completion;
+ (void)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair completion:(ARUserActivityCompletionBlock)completion;

@end
