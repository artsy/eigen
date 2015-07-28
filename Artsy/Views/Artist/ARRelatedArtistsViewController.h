


@interface ARRelatedArtistsViewController : UIViewController

- (instancetype)initWithFair:(Fair *)fair;

@property (nonatomic, strong, readonly) Fair *fair;

@property (nonatomic, strong) NSArray *relatedArtists;

@end
