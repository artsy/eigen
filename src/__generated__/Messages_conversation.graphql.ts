/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Messages_conversation = {
    readonly __id: string;
    readonly id: string | null;
    readonly from: {
        readonly name: string;
        readonly email: string;
        readonly initials: string | null;
    };
    readonly to: {
        readonly name: string;
        readonly initials: string | null;
    };
    readonly initial_message: string;
    readonly messages: ({
        readonly pageInfo: {
            readonly startCursor: string | null;
            readonly endCursor: string | null;
            readonly hasPreviousPage: boolean;
            readonly hasNextPage: boolean;
        };
        readonly edges: ReadonlyArray<({
                readonly cursor: string;
                readonly node: ({
                    readonly __id: string;
                    readonly impulse_id: string;
                    readonly is_from_user: boolean | null;
                    readonly body: string | null;
                    readonly attachments: ReadonlyArray<({
                            readonly id: string;
                        }) | null> | null;
                }) | null;
            }) | null> | null;
    }) | null;
    readonly items: ReadonlyArray<({
            readonly artwork: ({
                readonly href?: string | null;
            }) | null;
            readonly show: ({
                readonly href?: string | null;
            }) | null;
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Messages_conversation",
  "type": "Conversation",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "after",
        "direction": "forward",
        "path": [
          "messages"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "after",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    v0,
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "from",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationInitiator",
      "plural": false,
      "selections": [
        v2,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "email",
          "args": null,
          "storageKey": null
        },
        v3
      ]
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
        v2,
        v3
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "initial_message",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "messages",
      "name": "__Messages_messages_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "MessageConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pageInfo",
          "storageKey": null,
          "args": null,
          "concreteType": "PageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "startCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasPreviousPage",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "MessageEdge",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Message",
              "plural": false,
              "selections": [
                v0,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "impulse_id",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "is_from_user",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "body",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "attachments",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Attachment",
                  "plural": true,
                  "selections": [
                    v1
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Message_message",
                  "args": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
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
          "alias": "artwork",
          "name": "item",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            v0,
            {
              "kind": "InlineFragment",
              "type": "Artwork",
              "selections": [
                v4,
                {
                  "kind": "FragmentSpread",
                  "name": "ArtworkPreview_artwork",
                  "args": null
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": "show",
          "name": "item",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            v0,
            {
              "kind": "InlineFragment",
              "type": "Show",
              "selections": [
                v4,
                {
                  "kind": "FragmentSpread",
                  "name": "ShowPreview_show",
                  "args": null
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
(node as any).hash = '943535ecfc6ac6a8a0561ac1e6bdf065';
export default node;
