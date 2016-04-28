#import "AROnboardingGeneTableController.h"

#import "AROnboardingFollowableTableViewCell.h"
#import "ARFonts.h"
#import "Gene.h"
#import "ARLogger.h"


static NSString *CellId = @"OnboardingGeneFollow";


@interface AROnboardingGeneTableController ()
@property (nonatomic) UITableView *tableView;
@property (nonatomic) NSArray *genes;
@end


@implementation AROnboardingGeneTableController

- (instancetype)initWithGenes:(NSArray *)genes
{
    self = [super init];
    if (self) {
        _genes = genes;
    }
    return self;
}

- (void)prepareTableView:(UITableView *)tableView
{
    [tableView registerClass:[AROnboardingFollowableTableViewCell class] forCellReuseIdentifier:CellId];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.genes.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 50;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellId];
    Gene *gene = self.genes[indexPath.row];
    cell.textLabel.text = gene.name;
    //    cell.followState = gene.isFollowed;
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 54;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(20, 0, tableView.bounds.size.width - 20, 50)];
    label.font = [UIFont sansSerifFontWithSize:14];
    label.text = [@"Or Categories" uppercaseString];
    label.textColor = [UIColor whiteColor];
    label.backgroundColor = [UIColor clearColor];

    UIView *wrapper = [[UIView alloc] init];
    [wrapper addSubview:label];
    return wrapper;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //    AROnboardingFollowableTableViewCell *cell = ((AROnboardingFollowableTableViewCell *)[tableView cellForRowAtIndexPath:indexPath]);
    //    [cell toggleFollowState];

    Gene *gene = [self.genes objectAtIndex:indexPath.row];
    BOOL newState = !gene.isFollowed;

    self.numberOfFollowedGenes += newState ? 1 : -1;

    NSString *geneID = gene.geneID;
    [gene setFollowState:newState success:^(id response) {
        ARActionLog(@"%@ gene %@", newState ? @"Followed" : @"Unfollowed" , geneID);

    } failure:^(NSError *error) {
//        [cell toggleFollowState];
        ARErrorLog(@"Error %@ gene %@. Error: %@", newState ? @"following" : @"unfollowing", geneID, error.localizedDescription);
    }];
}
@end
