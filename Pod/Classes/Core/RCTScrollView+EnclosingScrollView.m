// These monkey-patches make it so that nested scrollviews can still use the `onScroll` callback.
//
// 1. When a scrollview is added to a view hierarchy, it checks if any of its ancestors are a
//    scrollview and, if so, registers for scroll event notifications vented by that ancestor.
// 2. When a scrollview scrolls, it not only sends events for itself over the JS bridge, but also
//    posts an event notification with the event.
// 3. When a nested scrollview receives an event notification from an ancestor, it generates a new
//    event based on the original, with the exception of:
//    * The scrollview `contentOffset` is offset by the location of the nested scrollview inside
//      the ancestor scrollview.
//    * The view measurements included in the event are of the ancestor scrollview instead of the
//      nested scrollview itself, so that `onScroll` handlers that e.g. try to calculate if the
//      end of the view has been reached, will take the actual clipview (that of the ancestor) into
//      account.
//

#import <React/RCTScrollView.h>
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import <objc/runtime.h>

@interface RCTScrollEvent : NSObject <RCTEvent>
- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
          scrollViewContentOffset:(CGPoint)scrollViewContentOffset
           scrollViewContentInset:(UIEdgeInsets)scrollViewContentInset
            scrollViewContentSize:(CGSize)scrollViewContentSize
                  scrollViewFrame:(CGRect)scrollViewFrame
              scrollViewZoomScale:(CGFloat)scrollViewZoomScale
                         userData:(NSDictionary *)userData
                    coalescingKey:(uint16_t)coalescingKey NS_DESIGNATED_INITIALIZER;
@end


@interface RCTDescendantScrollEvent : RCTScrollEvent
@property (nonatomic, strong, readonly) NSDictionary *body;
@end

@implementation RCTDescendantScrollEvent

@synthesize body = _body;

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
          scrollViewContentOffset:(CGPoint)scrollViewContentOffset
           scrollViewContentInset:(UIEdgeInsets)scrollViewContentInset
            scrollViewContentSize:(CGSize)scrollViewContentSize
              scrollViewZoomScale:(CGFloat)scrollViewZoomScale
         enclosingScrollViewFrame:(CGRect)enclosingScrollViewFrame
                         userData:(NSDictionary *)userData
                    coalescingKey:(uint16_t)coalescingKey
{
  // Use the enclosing scrollview’s dimensions for `scrollViewFrame``, because it is likely that the receiver wants to
  // do calculations based on the location of the content in the enclosing scrollview.
  if ((self = [super initWithEventName:(NSString *)eventName
                              reactTag:(NSNumber *)reactTag
               scrollViewContentOffset:(CGPoint)scrollViewContentOffset
                scrollViewContentInset:(UIEdgeInsets)scrollViewContentInset
                 scrollViewContentSize:(CGSize)scrollViewContentSize
                       scrollViewFrame:(CGRect)enclosingScrollViewFrame
                   scrollViewZoomScale:(CGFloat)scrollViewZoomScale
                              userData:(NSDictionary *)userData
                         coalescingKey:(uint16_t)coalescingKey])) {
    // Theoretically it’s probably better to calculate this once `body` is actually used (which is what the superclass
    // does) but that probably works in conjunction with coalescing, something we don’t do atm anyways.
    NSDictionary *body = @{
                           @"contentOffset": @{
                               @"x": @(scrollViewContentOffset.x),
                               @"y": @(scrollViewContentOffset.y)
                               },
                           @"contentInset": @{
                               @"top": @(scrollViewContentInset.top),
                               @"left": @(scrollViewContentInset.left),
                               @"bottom": @(scrollViewContentInset.bottom),
                               @"right": @(scrollViewContentInset.right)
                               },
                           @"contentSize": @{
                               @"width": @(scrollViewContentSize.width),
                               @"height": @(scrollViewContentSize.height)
                               },
                           @"layoutMeasurement": @{
                               @"width": @(enclosingScrollViewFrame.size.width),
                               @"height": @(enclosingScrollViewFrame.size.height)
                               },
                           @"zoomScale": @(scrollViewZoomScale ?: 1),
                           };

    if (userData) {
      NSMutableDictionary *mutableBody = [body mutableCopy];
      [mutableBody addEntriesFromDictionary:userData];
      body = [mutableBody copy];
    }

    _body = body;
  }
  return self;
}

@end


@implementation RCTScrollEvent (RCTEnclosingScrollView)

- (RCTDescendantScrollEvent *)scrollEventForScrollView:(UIScrollView *)scrollView
                       relativeFromEnclosingScrollView:(UIScrollView *)enclosingScrollView
                                              reactTag:(NSNumber *)reactTag
                                         coalescingKey:(uint16_t)coalescingKey
{
  // TODO: Is this not simply scrollView.frame.origin ?
  CGPoint originOffset = [scrollView convertPoint:CGPointZero toView:enclosingScrollView];
  CGPoint contentOffset = enclosingScrollView.contentOffset;
  // TODO: contentOffset.x -= originOffset.x;
  contentOffset.x = scrollView.contentOffset.x;
  contentOffset.y -= originOffset.y;

  return [[RCTDescendantScrollEvent alloc] initWithEventName:self.eventName
                                                    reactTag:reactTag
                                     scrollViewContentOffset:contentOffset
                                      scrollViewContentInset:scrollView.contentInset
                                       scrollViewContentSize:scrollView.contentSize
                                         scrollViewZoomScale:scrollView.zoomScale
                                    enclosingScrollViewFrame:enclosingScrollView.frame
                                                    userData:[self valueForKey:@"_userData"]
                                               coalescingKey:coalescingKey];

}

