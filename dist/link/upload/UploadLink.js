import { __extends } from "tslib";
import { ApolloLink } from "@apollo/client";
import { createUploadLink } from "./createUploadLink";
var UploadLink = (function (_super) {
    __extends(UploadLink, _super);
    function UploadLink(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, createUploadLink(options).request) || this;
        _this.options = options;
        return _this;
    }
    return UploadLink;
}(ApolloLink));
export { UploadLink };
//# sourceMappingURL=UploadLink.js.map