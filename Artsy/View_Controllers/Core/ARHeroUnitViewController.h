#import <UIKit/UIKit.h>

@class ARHeroUnitsNetworkModel, SiteHeroUnit;


@interface ARHeroUnitViewController : UIViewController

@property (nonatomic, strong) ARHeroUnitsNetworkModel *heroUnitNetworkModel;

@end

// Class internal to ARHeroUnitViewController - exposed only for analytics


@interface ARSiteHeroUnitViewController : UIViewController

/// Init function
- (instancetype)initWithHeroUnit:(SiteHeroUnit *)heroUnit andIndex:(NSInteger)index;

/// Hero Unit the VC represents
@property (nonatomic, strong, readonly) SiteHeroUnit *heroUnit;

/// Triggers a push to the url represented by the hero unit
- (void)tappedUnit:(id)sender;

@end
