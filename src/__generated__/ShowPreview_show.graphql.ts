/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ShowPreview_show$ref: unique symbol;
export type ShowPreview_show$ref = typeof _ShowPreview_show$ref;
export type ShowPreview_show = {
    readonly gravityID: string;
    readonly internalID: string;
    readonly name: string | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly fair: {
        readonly name: string | null;
    } | null;
    readonly partner: ({
        readonly name?: string | null;
    } & ({
        readonly name: string | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly " $refType": ShowPreview_show$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ShowPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
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
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cover_image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fair",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '7ddf8e573ed5f7defd16d05487df0d4a';
export default node;
