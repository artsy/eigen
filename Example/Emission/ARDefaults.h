#import <Foundation/Foundation.h>

extern NSString *const ARForceUseRNPDefault;
extern NSString *const ARJumpStraightIntoStorybooks;

extern NSString *const ARUseStagingDefault;
extern NSString *const ARUsePREmissionDefault;
extern NSString *const ARPREmissionIDDefault;

extern NSString *const ARStagingAPIURLDefault;
extern NSString *const ARStagingWebURLDefault;
extern NSString *const ARStagingMetaphysicsURLDefault;
extern NSString *const ARStagingPredictionURLDefault;
extern NSString *const ARStagingVolleyURLDefault;
extern NSString *const ARRNPackagerHostDefault;

@interface ARDefaults : NSObject
+ (void)setup;
+ (void)resetDefaults;
@end
