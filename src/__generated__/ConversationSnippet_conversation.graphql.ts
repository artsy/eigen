/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ConversationSnippet_conversation$ref: unique symbol;
export type ConversationSnippet_conversation$ref = typeof _ConversationSnippet_conversation$ref;
export type ConversationSnippet_conversation = {
    readonly id: string | null;
    readonly to: {
        readonly name: string;
    };
    readonly last_message: string | null;
    readonly last_message_at: string | null;
    readonly unread: boolean | null;
    readonly items: ReadonlyArray<({
        readonly item: ({
            readonly __typename: "Artwork";
            readonly date: string | null;
            readonly title: string | null;
            readonly artist_names: string | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        } | {
            readonly __typename: "Show";
            readonly fair: ({
                readonly name: string | null;
            }) | null;
            readonly name: string | null;
            readonly cover_image: ({
                readonly url: string | null;
            }) | null;
        } | {
            /*This will never be '% other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        }) | null;
    }) | null> | null;
    readonly " $refType": ConversationSnippet_conversation$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
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
      "name": "id",
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
      "selections": [
        v0
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "last_message",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "last_message_at",
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
            v1,
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
                  "selections": [
                    v0,
                    v1
                  ]
                },
                v0,
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "cover_image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": v2
                }
              ]
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
                  "name": "artist_names",
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
                  "selections": v2
                }
              ]
            }
          ]
        }
      ]
    },
    v1
  ]
};
})();
(node as any).hash = 'cbb14f6e62aa56f7c8e18f2ef16e8662';
export default node;
