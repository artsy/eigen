#import "ARSpotlight.h"
#import "ARUserActivity.h"
#import "ARRouter.h"
#import "ARFileUtils.h"

#import "ARArtworkFavoritesNetworkModel.h"
#import "ARGeneFavoritesNetworkModel.h"
#import "ARArtistFavoritesNetworkModel.h"

#import "NSDate+DateRange.h"

@import CoreSpotlight;
@import MMMarkdown;
@import SDWebImage;


static BOOL ARSpotlightAvailable = NO;
static dispatch_queue_t ARSpotlightQueue = nil;
static NSMutableSet *ARIndexedEntities = nil;
static NSString *ARIndexedEntitiesFile = nil;
static CSSearchableIndex *ARSearchableIndex = nil;


static void
ARSearchAttributesAddThumbnailData(CSSearchableItemAttributeSet *attributeSet,
                                   NSURL *thumbnailURL,
                                   ARSearchAttributesCompletionBlock completion)
{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    [manager downloadImageWithURL:thumbnailURL
                          options:0
                         progress:nil
                        completed:^(UIImage *image, NSError *_, SDImageCacheType __, BOOL ____, NSURL *_____) {
        ar_dispatch_on_queue(ARSpotlightQueue, ^{
            if (image) {
                attributeSet.thumbnailData = UIImagePNGRepresentation(image);
            }
            completion(attributeSet);
        });
    }];
}

static NSString *
ARUniqueIdentifierForEntity(id entity)
{
    NSString *baseURL = [[ARRouter baseDesktopWebURL] absoluteString];
    if ([entity isKindOfClass:Fair.class]) {
        return [NSString stringWithFormat:@"%@/%@", baseURL, [entity fairID]];
    } else {
        return [baseURL stringByAppendingString:[entity performSelector:@selector(publicArtsyPath)]];
    }
}

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

+ (NSURL *)webpageURLForEntity:(id)entity;
{
    return [NSURL URLWithString:ARUniqueIdentifierForEntity(entity)];
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
            for (id entity in entities) {
                [self addEntityToSpotlightIndex:entity];
                [previouslyIndexed removeObject:ARUniqueIdentifierForEntity(entity)];
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

+ (void)addToSpotlightIndex:(BOOL)addOrRemove entity:(id)entity;
{
    if (!ARSpotlightAvailable) {
        return;
    }
    addOrRemove ? [self addEntityToSpotlightIndex:entity] : [self removeEntityFromSpotlightIndex:entity];
}

+ (void)addEntityToSpotlightIndex:(id)entity;
{
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        [self searchAttributesWithEntity:entity completion:^(CSSearchableItemAttributeSet *attributeSet) {
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

// Only the entities that don’t require a second model to build the search attributes are currently supported.
// This excludes Fair and Show models.
+ (void)searchAttributesWithEntity:(id)entity completion:(ARSearchAttributesCompletionBlock)completion;
{
    if ([entity isKindOfClass:Artwork.class]) {
        [self searchAttributesWithArtwork:entity includeIdentifier:YES completion:completion];
    } else if ([entity isKindOfClass:Artist.class]) {
        [self searchAttributesWithArtist:entity includeIdentifier: YES completion:completion];
    } else if ([entity isKindOfClass:Gene.class]) {
        [self searchAttributesWithGene:entity includeIdentifier:YES completion:completion];
    } else {
        NSAssert(NO, @"Unsupported entity type: %@", entity);
    }
}

+ (void)removeEntityFromSpotlightIndex:(id)entity;
{
    ar_dispatch_on_queue(ARSpotlightQueue, ^{
        NSString *identifier = ARUniqueIdentifierForEntity(entity);
        [self removeEntityByIdentifierFromSpotlightIndex:identifier];
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

+ (CSSearchableItemAttributeSet *)searchAttributesWithArtwork:(Artwork *)artwork
                                            includeIdentifier:(BOOL)includeIdentifier
                                                   completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artwork);
    attributeSet.title = artwork.title;

    if (artwork.date.length > 0) {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
    } else {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artwork.defaultImage.urlForThumbnailImage, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithArtist:(Artist *)artist
                                           includeIdentifier:(BOOL)includeIdentifier
                                                  completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(artist);
    attributeSet.title = artist.name;

    if (artist.blurb.length > 0) {
        attributeSet.contentDescription = ARStringByStrippingMarkdown(artist.blurb);
    } else {
        attributeSet.contentDescription = artist.birthday;
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artist.squareImageURL, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithGene:(Gene *)gene
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(gene);
    attributeSet.title = gene.name;

    if (gene.geneDescription.length > 0) {
        attributeSet.contentDescription = ARStringByStrippingMarkdown(gene.geneDescription);
    } else {
        attributeSet.contentDescription = @"Category on Artsy";
    }

    ARSearchAttributesAddThumbnailData(attributeSet, gene.smallImageURL, completion);

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithFair:(Fair *)fair
                                               withProfile:(Profile *)fairProfile
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(fair);
    attributeSet.title = fair.name;
    attributeSet.startDate = fair.startDate;
    attributeSet.endDate = fair.endDate;

    if (fair.location) {
        attributeSet.contentDescription = fair.location;
    } else {
        attributeSet.contentDescription = @"Art fair on Artsy";
    }

    if (fairProfile) {
        ARSearchAttributesAddThumbnailData(attributeSet, [NSURL URLWithString:fairProfile.iconURL], completion);
    } else {
        completion(attributeSet);
    }

    return attributeSet;
}

+ (CSSearchableItemAttributeSet *)searchAttributesWithShow:(PartnerShow *)show
                                                    inFair:(Fair *)fair
                                         includeIdentifier:(BOOL)includeIdentifier
                                                completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    if (includeIdentifier) attributeSet.relatedUniqueIdentifier = ARUniqueIdentifierForEntity(show);
    attributeSet.title = show.name;

    NSString *location;
    if (fair && fair.location) {
        location = fair.location;
    } else {
        location = [NSString stringWithFormat:@"%@, %@ %@", show.location.city, show.location.state, show.location.country];
    }
    NSString *dates = [show.startDate ausstellungsdauerToDate:show.endDate];
    attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@\n%@", show.partner.name, location, dates];
    attributeSet.startDate = show.startDate;
    attributeSet.endDate = show.endDate;

    ARSearchAttributesAddThumbnailData(attributeSet, show.smallPreviewImageURL, completion);

    return attributeSet;
}

@end