@end

@interface RCTScrollView (RCTEnclosingScrollView)
- (void)optOutOfParentScrollEvents;
- (void)optOutOfAllScrollEvents;
- (void)optInToAllScrollEvents;
@end

void* optOutAssociatedPointer = &optOutAssociatedPointer;
void* optOutAllAssociatedPointer = &optOutAllAssociatedPointer;

@implementation RCTScrollView (RCTEnclosingScrollView)

// Provide the ability to opt out of scroll event propagation from parents to children.
// The child opts out of receiving them.

- (BOOL)optingOut
{
  return [objc_getAssociatedObject(self, optOutAssociatedPointer) boolValue];
}

- (void)setOptingOut:(BOOL)optingOut
{
  objc_setAssociatedObject(self, optOutAssociatedPointer, @(optingOut), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)optOutOfParentScrollEvents
{
  self.optingOut = YES;
}

- (BOOL)optingOutOfAllScrollEvents
{
  return [objc_getAssociatedObject(self, optOutAllAssociatedPointer) boolValue];
}

- (void)setOptingOutOfAllScrollEvents:(BOOL)optingOut
{
  objc_setAssociatedObject(self, optOutAllAssociatedPointer, @(optingOut), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)optOutOfAllScrollEvents
{
  self.optingOutOfAllScrollEvents = YES;
}

- (void)optInToAllScrollEvents
{
  self.optingOutOfAllScrollEvents = NO;
}

// Override method, because we want to send the generated event through the notification center.
// Everything but the last line of the method are exactly as the original, except with a bunch of KVC shenanigans.
- (void)sendScrollEventWithName:(NSString *)eventName
                     scrollView:(UIScrollView *)scrollView
                       userData:(NSDictionary *)userData
{
  //    if (![_lastEmittedEventName isEqualToString:eventName]) {
  //        _coalescingKey++;
  //        _lastEmittedEventName = [eventName copy];
  //    }
  //    RCTScrollEvent *scrollEvent = [[RCTScrollEvent alloc] initWithEventName:eventName
  //                                                                   reactTag:self.reactTag
  //                                                                 scrollView:scrollView
  //                                                                   userData:userData
  //                                                              coalescingKey:_coalescingKey];
  //    [_eventDispatcher sendEvent:scrollEvent];

  if (self.optingOutOfAllScrollEvents) {
    return;
  }
  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];

  if (![eventName isEqualToString:[self valueForKey:@"_lastEmittedEventName"]]) {
    coalescingKey++;
    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
    [self setValue:eventName forKey:@"_lastEmittedEventName"];
  }

  RCTScrollEvent *scrollEvent = [[RCTScrollEvent alloc] initWithEventName:eventName
                                                                 reactTag:self.reactTag
                                                  scrollViewContentOffset:self.scrollView.contentOffset
                                                   scrollViewContentInset:self.contentInset
                                                    scrollViewContentSize:self.contentSize
                                                          scrollViewFrame:self.frame
                                                      scrollViewZoomScale:self.scrollView.zoomScale
                                                                 userData:userData
                                                            coalescingKey:coalescingKey];

  // static int transforms = 0;
  // NSLog(@"eventses %d", transforms++);
  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];

  // TODO: This doesn’t coalesce, which is something that’s done by the event dispatcher
  [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTScrollEvent" object:self userInfo:@{ @"event": scrollEvent }];
}

- (void)_enclosingRCTScrollViewEvent:(NSNotification *)notification;
{
  // TODO: Currently this receives notifications from any scrollView, it might be more
  //       efficient if this could be limited to just the enclosing one, if any, however
  //       I was not able to find a great place in RN where the ancestor view hierarchy
  //       is guaranteed to exist.
  //
  RCTScrollView *enclosingScrollView = notification.object;
  // Only handle events of scrollviews that actually enclose this scrollview.
  if (enclosingScrollView == self || ![self isDescendantOfView:enclosingScrollView]) {
    return;
  }

  if (self.optingOut) {
    return;
  }

  // TODO: This is even more of a hack than all the rest of the change!!!
  //       The enclosing scroll view *must* have a throttle amount set or
  //       it won’t send more scroll move events.
  //
  if (enclosingScrollView.scrollEventThrottle == 0) {
    enclosingScrollView.scrollEventThrottle = self.scrollEventThrottle;
  }

  RCTScrollEvent *scrollEvent = notification.userInfo[@"event"];

  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];

  if (![scrollEvent.eventName isEqualToString:[self valueForKey:@"_lastEmittedEventName"]]) {
    coalescingKey++;
    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
    [self setValue:scrollEvent.eventName forKey:@"_lastEmittedEventName"];
  }

  scrollEvent = [scrollEvent scrollEventForScrollView:self.scrollView
                      relativeFromEnclosingScrollView:enclosingScrollView.scrollView
                                             reactTag:self.reactTag
                                        coalescingKey:coalescingKey];

  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];
}

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];
  if (self.superview) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_enclosingRCTScrollViewEvent:)
                                                 name:@"RCTScrollEvent"
                                               object:nil];
  } else {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:@"RCTScrollEvent"
                                                  object:nil];
  }
}

@end
