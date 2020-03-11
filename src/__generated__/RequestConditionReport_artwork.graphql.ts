/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type RequestConditionReport_artwork = {
    readonly internalID: string;
    readonly slug: string;
    readonly saleArtwork: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "RequestConditionReport_artwork";
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "RequestConditionReport_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
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
        (v0/*: any*/)
      ]
    }
  ]
};
})();
(node as any).hash = 'e20d4fa964b57dd0a75664fa56741ed4';
export default node;
