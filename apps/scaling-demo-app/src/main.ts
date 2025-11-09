import express from 'express';
import { ip } from 'address';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import 'dotenv/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const port = process.env.PORT;
const app = express();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.get('/healthz', (req, res) => {
  res.send({
    message: `Server IP address: ${ip()}, Server port: ${port}`,
  });
});

app.post(
  '/',
  upload.single('file'),
  async (req: express.Request, res: express.Response) => {
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

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const Key = `${file.originalname}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    const s3Upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: Key,
        Body: file.buffer,
      },
    });

    await s3Upload.done();

    // generate presigned url for the file
    const presignedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: Key,
      })
    );

    return res.send({
      message: 'file uploaded successfully',
      presignedUrl,
    });
  }
);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
