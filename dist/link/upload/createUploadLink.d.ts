import { ApolloLink, HttpOptions } from "@apollo/client";
export declare type UploadOptions = {
    isExtractableFile?: (value: any) => boolean;
    formDataAppendFile?: (formData: FormData, fieldName: any, file: any) => void;
} & HttpOptions;
export declare const createUploadLink: (linkOptions?: UploadOptions) => ApolloLink;
//# sourceMappingURL=createUploadLink.d.ts.map