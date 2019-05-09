/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkCarouselHeader_rail$ref: unique symbol;
export type ArtworkCarouselHeader_rail$ref = typeof _ArtworkCarouselHeader_rail$ref;
export type ArtworkCarouselHeader_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly followedArtistContext: ({
        readonly artist?: ({
            readonly internalID: string;
            readonly gravityID: string;
        }) | null;
    }) | null;
    readonly relatedArtistContext: ({
        readonly artist?: ({
            readonly internalID: string;
            readonly gravityID: string;
        }) | null;
        readonly based_on?: ({
            readonly name: string | null;
        }) | null;
    }) | null;
    readonly " $refType": ArtworkCarouselHeader_rail$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "artist",
  "storageKey": null,
  "args": null,
  "concreteType": "Artist",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Fragment",
  "name": "ArtworkCarouselHeader_rail",
  "type": "HomePageArtworkModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "key",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "followedArtistContext",
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFollowedArtist",
          "selections": [
            (v0/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "relatedArtistContext",
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextRelatedArtist",
          "selections": [
            (v0/*: any*/),
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "based_on",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'f9f8ed70e15feeab8e14270b8390a7e8';
export default node;
