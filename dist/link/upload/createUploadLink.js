import { __assign, __rest } from "tslib";
import { ApolloLink, checkFetcher, fallbackHttpConfig, fromError, Observable, selectURI, } from "@apollo/client";
import { createSignalIfSupported } from "../http/createSignalIfSupported";
import { parseAndCheckHttpResponse } from "../http/parseAndCheckHttpResponse";
import { rewriteURIForGET } from "../http/rewriteURIForGET";
import { selectHttpOptionsAndBody } from "../http/selectHttpOptionsAndBody";
import { serializeFetchParameter } from "../http/serializeFetchParameter";
var _a = require("extract-files"), extractFiles = _a.extractFiles, isExtractableFile = _a.isExtractableFile;
function formDataAppendFile(formData, fieldName, file) {
    formData.append(fieldName, file, file.name);
}
export var createUploadLink = function (linkOptions) {
    if (linkOptions === void 0) { linkOptions = {}; }
    var _a = linkOptions.uri, uri = _a === void 0 ? "/graphql" : _a, fetcher = linkOptions.fetch, includeExtensions = linkOptions.includeExtensions, useGETForQueries = linkOptions.useGETForQueries, _b = linkOptions.isExtractableFile, customIsExtractableFile = _b === void 0 ? isExtractableFile : _b, _c = linkOptions.formDataAppendFile, customFormDataAppendFile = _c === void 0 ? formDataAppendFile : _c, requestOptions = __rest(linkOptions, ["uri", "fetch", "includeExtensions", "useGETForQueries", "isExtractableFile", "formDataAppendFile"]);
    checkFetcher(fetcher);
    if (!fetcher) {
        fetcher = fetch;
    }
    var linkConfig = {
        http: { includeExtensions: includeExtensions },
        options: requestOptions.fetchOptions,
        credentials: requestOptions.credentials,
        headers: requestOptions.headers,
    };
    return new ApolloLink(function (operation) {
        var chosenURI = selectURI(operation, uri);
        var context = operation.getContext();
        var clientAwarenessHeaders = {};
        if (context.clientAwareness) {
            var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
            if (name_1) {
                clientAwarenessHeaders["apollographql-client-name"] = name_1;
            }
            if (version) {
                clientAwarenessHeaders["apollographql-client-version"] = version;
            }
        }
        var contextHeaders = __assign(__assign({}, clientAwarenessHeaders), context.headers);
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: contextHeaders,
        };
        var _b = selectHttpOptionsAndBody(operation, fallbackHttpConfig, linkConfig, contextConfig), options = _b.options, body = _b.body;
        var _c = extractFiles(body, "", customIsExtractableFile), clone = _c.clone, files = _c.files;
        var payload = serializeFetchParameter(clone, "Payload");
        var controller;
        if (!options.signal) {
            var _d = createSignalIfSupported(), _controller = _d.controller, signal = _d.signal;
            controller = _controller;
            if (controller)
                options.signal = signal;
        }
        var definitionIsMutation = function (d) {
            return d.kind === "OperationDefinition" && d.operation === "mutation";
        };
        if (useGETForQueries &&
            !operation.query.definitions.some(definitionIsMutation)) {
            options.method = "GET";
        }
        if (options.method === "GET") {
            var _e = rewriteURIForGET(chosenURI, body), newURI = _e.newURI, parseError = _e.parseError;
            if (parseError) {
                return fromError(parseError);
            }
            chosenURI = newURI;
        }
        else if (files.size) {
            delete options.headers["content-type"];
            var form_1 = new FormData();
            form_1.append("operations", payload);
            var map_1 = {};
            var i_1 = 0;
            files.forEach(function (paths) {
                map_1[++i_1] = paths;
            });
            form_1.append("map", JSON.stringify(map_1));
            i_1 = 0;
            files.forEach(function (paths, file) {
                customFormDataAppendFile(form_1, ++i_1, file);
            });
            options.body = form_1;
        }
        else {
            try {
                options.body = serializeFetchParameter(body, "Payload");
            }
            catch (parseError) {
                return fromError(parseError);
            }
        }
        return new Observable(function (observer) {
            fetcher(chosenURI, options)
                .then(function (response) {
                operation.setContext({ response: response });
                return response;
            })
                .then(parseAndCheckHttpResponse(operation))
                .then(function (result) {
                observer.next(result);
                observer.complete();
                return result;
            })
                .catch(function (err) {
                if (err.name === "AbortError")
                    return;
                if (err.result && err.result.errors && err.result.data) {
                    observer.next(err.result);
                }
                observer.error(err);
            });
            return function () {
                if (controller)
                    controller.abort();
            };
        });
    });
};
//# sourceMappingURL=createUploadLink.js.map