#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <AFNetworking/AFHTTPSessionManager.h>

@class Artist, Artwork, Fair, FairOrganizer, Gene, PartnerShow, Profile;
@class AFHTTPSessionManager;


@interface ARRouter : NSObject

+ (void)setup;
+ (AFHTTPSessionManager *)staticHTTPClient;
+ (NSSet *)artsyHosts;
+ (NSURL *)baseApiURL;
+ (NSURL *)baseWebURL;
+ (NSString *)baseMetaphysicsApiURLString;
+ (NSString *)baseCausalitySocketURLString;

+ (void)setupUserAgent;
+ (BOOL)isWebURL:(NSURL *)url;
+ (BOOL)isTelURL:(NSURL *)url;
+ (NSURL *)resolveRelativeUrl:(NSString *)path;

+ (BOOL)isBNMORequestURL:(NSURL *)url;

+ (BOOL)isInternalURL:(NSURL *)url;

+ (NSURLRequest *)requestForURL:(NSURL *)url;
+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method path:(NSString *)path;
+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method path:(NSString *)path parameters:(NSDictionary *)params;
+ (NSMutableURLRequest *)requestWithMethod:(NSString *)method URLString:(NSString *)urlString parameters:(NSDictionary *)params;


+ (void)setHTTPHeader:(NSString *)header value:(NSString *)value;

+ (NSString *)userAgent;

#pragma mark - OAuth

+ (void)setAuthToken:(NSString *)token;

#pragma mark - XApp
+ (void)setXappToken:(NSString *)token;
+ (NSURLRequest *)newXAppTokenRequest;


@end
