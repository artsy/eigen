

@interface ARArtistBiographyViewController : UIViewController

- (instancetype)initWithArtist:(Artist *)artist;

@property (nonatomic, strong, readonly) Artist *artist;

@end
