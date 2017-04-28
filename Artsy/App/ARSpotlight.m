#import "ARSpotlight.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARUserActivity.h"
#import "ARRouter.h"
#import "ARFileUtils.h"
#import "Fair.h"
#import "Gene.h"
#import "Profile.h"

#import "ARArtworkFavoritesNetworkModel.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARArtistFavoritesNetworkModel.h"
#import "ARDispatchManager.h"
#import "ARLogger.h"

#import "NSDate+DateRange.h"

#import <CoreSpotlight/CoreSpotlight.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <MMMarkdown/MMMarkdown.h>
#import <SDWebImage/SDImageCache.h>
#import <SDWebImage/SDWebImageManager.h>


static BOOL ARSpotlightAvailable = NO;
static dispatch_queue_t ARSpotlightQueue = nil;
static NSMutableSet *ARIndexedEntities = nil;
static NSString *ARIndexedEntitiesFile = nil;
static CSSearchableIndex *ARSearchableIndex = nil;


static NSString *
ARStringByStrippingMarkdown(NSString *markdownString)
{
    NSError *error = nil;
    NSString *renderedString = [MMMarkdown HTMLStringWithMarkdown:markdownString error:&error];
    NSDictionary *importParams = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType};
    NSData *stringData = [renderedString dataUsingEncoding:NSUnicodeStringEncoding];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithData:stringData
                                                                            options:importParams
                                                                 documentAttributes:NULL
                                                                              error:&error];
    if (error) {
        return nil;
    }

    return [attributedString.string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
}


@implementation ARSpotlight

+ (void)load;
{
    ARSpotlightAvailable = NSClassFromString(@"CSSearchableIndex") != nil && [CSSearchableIndex isIndexingAvailable];

    if (ARSpotlightAvailable) {
        ARSearchableIndex = [CSSearchableIndex defaultSearchableIndex];

        ARSpotlightQueue = dispatch_queue_create("net.artsy.artsy.ARSpotlightQueue", DISPATCH_QUEUE_SERIAL);

        // Load/Initialize ARIndexedEntities db.
        ar_dispatch_on_queue(ARSpotlightQueue, ^{
            ARIndexedEntitiesFile = [ARFileUtils appSupportPathWithFolder:nil filename:@"ARIndexedEntitiesFile"];
            if (ARIndexedEntitiesFile) {
                NSArray *entities = [NSArray arrayWithContentsOfFile:ARIndexedEntitiesFile];
                ARIndexedEntities = entities ? [NSMutableSet setWithArray:entities] : [NSMutableSet new];
            } else {
                ARErrorLog(@"Failed to create app support directory, will not store indexed entities.");
                ARIndexedEntities = nil;
            }
        });
    }
}

+ (BOOL)isSpotlightAvailable;
{
    return ARSpotlightAvailable;
}

+ (NSURL *)webpageURLForEntity:(id<ARSpotlightMetadataProvider>)entity;
{
    return [[ARRouter baseWebURL] URLByAppendingPathComponent:entity.publicArtsyPath];
}

+ (void)disableIndexing;
{
    dispatch_sync(ARSpotlightQueue, ^{
        ARSearchableIndex = nil;
        ARIndexedEntities = nil;
        ARIndexedEntitiesFile = nil;
    });
}

+ (CSSearchableIndex *)searchableIndex;
{
    return ARSearchableIndex;
}

+ (NSMutableSet *)indexedEntities;
{
    return ARIndexedEntities;
}

