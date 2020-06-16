#import "ARSelectedTab.h"

@interface ARSelectedTab ()
@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@property (nonatomic, strong, readwrite) NSDictionary *selectedTab;
@end

static NSDictionary *buildSelectedTab(NSString *tabName)
{
    return @{
        @"name": tabName
    };
}

@implementation ARSelectedTab

@synthesize isBeingObserved;
@synthesize selectedTab;

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"selectedTabChanged"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (void)selectedTabChanged:(NSNotification *)note
{
    __weak ARSelectedTab *wself = self;

    dispatch_async(dispatch_get_main_queue(), ^{
      __strong ARSelectedTab *sself = wself;
      if (!sself) {
        return;
      }
      sself.selectedTab = buildSelectedTab(note.userInfo[@"tabName"]);
      if (sself.isBeingObserved) {
        [sself sendEventWithName:@"selectedTabChanged" body:sself.selectedTab];
      }
    });
}

-(instancetype)init
{
  self = [super init];
  if (self) {
    self.selectedTab = buildSelectedTab(@"ARHomeTab");

    [[NSNotificationCenter defaultCenter]
     addObserver:self selector:@selector(selectedTabChanged:)
     name:@"ARSelectedTabChangedNotification"
     object:nil];
  }
  return self;
}

- (void)startObserving
{
  self.isBeingObserved = true;
}

-(void)stopObserving
{
  self.isBeingObserved = false;
}

- (NSDictionary *)constantsToExport
{
  return self.selectedTab;
}

-(void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
