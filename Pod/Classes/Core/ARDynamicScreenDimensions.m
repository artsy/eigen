#import "ARDynamicScreenDimensions.h"
#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface ARDynamicScreenDimensions ()
@property (nonatomic, strong, readwrite) NSDictionary *currentDimensions;
@property (nonatomic, assign, readwrite) BOOL isBeingObserved;
@end


static NSDictionary *
getSafeAreaInsets()
{
  if (@available(iOS 11.0, *)) {
    return @{
             @"top": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.top),
             @"bottom": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.bottom),
             @"left": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.left),
             @"right": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.right)
             };
  } else {
    return @{
             @"top": @(20),
             @"bottom": @(0),
             @"left": @(0),
             @"right": @(0),
             };
  }
}

static NSDictionary *
getScreenDimensions()
{
  CGSize size = UIApplication.sharedApplication.keyWindow.bounds.size;
  return @{
           @"width": @(size.width),
           @"height": @(size.height),
           @"orientation": size.width > size.height ? @"landscape" : @"portrait",
           @"safeAreaInsets": getSafeAreaInsets()
           };
}

@implementation ARDynamicScreenDimensions

@synthesize isBeingObserved;
@synthesize currentDimensions;

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"change"];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (void)orientationChanged:(NSNotification *)note
{
  self.currentDimensions = getScreenDimensions();
  __weak ARDynamicScreenDimensions *wself = self;

  if (self.isBeingObserved) {
    dispatch_async(dispatch_get_main_queue(), ^{
      __strong ARDynamicScreenDimensions *sself = wself;
      if (sself && sself.isBeingObserved) {
        [sself sendEventWithName:@"change" body:sself.currentDimensions];
      }
    });
  }
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
  return self.currentDimensions;
}

-(instancetype)init
{
  self = [super init];
  if (self) {
    self.currentDimensions = getScreenDimensions();
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter]
     addObserver:self selector:@selector(orientationChanged:)
     name:UIDeviceOrientationDidChangeNotification
     object:[UIDevice currentDevice]];
  }
  return self;
}

-(void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
