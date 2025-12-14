/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("address");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@aws-sdk/s3-request-presigner");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(2));
const address_1 = __webpack_require__(3);
const client_s3_1 = __webpack_require__(4);
__webpack_require__(5);
const s3_request_presigner_1 = __webpack_require__(6);
const port = process.env.PORT || 5001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/healthz', (req, res) => {
    res.send({
        message: `Server IP address: ${(0, address_1.ip)()}, Server port: ${port}`,
    });
});
function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}
function createS3Client() {
    const region = getRequiredEnv('AWS_REGION');
    const accessKeyId = getRequiredEnv('AWS_ACCESS_KEY_ID');
    const secretAccessKey = getRequiredEnv('AWS_SECRET_ACCESS_KEY');
    return new client_s3_1.S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
    });
}
app.get('/', async (_, res) => {
    const s3 = createS3Client();
    const bucketName = getRequiredEnv('AWS_BUCKET_NAME');
    const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: 'mohi.jpg',
    }), {
        expiresIn: 10,
    });
    res.send({
        presignedUrl,
    });
});
// Returns a presigned URL you can PUT to from Postman (no file bytes sent to this server).
const uploadUrlHandler = async (req, res) => {
    const generatedName = Math.random().toString(36).substring(2, 15);
    const name = `${generatedName}.jpg`;
    const key = `${Date.now()}-${name}`;
    const s3 = createS3Client();
    const bucketName = getRequiredEnv('AWS_BUCKET_NAME');
    const expiresInSeconds = 60;
    const requiredHeaders = {};
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: 'image/jpg',
    }), { expiresIn: expiresInSeconds });
    res.send({
        key,
        uploadUrl,
        method: 'PUT',
        requiredHeaders,
        expiresInSeconds,
    });
};
// Keep POST / for convenience; /upload-url is an alias.
app.post('/', uploadUrlHandler);
app.post('/upload-url', uploadUrlHandler);
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

})();

/******/ })()
;