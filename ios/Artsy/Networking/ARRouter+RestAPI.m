#import "ARRouter+RestAPI.h"
#import "ARRouter+GraphQL.h"
#import "ARNetworkConstants.h"
#import <ObjectiveSugar/ObjectiveSugar.h>
#import "Artwork.h"
#import "ARAppStatus.h"
#import "User.h"
#import "Fair.h"
#import "Artist.h"
#import "Gene.h"



// Required to use stringWithFormat on non-literal strings (we load them from the bundle, so it should be secure).
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wformat-nonliteral"
#pragma clang diagnostic ignored "-Wformat"

@implementation ARRouter(RestAPI)

#pragma mark -
#pragma mark User


+ (NSURLRequest *)newMyFollowProfileRequest:(NSString *)profileID
{
    return [self requestWithMethod:@"POST" path:ARFollowProfileURL parameters:@{ @"profile_id" : profileID }];
}

+ (NSURLRequest *)newMyUnfollowProfileRequest:(NSString *)profileID
{
    NSString *path = NSStringWithFormat(ARUnfollowProfileURLFormat, profileID);
    return [self requestWithMethod:@"DELETE" path:path parameters:@{ @"profile_id" : profileID }];
}

+ (NSURLRequest *)newFollowingProfilesRequestWithFair:(Fair *)fair
{
    return [self requestWithMethod:@"GET" path:ARFollowProfilesURL parameters:@{ @"fair_id" : fair.fairID }];
}

#pragma mark -
#pragma mark Artwork Favorites (items in the saved-artwork collection)

+ (NSURLRequest *)newSetArtworkFavoriteRequestForArtwork:(Artwork *)artwork status:(BOOL)status
{
    NSString *method = status ? @"POST" : @"DELETE";
    NSString *url = [NSString stringWithFormat:ARAddArtworkToFavoritesURLFormat, artwork.artworkID];
    return [self requestWithMethod:method
                              path:url
                        parameters:@{ @"user_id" : [User currentUser].userID ?: @"" }];
}

+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtwork:(Artwork *)artwork
{
    return [self newCheckFavoriteStatusRequestForArtworks:@[ artwork ]];
}

+ (NSURLRequest *)newCheckFavoriteStatusRequestForArtworks:(NSArray *)artworks
{
    NSArray *slugs = [artworks map:^(Artwork *artwork) {
        return artwork.artworkID;
    }];

    NSDictionary *params = @{
        @"artworks" : slugs,
        @"user_id" : [User currentUser].userID ?: @"",
        @"private" : @"true"
    };
    return [self requestWithMethod:@"GET" path:ARFavoritesURL parameters:params];
}

#pragma mark -
#pragma mark Artist

+ (NSURLRequest *)newArtistsFromPersonalCollectionAtPage:(NSInteger)page
{
    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:@{ @"page" : @(page) }];
}

+ (NSURLRequest *)newFollowArtistRequest:(Artist *)artist
{
    return [self requestWithMethod:@"POST"
                              path:ARFollowArtistURL
                        parameters:@{ @"artist_id" : artist.artistID }];
}

+ (NSURLRequest *)newUnfollowArtistRequest:(Artist *)artist
{
    NSString *url = [NSString stringWithFormat:ARUnfollowArtistURLFormat, artist.artistID];
    return [self requestWithMethod:@"DELETE" path:url parameters:nil];
}

+ (NSURLRequest *)newFollowingRequestForArtist:(Artist *)artists
{
    return [self newFollowingRequestForArtists:@[ artists ]];
}

+ (NSURLRequest *)newFollowingRequestForArtists:(NSArray *)artists
{
    NSArray *slugs = [artists map:^(Artist *artist) {
        return artist.artistID;
    }];

    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:@{ @"artists" : slugs }];
}

+ (NSURLRequest *)newArtistRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"artist_id" : artist.artistID,
                              @"size" : @1,
                              @"exclude_artist_ids" : artistIDsToExclude };

    return [self requestWithMethod:@"GET" path:ARRelatedArtistsURL parameters:params];
}

+ (NSURLRequest *)newArtistsRelatedToArtistRequest:(Artist *)artist excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"artist_id" : artist.artistID,
                              @"exclude_artist_ids" : artistIDsToExclude };
    return [self requestWithMethod:@"GET" path:ARRelatedArtistsURL parameters:params];
}

