/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBids_me = {
    readonly myBids: {
        readonly active: ReadonlyArray<{
            readonly sale: {
                readonly internalID: string;
                readonly registrationStatus: {
                    readonly qualifiedForBidding: boolean | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale" | "LotStatusListItem_sale">;
            } | null;
            readonly saleArtworks: ReadonlyArray<{
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_saleArtwork">;
            } | null> | null;
        } | null> | null;
        readonly closed: ReadonlyArray<{
            readonly sale: {
                readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale" | "LotStatusListItem_sale">;
            } | null;
            readonly saleArtworks: ReadonlyArray<{
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_saleArtwork">;
            } | null> | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"SaleCard_me">;
    readonly " $refType": "MyBids_me";
};
export type MyBids_me$data = MyBids_me;
export type MyBids_me$key = {
    readonly " $data"?: MyBids_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "SaleCard_sale"
},
v2 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "LotStatusListItem_sale"
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtwork",
  "kind": "LinkedField",
  "name": "saleArtworks",
  "plural": true,
  "selections": [
    (v0/*: any*/),
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LotStatusListItem_saleArtwork"
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyBids_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "MyBids",
      "kind": "LinkedField",
      "name": "myBids",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MyBid",
          "kind": "LinkedField",
          "name": "active",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Sale",
              "kind": "LinkedField",
              "name": "sale",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Bidder",
                  "kind": "LinkedField",
                  "name": "registrationStatus",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "qualifiedForBidding",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                (v1/*: any*/),
                (v2/*: any*/)
              ],
              "storageKey": null
            },
            (v3/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "MyBid",
          "kind": "LinkedField",
          "name": "closed",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Sale",
              "kind": "LinkedField",
              "name": "sale",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                (v2/*: any*/)
              ],
              "storageKey": null
            },
            (v3/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleCard_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = 'd422640170f3a5de3ff954d65737df14';
export default node;
