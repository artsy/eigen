
@class Fair, PartnerShow;

@interface ARShowViewController : UIViewController

- (id)initWithShow:(PartnerShow *)show fair:(Fair *)fair;
- (id)initWithShowID:(NSString *)showID fair:(Fair *)fair;

@property (nonatomic, strong, readonly) PartnerShow *show;
@property (nonatomic, strong, readonly) Fair *fair;

- (NSDictionary *)dictionaryForAnalytics;
- (BOOL)isFollowing;

@end
