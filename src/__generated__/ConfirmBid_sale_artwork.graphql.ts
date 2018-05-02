/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ConfirmBid_sale_artwork = {
    readonly artwork: ({
        readonly title: string | null;
        readonly date: string | null;
        readonly artist_names: string | null;
    }) | null;
    readonly lot_label: string | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ConfirmBid_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artwork",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": false,
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
          "name": "date",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artist_names",
          "args": null,
          "storageKey": null
        },
        v0
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lot_label",
      "args": null,
      "storageKey": null
    },
    v0
  ]
};
})();
(node as any).hash = '6eef32e224b2213ed8012c151c7dc02b';
export default node;
