#import "ARDefaults+SiteFeatures.h"

#import "SiteFeature.h"


@implementation ARDefaults (SiteFeatures)

+ (void)setOnboardingDefaults:(NSArray *)features
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSArray *booleans = @[
        AROnboardingSkipPersonalizeDefault,
        AROnboardingSkipCollectorLevelDefault,
        AROnboardingSkipPriceRangeDefault,
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


@end
