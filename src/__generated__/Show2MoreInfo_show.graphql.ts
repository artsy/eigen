/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2MoreInfo_show = {
    readonly href: string | null;
    readonly about: string | null;
    readonly pressRelease: string | null;
    readonly partner: {
        readonly __typename: string;
    } | null;
    readonly fair: {
        readonly location: {
            readonly __typename: string;
        } | null;
    } | null;
    readonly location: {
        readonly __typename: string;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Show2Location_show">;
    readonly " $refType": "Show2MoreInfo_show";
};
export type Show2MoreInfo_show$data = Show2MoreInfo_show;
export type Show2MoreInfo_show$key = {
    readonly " $data"?: Show2MoreInfo_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2MoreInfo_show">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  }
],
v1 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": (v0/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2MoreInfo_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": "about",
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MARKDOWN"
        }
      ],
      "kind": "ScalarField",
      "name": "pressRelease",
      "storageKey": "pressRelease(format:\"MARKDOWN\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Fair",
      "kind": "LinkedField",
      "name": "fair",
      "plural": false,
      "selections": [
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Location_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '87b5a7404dc16395475d0f2a5a98b7f6';
export default node;
