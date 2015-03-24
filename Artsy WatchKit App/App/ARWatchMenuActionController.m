#import "ARWatchMenuActionController.h"
#import "ArtsyWatchAPI.h"

@implementation ARWatchMenuActionController

- (void)heartArtwork:(WatchArtwork *)artwork;
{

}

- (void)unheartArtwork:(WatchArtwork *)artwork;
{

}

- (void)heartArtworkArtist:(WatchArtwork *)artwork;
{

}

- (void)unheartArtworkArtist:(WatchArtwork *)artwork;
{

}

+ (void)getRequest:(NSURLRequest *)request parseToArrayOfClass:(Class)klass :(void (^)(NSURLResponse *response, NSError *error))completionHandler
{
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler: ^(NSData *data, NSURLResponse *response, NSError *error) {

        completionHandler(response, error);
    }];

    [task resume];
}


@end
