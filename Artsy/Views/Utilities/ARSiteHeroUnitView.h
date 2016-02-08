#import "SiteHeroUnit.h"


@interface ARSiteHeroUnitView : UIView

- (instancetype)initWithFrame:(CGRect)frame unit:(SiteHeroUnit *)unit;

@property (nonatomic, readonly, assign) enum ARHeroUnitImageColor style;

@end
