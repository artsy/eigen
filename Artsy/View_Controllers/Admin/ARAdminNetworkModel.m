#import "ARAdminNetworkModel.h"
#import "ARDispatchManager.h"

@implementation ARAdminNetworkModel

- (void)getEmissionJSON:(NSString *)path completion:(void (^)(NSDictionary *json, NSError *error))completion
{
    [self getEmissionData:path completion:^(NSData *data, NSError *error) {
        id JSON = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
        ar_dispatch_main_queue(^{
            completion(JSON, error);
        });
    }];
}

- (void)getEmissionFile:(NSString *)path completion:(void (^)(NSString *fileContents, NSError *error))completion
{
    [self getEmissionData:path completion:^(NSData *data, NSError *error) {
        ar_dispatch_main_queue(^{
            completion([[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding], error);
        });
    }];
}

- (void)getEmissionData:(NSString *)path completion:(void (^)(NSData *data, NSError *error))completion;
{
    NSURLSession *session = [NSURLSession sharedSession];
    NSString *urlFormat = @"https://raw.githubusercontent.com/artsy/emission/master/%@";
    NSString *url = [NSString stringWithFormat: urlFormat, path];
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            completion(data, error);
    }];
    [task resume];
}


@end