+ (NSURLRequest *)newGeneRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude
{
    NSArray *geneIDsToExclude = [genesToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"size" : @1,
                              @"exclude_gene_ids" : geneIDsToExclude };
    return [self requestWithMethod:@"GET" path:NSStringWithFormat(ARRelatedGeneURLFormat, gene.geneID) parameters:params];
}

+ (NSURLRequest *)newGenesRelatedToGeneRequest:(Gene *)gene excluding:(NSArray *)genesToExclude
{
    NSArray *geneIDsToExclude = [genesToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"exclude_gene_ids" : geneIDsToExclude };

    return [self requestWithMethod:@"GET" path:NSStringWithFormat(ARRelatedGeneURLFormat, gene.geneID) parameters:params];
}

+ (NSURLRequest *)newArtistsPopularRequest
{
    return [self requestWithMethod:@"GET" path:ARPopularArtistsURL parameters:nil];
}

+ (NSURLRequest *)newArtistsPopularRequestFallback
{
    // we guard against delta not being able to provide us the current popular artists
    // by having a backup list on S3

    NSString *stringURL = @"https://s3.amazonaws.com/eigen-production/json/eigen_popularartists.json";

    return [[NSURLRequest alloc] initWithURL:[NSURL URLWithString:stringURL]];
}

+ (NSURLRequest *)newGenesPopularRequest

{
    // we get hard coded categories from this json file that force uses also
    NSString *stringURL = @"https://s3.amazonaws.com/eigen-production/json/eigen_categories.json";

    return [[NSURLRequest alloc] initWithURL:[NSURL URLWithString:stringURL]];
}

#pragma mark - Genes

+ (NSURLRequest *)newFollowingRequestForGene:(Gene *)gene
{
    return [self newFollowingRequestForGenes:@[ gene ]];
}

+ (NSURLRequest *)newFollowGeneRequest:(Gene *)gene
{
    return [self requestWithMethod:@"POST" path:ARFollowGeneURL parameters:@{ @"gene_id" : gene.geneID }];
}

+ (NSURLRequest *)newUnfollowGeneRequest:(Gene *)gene
{
    NSString *url = [NSString stringWithFormat:ARUnfollowGeneURLFormat, gene.geneID];
    return [self requestWithMethod:@"DELETE" path:url parameters:nil];
}

+ (NSURLRequest *)newFollowingRequestForGenes:(NSArray *)genes
{
    NSArray *slugs = [genes map:^(Gene *gene) { return gene.geneID;
    }];
    return [self requestWithMethod:@"GET" path:ARFollowGenesURL parameters:@{ @"genes" : slugs }];
}

#pragma mark - Shows

#pragma mark - Models

+ (NSURLRequest *)newProfileInfoRequestWithID:(NSString *)profileID
{
    NSString *url = [NSString stringWithFormat:ARProfileInformationURLFormat, profileID];
    return [self requestWithMethod:@"GET" path:url parameters:nil];
}

#pragma mark -
#pragma mark Search

+ (NSURLRequest *)newArtistSearchRequestWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude
{
    NSArray *artistIDsToExclude = [artistsToExclude valueForKey:@"uuid"];

    NSDictionary *params = @{ @"term" : query,
                              @"exclude_ids" : artistIDsToExclude };

    return [self requestWithMethod:@"GET" path:ARNewArtistSearchURL parameters:params];
}

#pragma mark -
#pragma mark Fairs

+ (NSURLRequest *)newFollowArtistRequest
{
    return [self requestWithMethod:@"GET" path:ARFollowArtistsURL parameters:nil];
}

#pragma mark - Recommendations

+ (NSURLRequest *)worksForYouRequest
{
    return [ARRouter requestWithMethod:@"GET" path:ARNotificationsURL parameters:@{
        @"page" : @1,
        @"type" : @"ArtworkPublished",
        @"user_id" : [User currentUser].userID,
        @"size" : @(10)
    }];
}

+ (NSURLRequest *)markNotificationsAsReadRequest
{
    return [self requestWithMethod:@"PUT" path:ARNotificationsURL parameters:@{ @"status" : @"read" }];
}

