import express from 'express';
import { ip } from 'address';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import 'dotenv/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.send({
    message: `Server IP address: ${ip()}, Server port: ${port}`,
  });
});

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function createS3Client(): S3Client {
  const region = getRequiredEnv('AWS_REGION');
  const accessKeyId = getRequiredEnv('AWS_ACCESS_KEY_ID');
  const secretAccessKey = getRequiredEnv('AWS_SECRET_ACCESS_KEY');
  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

app.get('/', async (_: express.Request, res: express.Response) => {
  const s3 = createS3Client();
  const bucketName = getRequiredEnv('AWS_BUCKET_NAME');

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: 'mohi.jpg',
    }),
    {
      expiresIn: 10,
    }
  );

  res.send({
    presignedUrl,
  });
});

// Returns a presigned URL you can PUT to from Postman (no file bytes sent to this server).
const uploadUrlHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const generatedName = Math.random().toString(36).substring(2, 15);
  const name = `${generatedName}.jpg`;
  const key = `${Date.now()}-${name}`;

  const s3 = createS3Client();
  const bucketName = getRequiredEnv('AWS_BUCKET_NAME');

  const expiresInSeconds = 60;
  const requiredHeaders: Record<string, string> = {};

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: 'image/jpg',
    }),
    { expiresIn: expiresInSeconds }
  );

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
