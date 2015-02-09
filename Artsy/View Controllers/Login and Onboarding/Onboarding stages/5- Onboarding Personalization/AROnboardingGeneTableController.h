/// This exists purely because we don't want to have to disambiguate between this tableView
/// and the Artist and Search ones in personalize

@interface AROnboardingGeneTableController : NSObject <UITableViewDataSource, UITableViewDelegate>

- (instancetype)initWithGenes:(NSArray *)genes;
- (void)prepareTableView:(UITableView *)tableView;

@property (nonatomic, assign) CGFloat numberOfFollowedGenes;
@property (nonatomic, readonly) NSArray *genes;

@end
