#import "ARSelectedTab.h"

@interface ARSelectedTab ()
@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@end

@implementation ARSelectedTab

static NSString *selectedTab = @"home";
static void (^callback)(void);

+ (void)tabChangedTo:(NSString *)tabType
{
    selectedTab = tabType;
    __weak void (^cb)(void) = callback;
    dispatch_async(dispatch_get_main_queue(), ^{
        if (cb) {
            cb();
        }
    });
}

@synthesize isBeingObserved;

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

-(instancetype)init
{
  self = [super init];
  if (self) {
      __weak ARSelectedTab *wself = self;
      callback = ^() {
          __strong ARSelectedTab *sself = wself;
          if (!sself) return;
          if (sself.isBeingObserved) {
              [sself sendEventWithName:@"selectedTabChanged" body:selectedTab];
          }
      };
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
    return @{@"name": selectedTab};
}

@end
