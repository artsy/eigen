/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
export type ContextCard_artwork$data = ContextCard_artwork;
export type ContextCard_artwork$key = {
    readonly " $data"?: ContextCard_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ContextCard_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ContextCard_artwork",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "context",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isLiveOpen",
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "formattedStartDateTime",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAuction",
              "storageKey": null
            },
            (v4/*: any*/)
          ],
          "type": "Sale",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Image",
              "kind": "LinkedField",
              "name": "image",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            }
          ],
          "type": "Fair",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "internalID",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
            },
            (v1/*: any*/),
            (v2/*: any*/),
            (v5/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isFollowed",
              "storageKey": null
            },
            (v4/*: any*/)
          ],
          "type": "Show",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = 'a9ece62ccaacd7f6ed0daafc8355fd91';
export default node;
