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

//@interface RCTScrollEvent : NSObject <RCTEvent>
//- (instancetype)initWithEventName:(NSString *)eventName
//                         reactTag:(NSNumber *)reactTag
//                       scrollView:(UIScrollView *)scrollView
//                         userData:(NSDictionary *)userData
//                    coalescingKey:(uint16_t)coalescingKey NS_DESIGNATED_INITIALIZER;
//@end


//@interface RCTDescendantScrollEvent : RCTScrollEvent
//@end

//@implementation RCTDescendantScrollEvent
//{
//  NSDictionary *__userData;
//  UIScrollView *__scrollView;
//  UIScrollView *_enclosingScrollView;
//}
//
//- (instancetype)initWithEventName:(NSString *)eventName
//                         reactTag:(NSNumber *)reactTag
//                       scrollView:(UIScrollView *)scrollView
//              enclosingScrollView:(UIScrollView *)enclosingScrollView
//                         userData:(NSDictionary *)userData
//                    coalescingKey:(uint16_t)coalescingKey
//{
//    if ((self = [super initWithEventName:eventName
//                                reactTag:reactTag
//                              scrollView:scrollView
//                                userData:userData
//                           coalescingKey:coalescingKey])) {
//    __userData = userData;
//    __scrollView = scrollView;
//    _enclosingScrollView = enclosingScrollView;
//  }
//  return self;
//}
//
//- (NSDictionary *)body
//{
//  CGPoint originOffset = [__scrollView convertPoint:CGPointZero toView:_enclosingScrollView];
//  
//  CGPoint contentOffset = _enclosingScrollView.contentOffset;
//  // TODO: contentOffset.x -= originOffset.x;
//  contentOffset.x = __scrollView.contentOffset.x;
//  contentOffset.y -= originOffset.y;
//  
//  NSDictionary *body = @{
//                         @"contentOffset": @{
//                             @"x": @(contentOffset.x),
//                             @"y": @(contentOffset.y)
//                             },
//                         @"contentInset": @{
//                             @"top": @(__scrollView.contentInset.top),
//                             @"left": @(__scrollView.contentInset.left),
//                             @"bottom": @(__scrollView.contentInset.bottom),
//                             @"right": @(__scrollView.contentInset.right)
//                             },
//                         @"contentSize": @{
//                             @"width": @(__scrollView.contentSize.width),
//                             @"height": @(__scrollView.contentSize.height)
//                             },
//                         // Use the enclosing scrollview’s dimensions here, because it is likely that the receiver
//                         // wants to do calculations based on the location of the content in the enclosing scrollview.
//                         @"layoutMeasurement": @{
//                             @"width": @(_enclosingScrollView.frame.size.width),
//                             @"height": @(_enclosingScrollView.frame.size.height)
//                             },
//                         @"zoomScale": @(__scrollView.zoomScale ?: 1),
//                         };
//  
//  if (__userData) {
//    NSMutableDictionary *mutableBody = [body mutableCopy];
//    [mutableBody addEntriesFromDictionary:__userData];
//    body = mutableBody;
//  }
//  
//  return body;
//}
//
//@end


//@implementation RCTScrollEvent (RCTEnclosingScrollView)
//
//- (RCTDescendantScrollEvent *)scrollEventRelativeToDescendant:(UIScrollView *)descendantScrollView
//                                                     reactTag:(NSNumber *)reactTag
//                                                coalescingKey:(uint16_t)coalescingKey
//{
//  return [[RCTDescendantScrollEvent alloc] initWithEventName:self.eventName
//                                                    reactTag:reactTag
//                                                  scrollView:descendantScrollView
//                                         enclosingScrollView:[self valueForKey:@"_scrollView"]
//                                                    userData:[self valueForKey:@"_userData"]
//                                               coalescingKey:coalescingKey];
//}
//
//@end
//

//@implementation RCTScrollView (RCTEnclosingScrollView)
//
//// Override method, because we want to send the generated event through the notification center.
//// Everything but the last line of the method are exactly as the original, except with a bunch of KVC shenanigans.
//- (void)sendScrollEventWithName:(NSString *)eventName
//                     scrollView:(UIScrollView *)scrollView
//                       userData:(NSDictionary *)userData
//{
////    if (![_lastEmittedEventName isEqualToString:eventName]) {
////        _coalescingKey++;
////        _lastEmittedEventName = [eventName copy];
////    }
////    RCTScrollEvent *scrollEvent = [[RCTScrollEvent alloc] initWithEventName:eventName
////                                                                   reactTag:self.reactTag
////                                                                 scrollView:scrollView
////                                                                   userData:userData
////                                                              coalescingKey:_coalescingKey];
////    [_eventDispatcher sendEvent:scrollEvent];
//    
//    
//  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];
//  
//  if (![eventName isEqualToString:[self valueForKey:@"_lastEmittedEventName"]]) {
//    coalescingKey++;
//    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
//    [self setValue:eventName forKey:@"_lastEmittedEventName"];
//  }
//
//  RCTScrollEvent *scrollEvent = [[RCTScrollEvent alloc] initWithEventName:eventName
//                                                                 reactTag:self.reactTag
//                                                               scrollView:scrollView
//                                                                 userData:userData
//                                                            coalescingKey:coalescingKey];
//  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];
//
//  // TODO: This doesn’t coalesce, which is something that’s done by the event dispatcher
//  [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTScrollEvent" object:self userInfo:@{ @"event": scrollEvent }];
//}
//
//- (void)_enclosingRCTScrollViewEvent:(NSNotification *)notification;
//{
//  // TODO: Currently this receives notifications from any scrollView, it might be more
//  //       efficient if this could be limited to just the enclosing one, if any, however
//  //       I was not able to find a great place in RN where the ancestor view hierarchy
//  //       is guaranteed to exist.
//  //
//  RCTScrollView *scrollView = notification.object;
//  // Only handle events of scrollviews that actually enclose this scrollview.
//  if (scrollView == self || ![self isDescendantOfView:scrollView]) {
//    return;
//  }
//
//  // TODO: This is even more of a hack than all the rest of the change!!!
//  //       The enclosing scroll view *must* have a throttle amount set or
//  //       it won’t send more scroll move events.
//  //
//  if (scrollView.scrollEventThrottle == 0) {
//    scrollView.scrollEventThrottle = self.scrollEventThrottle;
//  }
//  
//  RCTScrollEvent *scrollEvent = notification.userInfo[@"event"];
//  
//  uint16_t coalescingKey = [[self valueForKey:@"_coalescingKey"] unsignedIntegerValue];
//    
//  if (![scrollEvent.eventName isEqualToString:[self valueForKey:@"_lastEmittedEventName"]]) {
//    coalescingKey++;
//    [self setValue:@(coalescingKey) forKey:@"_coalescingKey"];
//    [self setValue:scrollEvent.eventName forKey:@"_lastEmittedEventName"];
//  }
//
//  scrollEvent = [scrollEvent scrollEventRelativeToDescendant:self.scrollView
//                                                    reactTag:self.reactTag
//                                               coalescingKey:coalescingKey];
//  [[self valueForKey:@"_eventDispatcher"] sendEvent:scrollEvent];
//}

//- (void)didMoveToSuperview
//{
//  [super didMoveToSuperview];
//  if (self.superview) {
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(_enclosingRCTScrollViewEvent:)
//                                                 name:@"RCTScrollEvent"
//                                               object:nil];
//  } else {
//    [[NSNotificationCenter defaultCenter] removeObserver:self
//                                                    name:@"RCTScrollEvent"
//                                                  object:nil];
//  }
//}
//
//@end
