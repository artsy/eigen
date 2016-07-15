#import "AppDelegate.h"
#import "RotationNavigationController.h"

#import "Configuration.h"

#import <Emission/AREmission.h>
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>

#import <React/RCTUtils.h>
#import <TargetConditionals.h>

#define ARTIST @"alex-katz"

#if TARGET_OS_SIMULATOR
#define ENABLE_DEV_MODE
#endif

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@interface AppDelegate () <UITableViewDataSource, UITableViewDelegate>
@property (nonatomic, strong) UINavigationController *navigationController;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  [self setupEmission];
  
  UITableViewController *tableViewController = [UITableViewController new];
  tableViewController.tableView.dataSource = self;
  tableViewController.tableView.delegate = self;

  self.navigationController = [[RotationNavigationController alloc] initWithRootViewController:tableViewController];
  
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = self.navigationController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

#pragma mark - Emission

- (void)setupEmission;
{
  NSAssert(![USER_ID isEqualToString:@"USER ID GOES HERE"], @"Specify your user ID in Configuration.h");
  NSAssert(![OAUTH_TOKEN isEqualToString:@"TOKEN GOES HERE"], @"Specify your access token in Configuration.h");
  
  AREmission *emission = nil;
#ifdef ENABLE_DEV_MODE
  NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  emission = [[AREmission alloc] initWithUserID:USER_ID authenticationToken:OAUTH_TOKEN packagerURL:packagerURL];
#else
  emission = [[AREmission alloc] initWithUserID:USER_ID authenticationToken:OAUTH_TOKEN];
#endif
  [AREmission setSharedInstance:emission];

  emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
    NSNumber *following = @(randomBOOL());
    NSLog(@"Artist(%@).follow => %@", artistID, following);
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block(@[[NSNull null], following]);
    });
  };
  emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
    NSLog(@"Artist(%@).follow = %@", artistID, @(following));
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      if (randomBOOL()) {
        block(@[[NSNull null], @(following)]);
      } else {
        NSLog(@"Simulated follow request ‘failed’.");
        block(@[RCTJSErrorFromNSError([NSError errorWithDomain:@"Artsy" code:42 userInfo:nil]), @(!following)]);
      }
    });
  };
  
  emission.switchBoardModule.presentNavigationViewController = ^(UIViewController * _Nonnull fromViewController,
                                                                 NSString * _Nonnull route) {
    [fromViewController.navigationController pushViewController:[self viewControllerForRoute:route]
                                                       animated:YES];
  };
  
  emission.switchBoardModule.presentModalViewController = ^(UIViewController * _Nonnull fromViewController,
                                                            NSString * _Nonnull route) {
    UIViewController *viewController = [self viewControllerForRoute:route];
    UINavigationController *navigationController = [[RotationNavigationController alloc] initWithRootViewController:viewController];
    viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                                                                                                    target:self
                                                                                                    action:@selector(dismissModalViewController)];
    [fromViewController.navigationController presentViewController:navigationController animated:YES completion:nil];
  };
  
  emission.eventsModule.eventOccurred = ^(UIViewController * _Nonnull fromViewController, NSDictionary * _Nonnull info) {
    NSLog(@"[Event] %@ - %@", fromViewController.class, info);
  };
}

- (UIViewController *)viewControllerForRoute:(NSString *)route;
{
  UIViewController *viewController = nil;
  
  if ([route hasPrefix:@"/artist/"]) {
    NSString *artistID = [[route componentsSeparatedByString:@"/"] lastObject];
    viewController = [[ARArtistComponentViewController alloc] initWithArtistID:artistID];
  } else {
    UILabel *label = [UILabel new];
    label.text = route;
    [label sizeToFit];
    viewController = [UIViewController new];
    viewController.view.backgroundColor = [UIColor redColor];
    [viewController.view addSubview:label];
    label.center = viewController.view.center;
  }
  
  return viewController;
}

- (void)dismissModalViewController;
{
  UINavigationController *navigationController = (UINavigationController *)self.window.rootViewController;
  [navigationController.visibleViewController.navigationController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - Example selection tableview

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
  return 2;
}

// Row display. Implementers should *always* try to reuse cells by setting each cell's reuseIdentifier and querying for available reusable cells with dequeueReusableCellWithIdentifier:
// Cell gets various attributes set automatically based on table (separators) and data source (accessory views, editing controls)

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;
{
  static NSString *cellIdentifier = @"example cell";
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
  if (cell == nil) {
    cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
  }

  cell.textLabel.text = indexPath.row == 0 ? @"Home" : @"Artist";
  return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
{
  ARComponentViewController *viewController = nil;
  if (indexPath.row == 0) {
    viewController = [[ARHomeComponentViewController alloc] init];
  } else {
    viewController = [[ARArtistComponentViewController alloc] initWithArtistID:ARTIST];
  }
  [self.navigationController pushViewController:viewController animated:YES];
}

@end
