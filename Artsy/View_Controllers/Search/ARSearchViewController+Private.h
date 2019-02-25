@interface ARSearchViewController (Private)

- (void)closeSearch:(id)sender;
- (void)setSearchQuery:(NSString *)text;

@property (readonly, nonatomic) UIView *contentView;

@end
