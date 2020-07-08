#import "ARComponentViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARViewingRoomArtworkComponentViewController : ARComponentViewController

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
                            artworkID:(NSString *)artworkID;

- (instancetype)initWithViewingRoomID:(NSString *)viewingRoomID
                            artworkID:(NSString *)artworkID
                             emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
