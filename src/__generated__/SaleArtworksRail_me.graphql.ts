/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworksRail_me = {
    readonly saleArtworksRail: {
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
  "kind": "Fragment",
  "name": "SaleArtworksRail_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "saleArtworksRail",
      "name": "lotsByFollowedArtistsConnection",
      "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)",
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
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
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
                  "name": "id",
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "saleArtwork",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "SaleArtwork",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "FragmentSpread",
                      "name": "SaleArtworkTileRailCard_saleArtwork",
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
(node as any).hash = '0801f696db61489d8e728a88edb2a242';
export default node;
