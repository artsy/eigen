#import "SiteHeroUnit.h"


@interface ARSiteHeroUnitView : UIView

- (id)initWithFrame:(CGRect)frame unit:(SiteHeroUnit *)unit;

@property (nonatomic, readonly, assign) enum ARHeroUnitImageColor style;
@property (nonatomic, copy, readonly) NSString *linkAddress;

@end
