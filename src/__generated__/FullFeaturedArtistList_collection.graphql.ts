/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FullFeaturedArtistList_collection = {
    readonly artworksConnection: {
        readonly merchandisableArtists: ReadonlyArray<{
            readonly internalID: string;
            readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
        } | null> | null;
    } | null;
    readonly query: {
        readonly artistIDs: ReadonlyArray<string> | null;
    };
    readonly featuredArtistExclusionIds: ReadonlyArray<string> | null;
    readonly " $refType": "FullFeaturedArtistList_collection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FullFeaturedArtistList_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "screenWidth",
      "type": "Int",
      "defaultValue": 500
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworksConnection",
      "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")",
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "MERCHANDISABLE_ARTISTS"
          ]
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 0
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "-decayed_merch"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "merchandisableArtists",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "internalID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "ArtistListItem_artist",
              "args": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "query",
      "storageKey": null,
      "args": null,
      "concreteType": "MarketingCollectionQuery",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artistIDs",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "featuredArtistExclusionIds",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '65e7cd642c93df5819954a6ff0c68fdd';
export default node;
