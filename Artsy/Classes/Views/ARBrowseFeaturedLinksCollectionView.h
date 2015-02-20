typedef NS_ENUM(NSInteger, ARFeaturedLinkStyle){
    ARFeaturedLinkLayoutSingleRow,
    ARFeaturedLinkLayoutDoubleRow,
};

@class ARBrowseFeaturedLinksCollectionView;

@protocol ARBrowseFeaturedLinksCollectionViewDelegate
@required
- (void)didSelectFeaturedLink:(FeaturedLink *)featuredLink;
@end

@interface ARBrowseFeaturedLinksCollectionView : UICollectionView <UICollectionViewDataSource, UICollectionViewDelegate>

- (instancetype)initWithStyle:(enum ARFeaturedLinkStyle)style;

@property (nonatomic, copy,  readwrite) NSArray *featuredLinks;
@property (nonatomic, assign, readonly) ARFeaturedLinkStyle style;
@property (nonatomic, strong, readwrite) id<ARBrowseFeaturedLinksCollectionViewDelegate> selectionDelegate;
@end
