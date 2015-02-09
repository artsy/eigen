@class ARHeroUnitsNetworkModel;

@interface ARHeroUnitViewController : UIViewController

@property (nonatomic, strong) ARHeroUnitsNetworkModel *heroUnitNetworkModel;

- (void)fetchHeroUnits;

@end
