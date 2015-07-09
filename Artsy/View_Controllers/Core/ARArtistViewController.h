#import "ARFairAwareObject.h"


@interface ARArtistViewController : UIViewController <ARFairAwareObject>

- (instancetype)initWithArtistID:(NSString *)artistID;

@property (readonly, nonatomic, strong) Artist *artist;
@property (nonatomic, strong) Fair *fair;

@end
