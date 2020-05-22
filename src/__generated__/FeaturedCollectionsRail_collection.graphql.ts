/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedCollectionsRail_collection = {
    readonly slug: string;
    readonly id: string;
    readonly " $refType": "FeaturedCollectionsRail_collection";
};
export type FeaturedCollectionsRail_collection$data = FeaturedCollectionsRail_collection;
export type FeaturedCollectionsRail_collection$key = {
    readonly " $data"?: FeaturedCollectionsRail_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"FeaturedCollectionsRail_collection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeaturedCollectionsRail_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b3b81460378ae369b7fc090f6e961471';
export default node;
