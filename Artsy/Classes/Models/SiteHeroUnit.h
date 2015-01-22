#import "Mantle.h"

typedef NS_ENUM(NSInteger, ARHeroUnitImageColor){
    ARHeroUnitImageColorBlack,
    ARHeroUnitImageColorWhite
};

typedef NS_ENUM(NSInteger, ARHeroUnitAlignment){
    ARHeroUnitAlignmentLeft,
    ARHeroUnitAlignmentRight
};

@interface SiteHeroUnit : MTLModel <MTLJSONSerializing>

@property (nonatomic, copy, readonly) NSString *siteHeroUnitID;
@property (nonatomic, copy, readonly) NSString *name;
@property (nonatomic, copy, readonly) NSString *link;
@property (nonatomic, copy, readonly) NSString *linkText;
@property (nonatomic, copy, readonly) NSString *creditLine;

@property (nonatomic, copy, readonly) NSString *heading;
@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *titleImageAddress;
@property (nonatomic, copy, readonly) NSString *body;

@property (nonatomic, copy, readonly) NSString *backgroundColor;
@property (nonatomic, copy, readonly) NSString *mobileBackgroundColor;

@property (nonatomic, copy, readonly) NSString *mobileBackgroundImageAddress;
@property (nonatomic, copy, readonly) NSString *backgroundImageAddress;
@property (nonatomic, assign, readonly, getter = isCurrentlyActive) BOOL currentlyActive;

@property (nonatomic, assign, readonly) ARHeroUnitImageColor backgroundStyle;
@property (nonatomic, assign, readonly) ARHeroUnitAlignment alignment;
@property (nonatomic, assign, readonly) NSURL *preferredImageURL;
@property (nonatomic, assign, readonly) NSURL *titleImageURL;

@property (nonatomic, strong, readonly) NSDate *startDate;
@property (nonatomic, strong, readonly) NSDate *endDate;
@property (nonatomic, assign, readonly) NSInteger position;
- (UIColor *)buttonColor;
- (UIColor *)inverseButtonColor;
@end
