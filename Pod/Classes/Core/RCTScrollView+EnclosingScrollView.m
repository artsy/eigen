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

@interface RCTScrollEvent : NSObject <RCTEvent>
- (instancetype)initWithType:(RCTScrollEventType)type
                    reactTag:(NSNumber *)reactTag
                  scrollView:(UIScrollView *)scrollView
                    userData:(NSDictionary *)userData
               coalescingKey:(uint16_t)coalescingKey NS_DESIGNATED_INITIALIZER;
@end


@interface RCTDescendantScrollEvent : RCTScrollEvent
@end

@implementation RCTDescendantScrollEvent
{
  NSDictionary *__userData;
  UIScrollView *__scrollView;
  UIScrollView *_enclosingScrollView;
}

- (instancetype)initWithType:(RCTScrollEventType)type
                    reactTag:(NSNumber *)reactTag
                  scrollView:(UIScrollView *)scrollView
         enclosingScrollView:(UIScrollView *)enclosingScrollView
                    userData:(NSDictionary *)userData
               coalescingKey:(uint16_t)coalescingKey
{
  if ((self = [super initWithType:type reactTag:reactTag scrollView:scrollView userData:userData coalescingKey:coalescingKey])) {
    __userData = userData;
    __scrollView = scrollView;
    _enclosingScrollView = enclosingScrollView;
  }
  return self;
}

// TODO For now, as I have no clue what that needs yet
- (BOOL)canCoalesce
{
  return NO;
}

- (NSDictionary *)body
{
  CGPoint originOffset = [__scrollView convertPoint:CGPointZero toView:_enclosingScrollView];
  
  CGPoint contentOffset = _enclosingScrollView.contentOffset;
  // TODO: contentOffset.x -= originOffset.x;
  contentOffset.x = __scrollView.contentOffset.x;
  contentOffset.y -= originOffset.y;
  
  NSDictionary *body = @{
                         @"contentOffset": @{
                             @"x": @(contentOffset.x),
                             @"y": @(contentOffset.y)
                             },
                         @"contentInset": @{
                             @"top": @(__scrollView.contentInset.top),
                             @"left": @(__scrollView.contentInset.left),
                             @"bottom": @(__scrollView.contentInset.bottom),
                             @"right": @(__scrollView.contentInset.right)
                             },
                         @"contentSize": @{
                             @"width": @(__scrollView.contentSize.width),
                             @"height": @(__scrollView.contentSize.height)
                             },
                         // Use the enclosing scrollview’s dimensions here, because it is likely that the receiver
                         // wants to do calculations based on the location of the content in the enclosing scrollview.
                         @"layoutMeasurement": @{
                             @"width": @(_enclosingScrollView.frame.size.width),
                             @"height": @(_enclosingScrollView.frame.size.height)
                             },
                         @"zoomScale": @(__scrollView.zoomScale ?: 1),
                         };
  
  if (__userData) {
    NSMutableDictionary *mutableBody = [body mutableCopy];
    [mutableBody addEntriesFromDictionary:__userData];
    body = mutableBody;
  }
  
  return body;
}

@end


@implementation RCTScrollEvent (RCTEnclosingScrollView)

- (RCTDescendantScrollEvent *)scrollEventRelativeToDescendant:(UIScrollView *)descendantScrollView
                                                     reactTag:(NSNumber *)reactTag
                                                coalescingKey:(uint16_t)coalescingKey
{
  return [[RCTDescendantScrollEvent alloc] initWithType:[[self valueForKey:@"_type"] unsignedIntegerValue]
                                               reactTag:reactTag
                                             scrollView:descendantScrollView
                                    enclosingScrollView:[self valueForKey:@"_scrollView"]
                                               userData:[self valueForKey:@"_userData"]
                                          coalescingKey:coalescingKey];
}

@end


@implementation UIView (RCTEnclosingScrollView)

- (instancetype)_enclosingRCTScrollView
{
  UIView *superview = self.superview;
  if (superview) {
    if ([superview isKindOfClass:RCTScrollView.class]) {
      return superview;
    } else {
      return superview._enclosingRCTScrollView;
    }
  }
  return nil;
}

@end


@implementation RCTScrollView (RCTEnclosingScrollView)

// Override method, because we want to send the generated event through the notification center.
// Everything but the last line of the method are exactly as the original, except with a bunch of KVC shenanigans.
- (void)sendScrollEventWithType:(RCTScrollEventType)type
                       reactTag:(NSNumber *)reactTag
                     scrollView:(UIScrollView *)scrollView
                       userData:(NSDictionary *)userData
{
  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];
  
  if ([[self valueForKey:@"_lastEmittedEventType"] integerValue] != type) {
    coalescingKey++;
    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
    [self setValue:@(type) forKey:@"_lastEmittedEventType"];
  }

  RCTScrollEvent *scrollEvent = [[RCTScrollEvent alloc] initWithType:type
                                                            reactTag:reactTag
                                                          scrollView:scrollView
                                                            userData:userData
                                                       coalescingKey:coalescingKey];
  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];

  // TODO this doesn’t coalesce, which is something that’s done by the event dispatcher
  [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTScrollEvent" object:self userInfo:@{ @"event": scrollEvent }];
}

- (void)_enclosingRCTScrollViewEvent:(NSNotification *)notification;
{
  RCTScrollEvent *scrollEvent = notification.userInfo[@"event"];
  
  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];
  
  RCTScrollEventType type = [[scrollEvent valueForKey:@"_type"] integerValue];
  if ([[self valueForKey:@"_lastEmittedEventType"] integerValue] != type) {
    coalescingKey++;
    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
    [self setValue:@(type) forKey:@"_lastEmittedEventType"];
  }

  scrollEvent = [scrollEvent scrollEventRelativeToDescendant:self.scrollView
                                                    reactTag:[(id<RCTComponent>)self reactTag]
                                               coalescingKey:coalescingKey];
  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];
}

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];
  
  if (self.superview) {
    RCTScrollView *scrollView = self._enclosingRCTScrollView;
    if (scrollView) {
      // TODO: This is even more of a hack than all the rest of the change!!!
      //       The enclosing scroll view *must* have a throttle amount or it won’t send scroll move events.
      if (scrollView.scrollEventThrottle == 0) {
        scrollView.scrollEventThrottle = self.scrollEventThrottle;
      }
      [[NSNotificationCenter defaultCenter] addObserver:self
                                               selector:@selector(_enclosingRCTScrollViewEvent:)
                                                   name:@"RCTScrollEvent"
                                                 object:scrollView];
    }
  } else {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:@"RCTScrollEvent"
                                                  object:nil];
  }
}

@end
