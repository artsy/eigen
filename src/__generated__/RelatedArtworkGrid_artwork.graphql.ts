/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _RelatedArtworkGrid_artwork$ref: unique symbol;
export type RelatedArtworkGrid_artwork$ref = typeof _RelatedArtworkGrid_artwork$ref;
export type RelatedArtworkGrid_artwork = {
    readonly layer: {
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly " $fragmentRefs": GenericGrid_artworks$ref;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": RelatedArtworkGrid_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "RelatedArtworkGrid_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "layer",
      "storageKey": "layer(id:\"main\")",
      "args": [
        {
          "kind": "Literal",
          "name": "id",
          "value": "main"
        }
      ],
      "concreteType": "ArtworkLayer",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:8)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 8
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
        }
      ]
    }
  ]
};
(node as any).hash = 'c475f3918f9c142f73b3dc33d99efec6';
export default node;