+ (void)indexAllUsersFavorites;
{
    if (!ARSpotlightAvailable) {
        return;
    }

    // Disable eager decompression of images. With the amount we end up downloading, eager loading
    // takes a whole lot of memory.
    //
    // TODO As this globally disables it, we should look at if this can be improved upon.
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    manager.imageCache.shouldDecompressImages = NO;
    manager.imageDownloader.shouldDecompressImages = NO;

    NSMutableArray *networkModels = [NSMutableArray new];
    [networkModels addObject:[ARArtworkFavoritesNetworkModel new]];
    [networkModels addObject:[ARArtistFavoritesNetworkModel new]];
    [networkModels addObject:[ARGeneFavoritesNetworkModel new]];

    // Remove entities from this list that are still favorites, by the end that leaves a list of entities that need to
    // be purged from the local index.
    NSMutableSet *previouslyIndexed = [self.indexedEntities mutableCopy];

    UIApplication *application = [UIApplication sharedApplication];
    __block UIBackgroundTaskIdentifier backgroundTask = UIBackgroundTaskInvalid;

    dispatch_block_t finalizeBlock = ^{
#ifdef DEBUG
        if (application.applicationState == UIApplicationStateBackground) {
            NSLog(@"Remaining allowed background time by task finalizing: %f", application.backgroundTimeRemaining);
        }
#endif
        [application endBackgroundTask:backgroundTask];
        backgroundTask = UIBackgroundTaskInvalid;
    };
    backgroundTask = [application beginBackgroundTaskWithExpirationHandler:finalizeBlock];

    // Kick-off
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        [self indexFavoritesPass:networkModels
               previouslyIndexed:previouslyIndexed
                   finalizeBlock:finalizeBlock];
    });
}

+ (void)indexFavoritesPass:(NSMutableArray *)networkModels
         previouslyIndexed:(NSMutableSet *)previouslyIndexed
             finalizeBlock:(dispatch_block_t)finalizeBlock;
{
    ARFavoritesNetworkModel *networkModel = [networkModels firstObject];
    [networkModel getFavorites:^(NSArray *entities) {
        ar_dispatch_on_queue(ARSpotlightQueue, ^{
            for (id<ARSpotlightMetadataProvider> entity in entities) {
                [self addEntityToSpotlightIndex:entity];
                [previouslyIndexed removeObject:[self webpageURLForEntity:entity]];
            }
            if (networkModel.allDownloaded) {
                [networkModels removeObject:networkModel];
            }
            if (networkModels.count == 0) {
                ARActionLog(@"Finished fetching all favorites.");
                if (previouslyIndexed.count > 0) {
                    for (NSString *identifier in previouslyIndexed.allObjects) {
                        [self removeEntityByIdentifierFromSpotlightIndex:identifier];
                    }
                }
                finalizeBlock();
            } else {
                // Recursively call
                ar_dispatch_on_queue(ARSpotlightQueue, ^{
                    [self indexFavoritesPass:networkModels
                           previouslyIndexed:previouslyIndexed
                               finalizeBlock:finalizeBlock];
                });
            }
        });
    }
        failure:^(NSError *error) {
        ARErrorLog(@"Failed to fetch favorites, cancelling: %@", error);
        finalizeBlock();
        }];
}

#pragma mark - CSSearchableIndex

+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id<ARSpotlightMetadataProvider>)entity;
{
    if (!ARSpotlightAvailable) {
        return;
    }
    addOrRemove ? [self addEntityToSpotlightIndex:entity] : [self removeEntityFromSpotlightIndex:entity];
}

+ (void)addEntityToSpotlightIndex:(id<ARSpotlightMetadataProvider>)entity;
{
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        [self searchAttributesForEntity:entity includeIdentifier:YES completion:^(CSSearchableItemAttributeSet *attributeSet) {
            NSString *domainIdentifier = nil;
            if ([entity isKindOfClass:Artwork.class]) {
                domainIdentifier = ARUserActivityTypeArtwork;
            } else if ([entity isKindOfClass:Artist.class]) {
                domainIdentifier = ARUserActivityTypeArtist;
            } else if ([entity isKindOfClass:Gene.class]) {
                domainIdentifier = ARUserActivityTypeGene;
            }
            NSString *identifier = attributeSet.relatedUniqueIdentifier;
            CSSearchableItem *item = [[CSSearchableItem alloc] initWithUniqueIdentifier:identifier
                                                                       domainIdentifier:domainIdentifier
                                                                           attributeSet:attributeSet];
            [self.searchableIndex indexSearchableItems:@[item] completionHandler:^(NSError *error) {
                if (error) {
                    ARErrorLog(@"Failed to index entity `%@': %@", identifier, error);
                } else {
                    ar_dispatch_on_queue(ARSpotlightQueue, ^{
                        [self.indexedEntities addObject:identifier];
                        [self.indexedEntities.allObjects writeToFile:ARIndexedEntitiesFile atomically:YES];
                        ARActionLog(@"Indexed entity `%@'", identifier);
                    });
                }
            }];
        }];
    });
}

