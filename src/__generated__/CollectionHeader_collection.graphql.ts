/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type CollectionHeader_collection = {
    readonly title: string;
    readonly description: string | null;
    readonly headerImage: string | null;
    readonly image: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly imageUrl: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "CollectionHeader_collection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionHeader_collection",
  "type": "MarketingCollection",
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
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "headerImage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "image",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:1,sort:\"-merchandisability\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "-merchandisability"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "imageUrl",
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
(node as any).hash = '63e09d0916f91e7fcb2631c7194e36c3';
export default node;
