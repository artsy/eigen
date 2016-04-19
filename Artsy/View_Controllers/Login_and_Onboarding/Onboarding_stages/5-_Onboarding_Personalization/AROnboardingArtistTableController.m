#import "AROnboardingArtistTableController.h"

#import "Artist.h"
#import "AROnboardingFollowableTableViewCell.h"
#import "ARLogger.h"

static NSString *CellId = @"OnboardingArtistFollow";


@interface AROnboardingArtistTableController ()
@property (nonatomic) NSMutableOrderedSet *artists;
@property (nonatomic, assign) BOOL isFollowed;
@end


@implementation AROnboardingArtistTableController

- (instancetype)init
{
    self = [super init];
    if (self) {
        _artists = [[NSMutableOrderedSet alloc] init];
    }
    return self;
}

- (BOOL)hasArtist:(Artist *)artist
{
    return [self.artists containsObject:artist];
}

- (void)addArtist:(Artist *)artist
{
    [self.artists addObject:artist];
}

- (void)removeArtist:(Artist *)artist
{
    [self.artists removeObject:artist];
    if (self.postRemoveBlock) {
        self.postRemoveBlock();
    }
}

- (void)unfollowArtist:(Artist *)artist
{
    [self removeArtist:artist];

    [artist unfollowWithSuccess:^(id response) {
        ARActionLog(@"Unfollowed artist %@ from onboarding.", artist.artistID);

    } failure:^(NSError *error) {
        ARErrorLog(@"Error unfollowing artist %@ from onboarding. Error: %@", artist.artistID, error.localizedDescription);
        [self addArtist:artist];
    }];
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
    return self.artists.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    AROnboardingFollowableTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellId];
    Artist *artist = (Artist *)self.artists[indexPath.row];
    cell.textLabel.text = artist.name;
    //    cell.followState = artist.isFollowed;

    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    Artist *artist = [self.artists objectAtIndex:indexPath.row];
    [self.artists removeObject:artist];
    [tableView deleteRowsAtIndexPaths:@[ indexPath ] withRowAnimation:UITableViewRowAnimationFade];
    [self unfollowArtist:artist];
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 54;
}

@end
