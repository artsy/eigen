/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Messages_conversation = {
    readonly id: string;
    readonly internalID: string | null;
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
    readonly lastMessageID: string | null;
    readonly messagesConnection: {
        readonly pageInfo: {
            readonly startCursor: string | null;
            readonly endCursor: string | null;
            readonly hasPreviousPage: boolean;
            readonly hasNextPage: boolean;
        };
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly id: string;
                readonly internalID: string;
                readonly impulseID: string;
                readonly isFromUser: boolean | null;
                readonly isFirstMessage: boolean | null;
                readonly body: string | null;
                readonly createdAt: string | null;
                readonly attachments: ReadonlyArray<{
                    readonly id: string;
                    readonly internalID: string;
                    readonly contentType: string;
                    readonly downloadURL: string;
                    readonly fileName: string;
                    readonly " $fragmentRefs": FragmentRefs<"ImagePreview_attachment" | "PDFPreview_attachment" | "FileDownload_attachment">;
                } | null> | null;
                readonly " $fragmentRefs": FragmentRefs<"Message_message">;
            } | null;
        } | null> | null;
    } | null;
    readonly items: ReadonlyArray<{
        readonly item: ({
            readonly __typename: "Artwork";
            readonly href: string | null;
            readonly " $fragmentRefs": FragmentRefs<"ArtworkPreview_artwork">;
        } | {
            readonly __typename: "Show";
            readonly href: string | null;
            readonly " $fragmentRefs": FragmentRefs<"ShowPreview_show">;
        } | {
            /*This will never be '%other', but we need some
            value in case none of the concrete values match.*/
            readonly __typename: "%other";
        }) | null;
    } | null> | null;
    readonly " $refType": "Messages_conversation";
};
export type Messages_conversation$data = Messages_conversation;
export type Messages_conversation$key = {
    readonly " $data"?: Messages_conversation$data;
    readonly " $fragmentRefs": FragmentRefs<"Messages_conversation">;
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
  "name": "internalID",
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
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v5 = {
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
          "messagesConnection"
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
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "from",
      "storageKey": null,
      "args": null,
      "concreteType": "ConversationInitiator",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "email",
          "args": null,
          "storageKey": null
        },
        (v3/*: any*/)
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
        (v2/*: any*/),
        (v3/*: any*/)
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "initial_message",
      "name": "initialMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastMessageID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "messagesConnection",
      "name": "__Messages_messagesConnection_connection",
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
                (v0/*: any*/),
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "impulseID",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isFromUser",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isFirstMessage",
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
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "createdAt",
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
                    (v0/*: any*/),
                    (v1/*: any*/),
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "contentType",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "downloadURL",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "fileName",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "FragmentSpread",
                      "name": "ImagePreview_attachment",
                      "args": null
                    },
                    {
                      "kind": "FragmentSpread",
                      "name": "PDFPreview_attachment",
                      "args": null
                    },
                    {
                      "kind": "FragmentSpread",
                      "name": "FileDownload_attachment",
                      "args": null
                    }
                  ]
                },
                (v4/*: any*/),
                {
                  "kind": "FragmentSpread",
                  "name": "Message_message",
                  "args": null
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
          "alias": null,
          "name": "item",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            (v4/*: any*/),
            {
              "kind": "InlineFragment",
              "type": "Artwork",
              "selections": [
                (v5/*: any*/),
                {
                  "kind": "FragmentSpread",
                  "name": "ArtworkPreview_artwork",
                  "args": null
                }
              ]
            },
            {
              "kind": "InlineFragment",
              "type": "Show",
              "selections": [
                (v5/*: any*/),
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
(node as any).hash = '870cb86d888163a47e31ed64728d5a9b';
export default node;