#pragma mark -
#pragma mark Misc Site


+ (NSURLRequest *)newSetDeviceAPNTokenRequest:(NSString *)token forDevice:(NSString *)device
{
    NSString *bundleID = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];

    NSDictionary *params = @{
        @"name" : device,
        @"token" : token,
        @"app_id" : bundleID,
        @"production" : ARAppStatus.isBetaOrDev ? @"false" : @"true"
    };
    return [self requestWithMethod:@"POST" path:ARNewDeviceURL parameters:params];
}

+ (NSURLRequest *)newDeleteDeviceRequest:(NSString *)token
{
    return [self requestWithMethod:@"DELETE" path:[NSString stringWithFormat:ARDeleteDeviceURL, token]];
}

+ (NSURLRequest *)graphQLRequestForQuery:(NSString *)query
{
    return [self graphQLRequestForQuery:query variables:nil];
}

+ (NSURLRequest *)graphQLRequestForQuery:(NSString *)query variables:(NSDictionary *)variables
{
  // Note that we're relying on the host to specify the domain for the request.
  NSString *url = [self baseMetaphysicsApiURLString];

  // Makes a copy of the request serializer, one that will encode HTTP body as JSON instead of URL-encoded params.
  AFJSONRequestSerializer *jsonSerializer = [[AFJSONRequestSerializer alloc] init];
  for (NSString *key in [ARRouter staticHTTPClient].requestSerializer.HTTPRequestHeaders.allKeys) {
    id value = [ARRouter staticHTTPClient].requestSerializer.HTTPRequestHeaders[key];
    [jsonSerializer setValue:value forHTTPHeaderField:key];
  }

  [jsonSerializer setValue:[User currentUser].userID forHTTPHeaderField:@"X-User-ID"];
  NSError *error;

  NSMutableDictionary *params = [[NSMutableDictionary alloc] initWithDictionary:@{ @"query" : query }];
  if (variables && variables.count > 0) {
    [params setValue:[self jsonDictionaryForVariables:variables] forKey:@"variables"];
  }

  NSMutableURLRequest *request = [jsonSerializer requestWithMethod:@"POST" URLString:url parameters:params error:&error];

  if (error) {
    NSLog(@"Error serializing request: %@", error);
  }

  return request;
}

+ (NSString *)jsonDictionaryForVariables:(NSDictionary *)variables
{
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:variables options:0 error:nil];
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

+ (NSURLRequest *)liveSaleStaticDataRequest:(NSString *)saleID role:(NSString *)role
{
    NSString *accessType = role ? [NSString stringWithFormat:@"role: %@,", [role uppercaseString]] : @"";
    NSString *causalityRole = [NSString stringWithFormat:@"system { causalityJWT(%@ saleID: \"%@\") }", accessType, saleID];

    NSString *query = [self graphQLQueryForLiveSaleStaticData:saleID role:causalityRole];
    return [self graphQLRequestForQuery:query];
}

+ (NSURLRequest *)biddersRequestForSale:(NSString *)saleID
{
    NSDictionary *params;
    if (saleID) {
        params = @{ @"sale_id" : saleID };
    }
    NSMutableURLRequest *req = [self requestWithMethod:@"GET" path:ARMyBiddersURL parameters:params];
    req.cachePolicy = NSURLRequestReloadIgnoringCacheData;
    return req;
}

+ (NSURLRequest *)requestForSaleID:(NSString *)saleID
{
    NSString *path = [NSString stringWithFormat:ARSaleURLFormat, saleID];
    NSMutableURLRequest *req = [self requestWithMethod:@"GET" path:path parameters:nil];
    req.cachePolicy = NSURLRequestReloadIgnoringCacheData;
    return req;
}

+ (NSURLRequest *)newSystemTimeRequest
{
    return [self requestWithMethod:@"GET" path:ARSystemTimeURL parameters:nil];
}

+ (NSURLRequest *)newRequestForPageContent:(NSString *)slug
{
    NSString *url = [NSString stringWithFormat:ARPageURLFormat, slug];
    return [self requestWithMethod:@"GET" path:url parameters:nil];
}

@end

#pragma clang dianostic pop
