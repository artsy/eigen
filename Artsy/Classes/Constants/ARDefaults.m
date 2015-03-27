const static NSInteger AROnboardingPromptDefault = 25;

NSString *const ARUserIdentifierDefault = @"ARUserIdentifier";
NSString *const ARUseStagingDefault = @"ARUseStagingDefault";

NSString *const AROAuthTokenDefault = @"AROAuthToken";
NSString *const AROAuthTokenExpiryDateDefault = @"AROAuthTokenExpiryDate";

NSString *const ARXAppTokenDefault = @"ARXAppTokenDefault";
NSString *const ARXAppTokenExpiryDateDefault = @"ARXAppTokenExpiryDateDefault";

NSString *const ARHasSubmittedDeviceTokenDefault = @"ARHasSubmittedFullDeviceToken";

NSString *const AROnboardingSkipPersonalizeDefault = @"eigen-onboard-skip-personalize";
NSString *const AROnboardingSkipCollectorLevelDefault = @"eigen-onboard-skip-collector-level";
NSString *const AROnboardingSkipPriceRangeDefault = @"eigen-onboard-skip-price-range";
NSString *const AROnboardingPromptThresholdDefault = @"eigen-onboard-prompt-threshold";
NSString *const ARShowAuctionResultsButtonDefault = @"auction-results";

@implementation ARDefaults

+ (void)setOnboardingDefaults:(NSArray *)features
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *booleans = @[
        AROnboardingSkipPersonalizeDefault,
        AROnboardingSkipCollectorLevelDefault,
        AROnboardingSkipPriceRangeDefault,
        ARShowAuctionResultsButtonDefault
    ];


    for (SiteFeature *feature in features) {
        if ([booleans containsObject:feature.siteFeatureID]) {
            [defaults setObject:feature.enabled forKey:feature.siteFeatureID];
        } else if ([feature.siteFeatureID isEqualToString:AROnboardingPromptThresholdDefault]) {
            NSNumber *count = [defaults valueForKey:AROnboardingPromptThresholdDefault];
            if (count) {
                // we don't wanna reset this
                continue;
            }
            NSArray *counts = feature.parameters[@"counts"];
            if (!counts) {
                count = feature.parameters[@"count"];
            } else {
                // Very poor man's A/B testing: assign one of the possibilities at random
                count = counts[arc4random_uniform((unsigned int)counts.count)];
            }
            if (count && ([count integerValue] > 0)) {
                [defaults setObject:count forKey:AROnboardingPromptThresholdDefault];
            }
        }
    }
    [defaults synchronize];
}

+ (void)setup
{
    BOOL useStagingDefault;
#if DEBUG
    useStagingDefault = YES;
#else
    useStagingDefault = NO;
#endif

    [[NSUserDefaults standardUserDefaults] registerDefaults:@{
        ARUseStagingDefault: @(useStagingDefault),
        AROnboardingPromptThresholdDefault: @(AROnboardingPromptDefault),
        AROnboardingSkipPersonalizeDefault: @(NO),
        AROnboardingSkipCollectorLevelDefault: @(NO),
        AROnboardingSkipPriceRangeDefault: @(NO),
        AROnboardingPromptThresholdDefault: @(NO)
        }
     ];
}

+ (void)resetDefaults
{
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
