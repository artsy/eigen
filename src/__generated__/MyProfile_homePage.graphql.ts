/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfile_homePage = {
    readonly artworkModules: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
    readonly " $refType": "MyProfile_homePage";
};
export type MyProfile_homePage$data = MyProfile_homePage;
export type MyProfile_homePage$key = {
    readonly " $data"?: MyProfile_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfile_homePage">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyProfile_homePage",
  "type": "HomePage",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworkModules",
      "storageKey": "artworkModules(exclude:[\"ACTIVE_BIDS\",\"CURRENT_FAIRS\",\"FOLLOWED_ARTIST\",\"FOLLOWED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"FOLLOWED_GENES\",\"GENERIC_GENES\",\"LIVE_AUCTIONS\",\"POPULAR_ARTISTS\",\"RECENTLY_VIEWED_WORKS\",\"RECOMMENDED_WORKS\",\"RELATED_ARTISTS\",\"SIMILAR_TO_RECENTLY_VIEWED\"],maxRails:1,order:[\"SAVED_WORKS\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
            "ACTIVE_BIDS",
            "CURRENT_FAIRS",
            "FOLLOWED_ARTIST",
            "FOLLOWED_ARTISTS",
            "FOLLOWED_GALLERIES",
            "FOLLOWED_GENES",
            "GENERIC_GENES",
            "LIVE_AUCTIONS",
            "POPULAR_ARTISTS",
            "RECENTLY_VIEWED_WORKS",
            "RECOMMENDED_WORKS",
            "RELATED_ARTISTS",
            "SIMILAR_TO_RECENTLY_VIEWED"
          ]
        },
        {
          "kind": "Literal",
          "name": "maxRails",
          "value": 1
        },
        {
          "kind": "Literal",
          "name": "order",
          "value": [
            "SAVED_WORKS"
          ]
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ArtworkRail_rail",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '2adad1233b4e3145bf85e2f1ad51984a';
export default node;
