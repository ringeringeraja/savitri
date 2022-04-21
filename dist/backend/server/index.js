"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const Hapi = __importStar(require("@hapi/hapi"));
require("../../common/src/polyfill");
const controller_1 = require("../core/controller");
const token_svc_1 = require("../core/services/token.svc");
const file_controller_1 = require("../modules/file/file.controller");
async function handler(request, h) {
    try {
        const { params: { controller, verb } } = request;
        if (/^_/.test(verb)) {
            throw new Error('cannot call private method');
        }
        const Controller = (0, controller_1.getController)(controller);
        const instance = new Controller;
        if (!(verb in instance)) {
            throw new Error('invalid verb');
        }
        const token = request.headers.authorization
            ? token_svc_1.TokenService.decode(request.headers.authorization.split('Bearer ').pop() || '')
            : {};
        // use webinterface whenever it's available
        const result = await (instance.webInterface || instance)[verb](request, h, token);
        if (/_?get$/i.test(verb) && Object.keys(result).length === 0) {
            throw new Error('item not found');
        }
        const mime = instance.rawType(verb);
        if (mime) {
            return h.response(result)
                .header('Content-Type', mime);
        }
        const limit = request.payload.limit
            ? +request.payload.limit
            : +(process.env.PAGINATION_LIMIT || 35);
        return {
            result,
            ...(Array.isArray(result) ? {
                recordsCount: result.length,
                recordsTotal: typeof instance.count === 'function' ? await instance.count({ filters: request.payload?.filters || {} }) : result.length,
                offset: request.payload?.offset || 0,
                // 35 is a fallback
                limit,
            } : {})
        };
    }
    catch (error) {
        console.trace(error);
        const { message } = error;
        return {
            message,
            _error: error
        };
    }
    finally {
        //
    }
}
const init = async (port = 3000) => {
    const server = Hapi.server({
        port,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                headers: [
                    'Accept',
                    'Accept-Version',
                    'Authorization',
                    'Content-Length',
                    'Content-MD5',
                    'Content-Type',
                    'Date',
                    'X-Api-Version'
                ]
            }
        }
    });
    server.route({
        method: ['GET', 'POST'],
        path: '/api/{controller}/{verb}',
        handler
    });
    server.route({
        method: ['GET'],
        path: '/api/file/{hash}/{options?}',
        handler: async (request, h) => {
            try {
                const instance = new file_controller_1.FileController;
                const { hash, options } = request.params;
                const { filename, content, mime } = await instance.download(hash);
                const parsedOptions = (options || '').split(',');
                const has = (opt) => parsedOptions.includes(opt);
                return h.response(content)
                    .header('Content-Type', mime)
                    .header('Content-Disposition', `${has('download') ? 'attachment; ' : ''}filename=${filename}`);
            }
            catch (error) {
                console.trace(error);
                const { message } = error;
                return {
                    message,
                    _error: error
                };
            }
        }
    });
    return server;
};
exports.init = init;
//# sourceMappingURL=index.js.map