/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkRail_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly results: ReadonlyArray<{
        readonly href: string | null;
        readonly saleMessage: string | null;
        readonly artistNames: string | null;
        readonly sale: {
            readonly isAuction: boolean | null;
            readonly isClosed: boolean | null;
            readonly displayTimelyAt: string | null;
        } | null;
        readonly saleArtwork: {
            readonly currentBid: {
                readonly display: string | null;
            } | null;
        } | null;
        readonly image: {
            readonly imageURL: string | null;
        } | null;
    } | null> | null;
    readonly context: {
        readonly __typename: "HomePageRelatedArtistArtworkModule";
        readonly artist?: {
            readonly slug: string;
            readonly internalID: string;
            readonly href: string | null;
        } | null;
        readonly basedOn?: {
            readonly name: string | null;
        } | null;
        readonly href?: string | null;
    } | null;
    readonly " $refType": "ArtworkRail_rail";
};
export type ArtworkRail_rail$data = ArtworkRail_rail;
export type ArtworkRail_rail$key = {
    readonly " $data"?: ArtworkRail_rail$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ArtworkRail_rail",
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
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "saleMessage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artistNames",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "sale",
          "storageKey": null,
          "args": null,
          "concreteType": "Sale",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isAuction",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isClosed",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "displayTimelyAt",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "saleArtwork",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "currentBid",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkCurrentBid",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "display",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "imageURL",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "HomePageRelatedArtistArtworkModule",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "__typename",
              "args": null,
              "storageKey": null
            },
            {
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
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                },
                (v0/*: any*/)
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "basedOn",
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
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageFollowedArtistArtworkModule",
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "artist",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": (v1/*: any*/)
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Fair",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Gene",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Sale",
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'addc5228e81c68835c22410f861941ce';
export default node;
