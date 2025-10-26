"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_WebsocketsChannel = void 0;
const a_utils_1 = require("@adaas/a-utils");
class A_WebsocketsChannel extends a_utils_1.A_Channel {
    // Websockets specific implementations would go here
    request(params) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.A_WebsocketsChannel = A_WebsocketsChannel;
//# sourceMappingURL=A-Websockets.channel.js.map