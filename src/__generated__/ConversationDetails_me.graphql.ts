/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationDetails_me = {
    readonly conversation: {
        readonly internalID: string | null;
        readonly id: string;
        readonly to: {
            readonly name: string;
            readonly initials: string | null;
        };
        readonly from: {
            readonly email: string;
        };
        readonly messagesConnection: {
            readonly edges: ReadonlyArray<{
                readonly __typename: string;
            } | null> | null;
            readonly " $fragmentRefs": FragmentRefs<"AttachmentList_messageConnection">;
        } | null;
        readonly items: ReadonlyArray<{
            readonly item: {
                readonly __typename: string;
                readonly href?: string | null;
                readonly " $fragmentRefs": FragmentRefs<"ItemInfo_item">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ConversationDetails_me";
};
export type ConversationDetails_me$data = ConversationDetails_me;
export type ConversationDetails_me$key = {
    readonly " $data"?: ConversationDetails_me$data;
    readonly " $fragmentRefs": FragmentRefs<"ConversationDetails_me">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "href",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "conversationID"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "conversation",
          "messagesConnection"
        ]
      }
    ]
  },
  "name": "ConversationDetails_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "conversationID"
        }
      ],
      "concreteType": "Conversation",
      "kind": "LinkedField",
      "name": "conversation",
      "plural": false,
      "selections": [
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
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationResponder",
          "kind": "LinkedField",
          "name": "to",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "initials",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationInitiator",
          "kind": "LinkedField",
          "name": "from",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "email",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": "messagesConnection",
          "args": null,
          "concreteType": "MessageConnection",
          "kind": "LinkedField",
          "name": "__Details_messagesConnection_connection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "MessageEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cursor",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Message",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PageInfo",
              "kind": "LinkedField",
              "name": "pageInfo",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "endCursor",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "hasNextPage",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "AttachmentList_messageConnection"
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationItem",
          "kind": "LinkedField",
          "name": "items",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "item",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "InlineFragment",
                  "selections": (v1/*: any*/),
                  "type": "Artwork",
                  "abstractKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": (v1/*: any*/),
                  "type": "Show",
                  "abstractKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ItemInfo_item"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = '5ca4875e2e7827adf182f3dc7170f151';
export default node;
