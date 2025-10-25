"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.A_CommandController = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Router_component_1 = require("../A-Router/A-Router.component");
const A_Request_entity_1 = require("../../entities/A-Request/A-Request.entity");
const A_Response_entity_1 = require("../../entities/A-Response/A-Response.entity");
class A_CommandController extends a_concept_1.A_Component {
    handleCommand(req, res, scope, container) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandName = req.params.command;
            const CommandConstructor = scope.resolveConstructor(commandName);
            if (!CommandConstructor) {
                res.status(404);
                throw new Error(`Command ${commandName} not found`);
            }
            const command = new CommandConstructor(req.body);
            container.scope.register(command);
            console.log(`1) Executing command: ${commandName}`);
            yield command.execute();
            const serialized = command.toJSON();
            return res.status(200).json(serialized);
        });
    }
}
exports.A_CommandController = A_CommandController;
__decorate([
    A_Router_component_1.A_Router.Get({
        path: "/:command/execute",
        version: "v1",
        prefix: "a-command"
    }),
    __param(0, (0, a_concept_1.A_Inject)(A_Request_entity_1.A_Request)),
    __param(1, (0, a_concept_1.A_Inject)(A_Response_entity_1.A_Response)),
    __param(2, (0, a_concept_1.A_Inject)(a_concept_1.A_Scope)),
    __param(3, (0, a_concept_1.A_Inject)(a_concept_1.A_Container))
], A_CommandController.prototype, "handleCommand", null);
//# sourceMappingURL=A-CommandController.component.js.map