@class ARHeroUnitsNetworkModel;


@interface ARHeroUnitViewController : UIViewController

@property (nonatomic, strong) ARHeroUnitsNetworkModel *heroUnitNetworkModel;

@end

// Class internal to ARHeroUnitViewController - exposed only for analytics
@interface ARSiteHeroUnitViewController : UIViewController

@property (nonatomic, strong, readonly) SiteHeroUnit *heroUnit;

@end
