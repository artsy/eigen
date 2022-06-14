#import "ARInternalShareValidator.h"
#import "ARSharingController.h"
#import "Article.h"
#import "NSString+StringBetweenStrings.h"


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
    NSString *readableQuery = [url.query stringByRemovingPercentEncoding];

    if ([self isFacebookShareURL:url]) {
        return [readableQuery componentsSeparatedByString:@"u="].lastObject;
    } else if ([self isTwitterShareURL:url]) {
        return [readableQuery componentsSeparatedByString:@"url="].lastObject;
    }

    return nil;
}

- (NSString *)nameBeingSharedInURL:(NSURL *)url
{
    if ([self isFacebookShareURL:url]) {
        return nil;
    } else if ([self isTwitterShareURL:url]) {
        NSString *readableQuery = [url.query stringByRemovingPercentEncoding];
        return [readableQuery substringBetween:@"&text=" and:@"&url="];
    }
    return nil;
}

- (void)shareURL:(NSURL *)url inView:(UIView *)view frame:(CGRect)frame
{
    NSString *actualAddress = [self addressBeingSharedFromShareURL:url];

    // We want to be defensive here incase someone changes the share URL structures
    // in the future.

    if (actualAddress && [actualAddress containsString:@"/article/"]) {
        NSURL *actualURL = [NSURL URLWithString:actualAddress];
        NSString *name = [self nameBeingSharedInURL:url];
        Article *article = [[Article alloc] initWithURL:actualURL name:name];

        ARSharingController *shareArticle = [ARSharingController sharingControllerWithObject:article thumbnailImageURL:nil];
        [shareArticle presentActivityViewControllerFromView:view frame:frame];
    }
}

@end
