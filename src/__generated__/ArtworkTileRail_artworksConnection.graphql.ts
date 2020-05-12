/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkTileRail_artworksConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly slug: string;
            readonly internalID: string;
            readonly href: string | null;
            readonly artistNames: string | null;
            readonly image: {
                readonly imageURL: string | null;
            } | null;
            readonly saleMessage: string | null;
        } | null;
    } | null> | null;
    readonly " $refType": "ArtworkTileRail_artworksConnection";
};
export type ArtworkTileRail_artworksConnection$data = ArtworkTileRail_artworksConnection;
export type ArtworkTileRail_artworksConnection$key = {
    readonly " $data"?: ArtworkTileRail_artworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkTileRail_artworksConnection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkTileRail_artworksConnection",
  "type": "ArtworkConnection",
  "metadata": null,
  "argumentDefinitions": [],
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
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
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
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "saleMessage",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '8e817d114e27d6cc5f4df4790d88d310';
export default node;
