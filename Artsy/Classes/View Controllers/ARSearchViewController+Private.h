@interface ARSearchViewController (Private)

- (void)closeSearch:(id)sender;
- (void)searchText:(NSString *)text;

@property(readonly, nonatomic) UIView *contentView;
@end
