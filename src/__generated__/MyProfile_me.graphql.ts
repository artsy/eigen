/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfile_me = {
    readonly name: string | null;
    readonly auctionsLotStandingConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly saleArtwork: {
                    readonly sale: {
                        readonly status: string | null;
                    } | null;
                } | null;
            };
        } | null> | null;
    };
    readonly followsAndSaves: {
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly " $fragmentRefs": FragmentRefs<"SmallTileRail_artworks">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "MyProfile_me";
};
export type MyProfile_me$data = MyProfile_me;
export type MyProfile_me$key = {
    readonly " $data"?: MyProfile_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfile_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyProfile_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "auctionsLotStandingConnection",
      "storageKey": "auctionsLotStandingConnection(first:25)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 25
        }
      ],
      "concreteType": "AuctionsLotStandingConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "AuctionsLotStandingEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "AuctionsLotStanding",
              "plural": false,
              "selections": [
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
                      "name": "sale",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Sale",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "status",
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
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "followsAndSaves",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:10,private:true)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 10
            },
            {
              "kind": "Literal",
              "name": "private",
              "value": true
            }
          ],
          "concreteType": "SavedArtworksConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "SavedArtworksEdge",
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
                      "kind": "FragmentSpread",
                      "name": "SmallTileRail_artworks",
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
(node as any).hash = '2fc2f67bff0f4b8d637c6c768edebe52';
export default node;