+ (void)removeEntityFromSpotlightIndex:(id<ARSpotlightMetadataProvider>)entity;
{
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        [self removeEntityByIdentifierFromSpotlightIndex:[self webpageURLForEntity:entity].absoluteString];
    });
}

+ (void)removeEntityByIdentifierFromSpotlightIndex:(NSString *)identifier;
{
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        [self.searchableIndex deleteSearchableItemsWithIdentifiers:@[identifier]
                                              completionHandler:^(NSError *error) {
            if (error) {
                ARErrorLog(@"Failed to remove `%@' from index: %@", identifier, error);
            } else {
                ar_dispatch_on_queue(ARSpotlightQueue, ^{
                    [self.indexedEntities removeObject:identifier];
                    [self.indexedEntities.allObjects writeToFile:ARIndexedEntitiesFile atomically:YES];
                    ARActionLog(@"Removed from index: %@", identifier);
                });
            }
        }];
    });
}

#pragma mark - CSSearchableItemAttributeSet

//
// Do NOT modify any of the returned CSSearchableItemAttributeSet objects on another queue than ARSpotlightQueue.
//

+ (CSSearchableItemAttributeSet *)searchAttributesForEntity:(id<ARSpotlightMetadataProvider>)entity
                                          includeIdentifier:(BOOL)includeIdentifier
                                                 completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];

    attributeSet.title = entity.name;

    NSString *description = entity.spotlightDescription;
    if (description) {
        attributeSet.contentDescription = description;
    } else if ([entity respondsToSelector:@selector(spotlightMarkdownDescription)]) {
        description = entity.spotlightMarkdownDescription;
        if (description) {
            attributeSet.contentDescription = ARStringByStrippingMarkdown(description);
        }
    }

    if (includeIdentifier) {
        attributeSet.relatedUniqueIdentifier = [self webpageURLForEntity:entity].absoluteString;
    }
    if ([entity respondsToSelector:@selector(startDate)]) {
        attributeSet.startDate = entity.startDate;
    }
    if ([entity respondsToSelector:@selector(endDate)]) {
        attributeSet.endDate = entity.endDate;
    }

    NSURL *thumbnailURL = entity.spotlightThumbnailURL;
    if (thumbnailURL) {
        SDWebImageManager *manager = [SDWebImageManager sharedManager];
        [manager downloadImageWithURL:thumbnailURL
                              options:0
                             progress:nil
                            completed:^(UIImage *image, NSError *_, SDImageCacheType __, BOOL ____, NSURL *_____) {
            if (image) {
                // Instead of dumping the image back to data, just have Spotlight load it from disk.
                // This will save us a lot of memory.
                NSString *cacheKey = [manager cacheKeyForURL:thumbnailURL];
                // Need to use the block variant, to ensure that the cache has saved the file yet.
                [manager.imageCache diskImageExistsWithKey:cacheKey completion:^(BOOL isInCache) {
                    ar_dispatch_on_queue(ARSpotlightQueue, ^{
                        if (isInCache) {
                            NSString *cachePath = [manager.imageCache defaultCachePathForKey:cacheKey];
                            attributeSet.thumbnailURL = [NSURL fileURLWithPath:cachePath];
                        } else {
                            // Cache miss, for some reason.
                            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
                        }
                        completion(attributeSet);
                    });
                }];
            } else {
                ar_dispatch_on_queue(ARSpotlightQueue, ^{
                    completion(attributeSet);
                });
            }
                            }];
    }

    return attributeSet;
}

@end


@implementation ARFairSpotlightMetadataProvider

- (instancetype)initWithFair:(Fair *)fair profile:(Profile *)profile;
{
    NSParameterAssert(fair);
    _fair = fair;
    _profile = profile;
    return self;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector
{
    return [self.fair methodSignatureForSelector:selector];
}

- (void)forwardInvocation:(NSInvocation *)invocation
{
    invocation.target = self.fair;
    [invocation invoke];
}

- (NSString *)spotlightDescription;
{
    return self.fair.location ? self.fair.location : @"Art fair on Artsy";
}

- (NSURL *)spotlightThumbnailURL;
{
    return self.profile ? [NSURL URLWithString:self.profile.iconURL] : nil;
}

@end
