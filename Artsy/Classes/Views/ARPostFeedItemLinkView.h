@class ARPostFeedItem;

@interface ARPostFeedItemLinkView : UIButton

- (void)updateWithPostFeedItem:(ARPostFeedItem *)postFeedItem;
- (void)updateWithPostFeedItem:(ARPostFeedItem *)postFeedItem withSeparator:(BOOL)withSeparator;

@property(nonatomic, strong, readonly) NSString *targetPath;

@end
