import { ApolloLink, HttpOptions, RequestHandler } from "@apollo/client";
export declare class UploadLink extends ApolloLink {
    options: HttpOptions;
    requester: RequestHandler;
    constructor(options?: HttpOptions);
}
//# sourceMappingURL=UploadLink.d.ts.map