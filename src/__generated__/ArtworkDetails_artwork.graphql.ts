/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ArtworkDetails_artwork = {
    readonly slug: string;
    readonly category: string | null;
    readonly conditionDescription: {
        readonly label: string | null;
        readonly details: string | null;
    } | null;
    readonly signatureInfo: {
        readonly label: string | null;
        readonly details: string | null;
    } | null;
    readonly certificateOfAuthenticity: {
        readonly label: string | null;
        readonly details: string | null;
    } | null;
    readonly framed: {
        readonly label: string | null;
        readonly details: string | null;
    } | null;
    readonly series: string | null;
    readonly publisher: string | null;
    readonly manufacturer: string | null;
    readonly image_rights: string | null;
    readonly canRequestLotConditionsReport: boolean | null;
    readonly " $refType": "ArtworkDetails_artwork";
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "label",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "details",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ArtworkDetails_artwork",
  "type": "Artwork",
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
      "name": "category",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "conditionDescription",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "signatureInfo",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "certificateOfAuthenticity",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "framed",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtworkInfoRow",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "series",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "publisher",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "manufacturer",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "image_rights",
      "name": "imageRights",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "canRequestLotConditionsReport",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = '3cc0f87b9e60b49ae31967b73aa43cd2';
export default node;
