declare const A_RequestFeatures: {
    readonly onError: "A_Request_onError";
    readonly onInit: "A_Request_onInit";
    readonly onAfterInit: "A_Request_onAfterInit";
    readonly onParse: "A_Request_onParse";
    readonly onValidate: "A_Request_onValidate";
    readonly onClose: "A_Request_onClose";
    readonly onAborted: "A_Request_onAborted";
    readonly onTimeout: "A_Request_onTimeout";
    readonly onData: "A_Request_onData";
    readonly onEnd: "A_Request_onEnd";
    readonly onBodyParse: "A_Request_onBodyParse";
    readonly onQueryParse: "A_Request_onQueryParse";
    readonly onParamsParse: "A_Request_onParamsParse";
    readonly onCookiesParse: "A_Request_onCookiesParse";
};

export { A_RequestFeatures };
