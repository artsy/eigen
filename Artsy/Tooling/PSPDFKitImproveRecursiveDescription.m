#import <UIKit/UIKit.h>

#import "ARLogger.h"

// Copyright (c) 2012-2013 Peter Steinberger (http://petersteinberger.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#ifdef DEBUG

#import <objc/runtime.h>

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Helper for Swizzling

static BOOL PSPDFReplaceMethodWithBlock(Class c, SEL origSEL, SEL newSEL, id block)
{
    NSCAssert(c && origSEL && newSEL && block, @"Expected parameters.");
    Method origMethod = class_getInstanceMethod(c, origSEL);
    const char *encoding = method_getTypeEncoding(origMethod);

    // Add the new method.
    IMP impl = imp_implementationWithBlock(block);
    if (!class_addMethod(c, newSEL, impl, encoding)) {
        ARActionLog(@"Failed to add method: %@ on %@", NSStringFromSelector(newSEL), c);
        return NO;
    } else {
        // Ensure the new selector has the same parameters as the existing selector.
        Method newMethod = class_getInstanceMethod(c, newSEL);
        NSCAssert(strcmp(method_getTypeEncoding(origMethod), method_getTypeEncoding(newMethod)) == 0, @"Encoding must be the same.");

        // If original doesn't implement the method we want to swizzle, create it.
        if (class_addMethod(c, origSEL, method_getImplementation(newMethod), encoding)) {
            class_replaceMethod(c, newSEL, method_getImplementation(origMethod), encoding);
        } else {
            method_exchangeImplementations(origMethod, newMethod);
        }
    }
    return YES;
}

///////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Improve Description of UIImage/UIImageView

static inline BOOL PSPDFIsVisibleView(__unsafe_unretained UIView *view)
{
    BOOL isViewHidden = view.isHidden || view.alpha < 0.01f || CGRectIsEmpty(view.frame);
    return !view || (PSPDFIsVisibleView(view.superview) && !isViewHidden);
}

// Following code patches UIView's description to show the class name of a view controller, if one is attached.
// Will only get compiled for debugging. Use 'po [[UIWindow keyWindow] recursiveDescription]' to invoke.
__attribute__((constructor)) static void PSPDFKitImproveRecursiveDescription(void)
{
    @autoreleasepool
    {
        SEL descriptionSEL = NSSelectorFromString(@"pspdf_description");
        PSPDFReplaceMethodWithBlock(UIView.class, @selector(description), descriptionSEL, ^(id self) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
      NSMutableString *description = [self performSelector:descriptionSEL];
#pragma clang diagnostic pop
      SEL viewDelegateSEL = NSSelectorFromString([NSString stringWithFormat:@"%@ewDelegate", @"_vi"]); // pr. API
      if ([self respondsToSelector:viewDelegateSEL]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        UIViewController *viewController = [self performSelector:viewDelegateSEL];
#pragma clang diagnostic pop
        NSString *viewControllerClassName = NSStringFromClass(viewController.class);
        
        if (viewControllerClassName.length) {
          NSString *children = @""; // iterate over childViewControllers
          
          if ([viewController respondsToSelector:@selector(childViewControllers)] && viewController.childViewControllers.count) {
            NSString *origDescription = description;
            description = [NSMutableString stringWithFormat:@"%luc.[", (unsigned long)viewController.childViewControllers.count];
            for (UIViewController *childViewController in viewController.childViewControllers) {
              [description appendFormat:@"%@ %p: ", childViewController.class, childViewController];
            }
            [description appendFormat:@"] %@", origDescription];
          }
          
          // check if the frame of a childViewController is bigger than the one of a parentViewController. (usually this is a bug)
          NSString *warnString = @"";
          if (viewController && viewController.parentViewController && [viewController isViewLoaded] && [viewController.parentViewController isViewLoaded]) {
            CGRect parentRect = viewController.parentViewController.view.bounds;
            CGRect childRect = viewController.view.frame;
            
            if (parentRect.size.width < childRect.origin.x + childRect.size.width ||
                parentRect.size.height < childRect.origin.y + childRect.size.height) {
              warnString = @"* OVERLAP! ";
            }else if (CGRectIsEmpty(childRect)) {
              warnString = @"* ZERORECT! ";
            }
          }
          description = [NSMutableString stringWithFormat:@"%@%@:%p%@ %@", warnString, viewControllerClassName, viewController, children, description];
        }
      }
      // add marker if view (or a superview) is hidden
      if (!PSPDFIsVisibleView(self)) {
        description = [NSMutableString stringWithFormat:@"XX (%@)", description];
      }
      return description;
        });
    }
}

// Instead of "<UIImage: 0x8b612f0>" we want "<UIImage:0x8b612f0 size:{768, 1001} scale:1 imageOrientation:0>".
// Doesn't use any private API.
__attribute__((constructor)) static void PSPDFKitImproveImageDescription(void)
{
    @autoreleasepool
    {
        SEL descriptionSEL = NSSelectorFromString(@"pspdf_description");
        PSPDFReplaceMethodWithBlock(UIImage.class, @selector(description), descriptionSEL, ^(UIImage *self) {
      NSMutableString *description = [NSMutableString stringWithFormat:@"<%@: %p size:%@", self.class, self, NSStringFromCGSize(self.size)];
      if (self.scale > 1) {
        [description appendFormat:@" scale:%.0f", self.scale];
      }
      if ([self imageOrientation] != UIImageOrientationUp) {
        [description appendFormat:@" imageOrientation:%d", (int)self.imageOrientation];
      }
      [description appendString:@">"];
#if __has_feature(objc_arc)
      return [description copy];
#else
      return [[description copy] autorelease];
#endif
        });
    }
}

// Breaks on iOS >= 7
//
//// Add image description to UIImageView.
//__attribute__((constructor)) static void PSPDFKitImproveImageViewDescription(void) {
//  @autoreleasepool {
//    SEL descriptionSEL = NSSelectorFromString(@"pspdf_description");
//    PSPDFReplaceMethodWithBlock(UIImageView.class, @selector(description), descriptionSEL, ^(UIImageView *self) {
//#pragma clang diagnostic push
//#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
//      return [NSString stringWithFormat:@"%@->%@", [self performSelector:descriptionSEL], [self.image description]];
//#pragma clang diagnostic pop
//    });
//  }
//}

#endif
