/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ArtworksPreview_fair$ref: unique symbol;
export type ArtworksPreview_fair$ref = typeof _ArtworksPreview_fair$ref;
export type ArtworksPreview_fair = {
    readonly slug: string;
    readonly id: string;
    readonly filterArtworksConnection: {
        readonly counts: {
            readonly total: any | null;
        } | null;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": GenericGrid_artworks$ref;
            } | null;
        } | null> | null;
    } | null;
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
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filterArtworksConnection",
      "storageKey": "filterArtworksConnection(aggregations:[\"TOTAL\"],first:6)",
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "TOTAL"
          ]
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 6
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
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
        },
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
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '6963d5e69b61da0d5471d321ce3e16fb';
export default node;
