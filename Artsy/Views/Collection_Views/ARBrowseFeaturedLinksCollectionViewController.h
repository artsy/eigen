typedef NS_ENUM(NSInteger, ARFeaturedLinkStyle) {
    ARFeaturedLinkLayoutSingleRow,
    ARFeaturedLinkLayoutDoubleRow,
};

@class ARBrowseFeaturedLinksCollectionViewController;

@protocol ARBrowseFeaturedLinksCollectionViewControllerDelegate
@required
- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink;
@end


@interface ARBrowseFeaturedLinksCollectionViewController : UIViewController <UICollectionViewDataSource, UICollectionViewDelegate>

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style;
@property (nonatomic, copy, readwrite) NSArray *featuredLinks;
@property (nonatomic, assign, readonly) ARFeaturedLinkStyle style;
@property (nonatomic, strong, readwrite) id<ARBrowseFeaturedLinksCollectionViewControllerDelegate> selectionDelegate;
@end
