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

module.exports = require("@aws-sdk/lib-storage");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("multer");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 8 */
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
const lib_storage_1 = __webpack_require__(5);
const multer_1 = tslib_1.__importDefault(__webpack_require__(6));
__webpack_require__(7);
const s3_request_presigner_1 = __webpack_require__(8);
const port = process.env.PORT || 5001;
const app = (0, express_1.default)();
// Configure multer for memory storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.get('/healthz', (req, res) => {
    res.send({
        message: `Server IP address: ${(0, address_1.ip)()}, Server port: ${port}`,
    });
});
app.get('/', async (req, res) => {
    const value = 'mohi-cartoon.jpeg-1762702280690.jpeg';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
        return res.status(500).send({
            message: 'AWS credentials not configured',
        });
    }
    const s3 = new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: value,
    }));
    res.send({
        key: value,
        presignedUrl,
    });
});
app.post('/', upload.single('file'), async (req, res) => {
    // upload a file to s3
    const file = req.file;
    if (!file) {
        return res.status(400).send({
            message: 'No file uploaded',
        });
    }
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!accessKeyId || !secretAccessKey) {
        return res.status(500).send({
            message: 'AWS credentials not configured',
        });
    }
    if (!region || !bucketName) {
        return res.status(500).send({
            message: 'AWS region or bucket name not configured',
        });
    }
    const s3 = new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    const Key = `${file.originalname}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    const s3Upload = new lib_storage_1.Upload({
        client: s3,
        params: {
            Bucket: bucketName,
            Key: Key,
            Body: file.buffer,
        },
    });
    // store in you db
    await s3Upload.done();
    // generate presigned url for the file
    const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3, new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: Key,
    }));
    return res.send({
        message: 'file uploaded successfully',
        presignedUrl,
    });
});
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

})();

/******/ })()
;