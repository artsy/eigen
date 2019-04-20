/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ArtworksPreview_fair$ref: unique symbol;
export type ArtworksPreview_fair$ref = typeof _ArtworksPreview_fair$ref;
export type ArtworksPreview_fair = {
    readonly gravityID: string;
    readonly __id: string;
    readonly filteredArtworks: ({
        readonly artworks_connection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly " $fragmentRefs": GenericGrid_artworks$ref;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly counts: ({
            readonly total: any | null;
        }) | null;
    }) | null;
    readonly " $refType": ArtworksPreview_fair$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworksPreview_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filteredArtworks",
      "storageKey": "filteredArtworks(aggregations:[\"TOTAL\"],size:0)",
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "TOTAL"
          ],
          "type": "[ArtworkAggregation]"
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 0,
          "type": "Int"
        }
      ],
      "concreteType": "FilterArtworks",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworks_connection",
          "storageKey": "artworks_connection(first:6)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 6,
              "type": "Int"
            }
          ],
          "concreteType": "ArtworkConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "ArtworkEdge",
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
                      "kind": "FragmentSpread",
                      "name": "GenericGrid_artworks",
                      "args": null
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "counts",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksCounts",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "total",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'ad33a2a10fad882cb690e5aecf14aa3e';
export default node;
