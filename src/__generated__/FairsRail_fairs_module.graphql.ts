/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairsRail_fairs_module$ref: unique symbol;
export type FairsRail_fairs_module$ref = typeof _FairsRail_fairs_module$ref;
export type FairsRail_fairs_module = {
    readonly results: ReadonlyArray<{
        readonly internalID: string;
        readonly slug: string;
        readonly name: string | null;
        readonly profile: {
            readonly slug: string;
        } | null;
        readonly mobile_image: {
            readonly internalID: string | null;
            readonly url: string | null;
        } | null;
    } | null>;
    readonly " $refType": FairsRail_fairs_module$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairsRail_fairs_module",
  "type": "HomePageFairsModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
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
          "name": "profile",
          "storageKey": null,
          "args": null,
          "concreteType": "Profile",
          "plural": false,
          "selections": [
            (v1/*: any*/)
          ]
        },
        {
          "kind": "LinkedField",
          "alias": "mobile_image",
          "name": "mobileImage",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '47b9c72152ab4ed347d6f3a19e5b16b3';
export default node;
