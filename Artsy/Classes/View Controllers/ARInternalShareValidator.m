#import "ARInternalShareValidator.h"
#import "ARSharingController.h"
#import "Article.h"

@implementation ARInternalShareValidator

- (BOOL)isSocialSharingURL:(NSURL *)url
{
    return [self isTwitterShareURL:url] || [self isFacebookShareURL:url];
}

- (BOOL)isFacebookShareURL:(NSURL *)url
{
    return [url.host hasSuffix:@"facebook.com"] && [url.path isEqualToString:@"/sharer/sharer.php"];
}

- (BOOL)isTwitterShareURL:(NSURL *)url
{
    return [url.host hasSuffix:@"twitter.com"] && [url.path isEqualToString:@"/intent/tweet"];
}

- (NSString *)addressBeingSharedFromShareURL:(NSURL *)url
{
    NSURLComponents *components = [[NSURLComponents alloc] initWithURL:url resolvingAgainstBaseURL:YES];

    if ([self isFacebookShareURL:url]) {
        return [components.queryItems valueForKey:@"u"];
    } else if ([self isTwitterShareURL:url]) {
        return [components.queryItems valueForKey:@"url"];
    }

    return nil;
}

- (NSString *)nameBeingSharedInURL:(NSURL *)url
{
    if ([self isFacebookShareURL:url]) {
        return nil;
    } else if ([self isTwitterShareURL:url]) {
        NSURLComponents *components = [[NSURLComponents alloc] initWithURL:url resolvingAgainstBaseURL:YES];
        return [components.queryItems valueForKey:@"text"];
    }
    return nil;
}

- (void)shareURL:(NSURL *)url inView:(UIView *)view
{
    NSString *actualAddress = [self addressBeingSharedFromShareURL:url];

    // We want to be defensive here incase someone changes the share URL structures
    // in the future.

    if (actualAddress && [actualAddress containsString:@"/article/"]) {
        NSURL *actualURL = [NSURL URLWithString:actualAddress];
        NSString *name = [self nameBeingSharedInURL:url];
        Article *article = [[Article alloc] initWithURL:actualURL name:name];

        ARSharingController *shareArticle = [ARSharingController sharingControllerWithObject:article thumbnailImageURL:nil];
        [shareArticle presentActivityViewControllerFromView:view];
    }
}

@end
