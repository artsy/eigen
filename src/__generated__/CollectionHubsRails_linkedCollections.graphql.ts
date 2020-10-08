/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type CollectionHubsRails_linkedCollections = ReadonlyArray<{
    readonly groupType: MarketingGroupTypes;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup" | "OtherCollectionsRail_collectionGroup" | "FeaturedCollectionsRail_collectionGroup">;
    readonly " $refType": "CollectionHubsRails_linkedCollections";
}>;
export type CollectionHubsRails_linkedCollections$data = CollectionHubsRails_linkedCollections;
export type CollectionHubsRails_linkedCollections$key = ReadonlyArray<{
    readonly " $data"?: CollectionHubsRails_linkedCollections$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHubsRails_linkedCollections">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "CollectionHubsRails_linkedCollections",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "groupType",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionArtistSeriesRail_collectionGroup"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OtherCollectionsRail_collectionGroup"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeaturedCollectionsRail_collectionGroup"
    }
  ],
  "type": "MarketingCollectionGroup",
  "abstractKey": null
};
(node as any).hash = 'b1abf030c950a4118c69eb2c9e5e5175';
export default node;
