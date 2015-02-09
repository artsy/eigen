@class ARPostFeedItem;

@interface ARPostFeedItemLinkView : UIButton

// Creates a view that represents a PostFeedItem
- (id)initWithPostFeedItem:(ARPostFeedItem *)postFeedItem;

@property(nonatomic, strong, readonly) NSString *targetPath;

@end
