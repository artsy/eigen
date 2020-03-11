/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ConversationSnippet_conversation = {
    readonly internalID: string | null;
    readonly to: {
        readonly name: string;
    };
    readonly lastMessage: string | null;
    readonly lastMessageAt: string | null;
    readonly unread: boolean | null;
    readonly items: ReadonlyArray<{
        readonly item: ({
            readonly __typename: "Artwork";
            readonly date: string | null;
            readonly title: string | null;
            readonly artistNames: string | null;
            readonly image: {
                readonly url: string | null;
            } | null;
        } | {
            readonly __typename: "Show";
            readonly fair: {
                readonly name: string | null;
            } | null;
            readonly name: string | null;
            readonly coverImage: {
                readonly url: string | null;
            } | null;
        } | {
            /*This will never be '%other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        }) | null;
    } | null> | null;
    readonly " $refType": "ConversationSnippet_conversation";
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
],
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ConversationSnippet_conversation",
  "type": "Conversation",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "to",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationResponder",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastMessageAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "unread",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "items",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationItem",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "item",
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
              "type": "Artwork",
              "selections": [
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
                  "name": "title",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "artistNames",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": (v2/*: any*/)
                }
              ]
            },
            {
              "kind": "InlineFragment",
              "type": "Show",
              "selections": [
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
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "coverImage",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": (v2/*: any*/)
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '51a731d89429f7b46a9000aed66aec62';
export default node;
