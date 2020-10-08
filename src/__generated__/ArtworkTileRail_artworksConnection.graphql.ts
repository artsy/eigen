/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkTileRail_artworksConnection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Artwork",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "internalID",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "href",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistNames",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Image",
              "kind": "LinkedField",
              "name": "image",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "imageURL",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "saleMessage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ArtworkConnection",
  "abstractKey": null
};
(node as any).hash = '8e817d114e27d6cc5f4df4790d88d310';
export default node;
