@protocol ARFairAwareObject;

@interface ARFairArtistViewController : UIViewController <ARFairAwareObject>

- (id)initWithArtistID:(NSString *)artistID fair:(Fair *)fair;

@property (readonly, nonatomic, strong) Artist *artist;
@property (readonly, nonatomic, strong) Fair *fair;

- (BOOL)isFollowingArtist;

@end
