/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworksRail_me = {
    readonly lotsByFollowedArtistsConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly href: string | null;
                readonly saleArtwork: {
                    readonly " $fragmentRefs": FragmentRefs<"SaleArtworkTileRailCard_saleArtwork">;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "SaleArtworksRail_me";
};
export type SaleArtworksRail_me$data = SaleArtworksRail_me;
export type SaleArtworksRail_me$key = {
    readonly " $data"?: SaleArtworksRail_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleArtworksRail_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        },
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
        }
      ],
      "concreteType": "SaleArtworksConnection",
      "kind": "LinkedField",
      "name": "lotsByFollowedArtistsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtwork",
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
                  "name": "id",
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
                  "concreteType": "SaleArtwork",
                  "kind": "LinkedField",
                  "name": "saleArtwork",
                  "plural": false,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "SaleArtworkTileRailCard_saleArtwork"
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '016b519193aa19423f21302ae4173927';
export default node;
