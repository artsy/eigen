/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ContextCard_artwork = {
    readonly id: string;
    readonly context: ({
        readonly __typename: "Sale";
        readonly id: string;
        readonly name: string | null;
        readonly isLiveOpen: boolean | null;
        readonly href: string | null;
        readonly formattedStartDateTime: string | null;
        readonly isAuction: boolean | null;
        readonly coverImage: {
            readonly url: string | null;
        } | null;
    } | {
        readonly __typename: "Fair";
        readonly id: string;
        readonly name: string | null;
        readonly href: string | null;
        readonly exhibitionPeriod: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | {
        readonly __typename: "Show";
        readonly id: string;
        readonly internalID: string;
        readonly slug: string;
        readonly name: string | null;
        readonly href: string | null;
        readonly exhibitionPeriod: string | null;
        readonly isFollowed: boolean | null;
        readonly coverImage: {
            readonly url: string | null;
        } | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly " $refType": "ContextCard_artwork";
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v3/*: any*/)
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ContextCard_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "type": "Sale",
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isLiveOpen",
              "args": null,
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "formattedStartDateTime",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isAuction",
              "args": null,
              "storageKey": null
            },
            (v4/*: any*/)
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Fair",
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            (v5/*: any*/),
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "image",
              "storageKey": null,
              "args": null,
              "concreteType": "Image",
              "plural": false,
              "selections": (v3/*: any*/)
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Show",
          "selections": [
            (v0/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "internalID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "slug",
              "args": null,
              "storageKey": null
            },
            (v1/*: any*/),
            (v2/*: any*/),
            (v5/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isFollowed",
              "args": null,
              "storageKey": null
            },
            (v4/*: any*/)
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'a9ece62ccaacd7f6ed0daafc8355fd91';
export default node;
