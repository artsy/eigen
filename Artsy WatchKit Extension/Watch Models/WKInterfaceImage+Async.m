#import "WKInterfaceImage+Async.h"

@implementation WKInterfaceImage(Async)

- (void)ar_asyncSetImageURL:(NSURL *)url
{
    [self ar_asyncSetImageURL:url completion:nil];
}

- (void)ar_asyncSetImageURL:(NSURL *)url completion:(void (^)())completion
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

        NSData *data = [NSData dataWithContentsOfURL:url];
        UIImage *placeholder = [UIImage imageWithData:data];

        dispatch_async(dispatch_get_main_queue(), ^{
            [self setImage:placeholder];
            if (completion) completion();
        });
    });
}


@end
