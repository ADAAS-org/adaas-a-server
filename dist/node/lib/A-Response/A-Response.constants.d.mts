declare const A_ResponseFeatures: {
    /**
     * Event fired when an error occurs while sending the response
     */
    readonly onError: "_A_Response_onError";
    /**
     * Event fired when the response is closed
     */
    readonly onClose: "_A_Response_onClose";
    /**
     * Event fired when the response is finished
     */
    readonly onFinish: "_A_Response_onFinish";
    /**
     * Event fired when the response is sent
     */
    readonly onSend: "_A_Response_onSend";
    /**
     * Event fired when the response is redirected
     */
    readonly onRedirect: "_A_Response_onRedirect";
};

export { A_ResponseFeatures };
