/* tslint:disable */
/* eslint-disable */
/* @relayHash b9b5ff80e176ec36e537a002f170ae14 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AttachmentListTestsQueryVariables = {
    conversationID: string;
};
export type AttachmentListTestsQueryResponse = {
    readonly me: {
        readonly conversation: {
            readonly messagesConnection: {
                readonly " $fragmentRefs": FragmentRefs<"AttachmentList_messageConnection">;
            } | null;
        } | null;
    } | null;
};
export type AttachmentListTestsQuery = {
    readonly response: AttachmentListTestsQueryResponse;
    readonly variables: AttachmentListTestsQueryVariables;
};



/*
query AttachmentListTestsQuery(
  $conversationID: String!
) {
  me {
    conversation(id: $conversationID) {
      messagesConnection {
        ...AttachmentList_messageConnection
      }
      id
    }
    id
  }
}

fragment AttachmentList_messageConnection on MessageConnection {
  edges {
    node {
      attachments {
        id
        contentType
        ...FileDownload_attachment
      }
      id
    }
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "conversationID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "conversationID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v4 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v5 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AttachmentListTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messagesConnection",
                "storageKey": null,
                "args": null,
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "AttachmentList_messageConnection",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AttachmentListTestsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messagesConnection",
                "storageKey": null,
                "args": null,
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
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
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Message",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "attachments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
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
                                "name": "fileName",
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
                                "name": "internalID",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v2/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AttachmentListTestsQuery",
    "id": "c4f53e092695f765844a139ba6108e92",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "type": "Me",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation": {
          "type": "Conversation",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.id": (v3/*: any*/),
        "me.conversation.messagesConnection": {
          "type": "MessageConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.id": (v3/*: any*/),
        "me.conversation.messagesConnection.edges": {
          "type": "MessageEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.messagesConnection.edges.node": {
          "type": "Message",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.conversation.messagesConnection.edges.node.attachments": {
          "type": "Attachment",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.conversation.messagesConnection.edges.node.id": (v3/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.id": (v4/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.contentType": (v5/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.fileName": (v5/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.downloadURL": (v5/*: any*/),
        "me.conversation.messagesConnection.edges.node.attachments.internalID": (v4/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'df2087084bfde01bc2a587e3e9ae6526';
export default node;
