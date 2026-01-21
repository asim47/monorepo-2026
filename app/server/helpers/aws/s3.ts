import {
  PutObjectAclCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../../utils/logger';
import { env } from '../../utils/env';

// Initialize S3 client
const getS3Client = (): S3Client => {
  return new S3Client({
    region: env.AWS.REGION,
    credentials: {
      accessKeyId: env.AWS.ACCESS_KEY_ID,
      secretAccessKey: env.AWS.SECRET_ACCESS_KEY,
    },
  });
};

export async function uploadFileToS3(file: Buffer, name: string, path = ''): Promise<string> {
  logger.info('uploadFileToS3', { name, path });
  const fileName = `${path}${Date.now()}-${name.replace(/ /g, '_')}`;

  const uploadParams: PutObjectCommandInput = {
    Bucket: env.AWS.BUCKET_NAME,
    Body: file,
    Key: fileName,
    ACL: 'public-read',
  };

  const s3 = getS3Client();
  await s3.send(new PutObjectCommand(uploadParams));

  const fileUrl = `${env.AWS.CLOUDFRONT_DOMAIN}/${fileName}`;

  return fileUrl;
}

export async function makeFilePublic(key: string): Promise<void> {
  logger.info('makeFilePublic', { key });

  const s3 = getS3Client();
  await s3.send(
    new PutObjectAclCommand({
      Bucket: env.AWS.BUCKET_NAME,
      Key: key,
      ACL: 'public-read',
    }),
  );
}

export async function generatePresignedPutUrl(
  fileName: string,
  path = '',
  expiresInSeconds = 1800,
  mimeType?: string,
): Promise<{ signedUrl: string; key: string; publicUrl: string }> {
  const objectKey = `${path ? path + '/' : ''}dwg-files/${Date.now()}-${fileName.replace(/ /g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS.BUCKET_NAME,
    Key: objectKey,
    ContentType: mimeType ?? 'application/octet-stream',
    ACL: 'public-read',
  });

  const s3 = getS3Client();
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: expiresInSeconds,
  });

  const publicUrl = `https://${env.AWS.BUCKET_NAME}.s3.${env.AWS.REGION}.amazonaws.com/${objectKey}`;

  return { signedUrl, key: objectKey, publicUrl };
}
