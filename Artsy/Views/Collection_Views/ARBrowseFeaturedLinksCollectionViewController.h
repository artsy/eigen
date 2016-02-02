#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ARFeaturedLinkStyle) {
    ARFeaturedLinkLayoutSingleRow,
    ARFeaturedLinkLayoutDoubleRow,
};

@class ARBrowseFeaturedLinksCollectionViewController, FeaturedLink;

@protocol ARBrowseFeaturedLinksCollectionViewControllerDelegate
@required
- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink;
@end


@interface ARBrowseFeaturedLinksCollectionViewController : UICollectionViewController <UICollectionViewDataSource, UICollectionViewDelegate>

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style;
@property (nonatomic, copy, readwrite) NSArray *featuredLinks;
@property (nonatomic, assign, readonly) ARFeaturedLinkStyle style;
@property (nonatomic, strong, readwrite) id<ARBrowseFeaturedLinksCollectionViewControllerDelegate> selectionDelegate;
@end
