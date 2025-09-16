import * as path from 'path';

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

import { Readable } from 'stream';

interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  s3Bucket: string;
  s3Region: string;
  cloudfrontUrl: string;
}

interface UploadResult {
  url: string;
  key: string;
  size: number;
  type: string;
  thumbnail?: string;
}

interface EthiopianOptimization {
  enableCDN: boolean;
  enableCompression: boolean;
  enableThumbnail: boolean;
  maxThumbnailWidth: number;
  maxThumbnailHeight: number;
}

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
  stream?: Readable;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly s3: AWS.S3;
  private readonly uploadConfig: UploadConfig;
  private readonly ethiopianOptimization: EthiopianOptimization;

  constructor() {
    this.uploadConfig = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      s3Bucket: process.env.AWS_S3_BUCKET || 'stan-store-uploads',
      s3Region: process.env.AWS_REGION || 'af-south-1', // Cape Town region for Ethiopian users
      cloudfrontUrl: process.env.AWS_CLOUDFRONT_URL || '',
    };

    this.ethiopianOptimization = {
      enableCDN: true,
      enableCompression: true,
      enableThumbnail: true,
      maxThumbnailWidth: 300,
      maxThumbnailHeight: 300,
    };

    // Configure AWS S3 with Ethiopian regional settings
    AWS.config.update({
      region: this.uploadConfig.s3Region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.s3 = new AWS.S3({
      // Ethiopian network optimization settings
      httpOptions: {
        timeout: 30000, // 30 seconds for Ethiopian connectivity
        connectTimeout: 5000,
      },
    });
  }

  async uploadFile(
    file: UploadedFile,
    options: {
      userId: string;
      folder?: string;
      generateThumbnail?: boolean;
      compression?: boolean;
    }
  ): Promise<UploadResult> {
    try {
      this.logger.log(`Starting upload for user: ${options.userId}, file: ${file.originalname}`);

      // Validate file
      this.validateFile(file);

      // Generate unique filename with Ethiopian optimization
      const fileId = uuidv4();
      const extension = path.extname(file.originalname).toLowerCase();
      const folder = options.folder || 'general';
      const key = `uploads/${options.userId}/${folder}/${fileId}${extension}`;

      let processedBuffer = file.buffer;
      let thumbnailUrl: string | undefined;

      // Ethiopian-specific optimizations
      if (options.compression !== false && this.ethiopianOptimization.enableCompression) {
        processedBuffer = await this.compressImage(file.buffer, file.mimetype);
      }

      if (
        options.generateThumbnail !== false &&
        this.ethiopianOptimization.enableThumbnail &&
        this.isImage(file.mimetype)
      ) {
        const thumbnailBuffer = await this.generateThumbnail(file.buffer);
        const thumbnailKey = `uploads/${options.userId}/${folder}/${fileId}_thumb${extension}`;
        thumbnailUrl = await this.uploadToS3(thumbnailBuffer, thumbnailKey, file.mimetype);
        this.logger.log(`Thumbnail generated for ${file.originalname}`);
      }

      // Upload to S3 with Ethiopian optimizations
      const url = await this.uploadToS3(processedBuffer, key, file.mimetype);

      const result: UploadResult = {
        url,
        key,
        size: processedBuffer.length,
        type: file.mimetype,
        thumbnail: thumbnailUrl,
      };

      this.logger.log(`Upload completed: ${key}, size: ${result.size} bytes`);

      // Note: Post-processing queue can be added later with Bull
      this.logger.log(`File uploaded successfully: ${key}`);

      return result;
    } catch (error) {
      this.logger.error(`Upload failed for ${file.originalname}:`, error);
      throw new BadRequestException(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.uploadConfig.s3Bucket,
        Key: key,
      }).promise();

      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}:`, error);
      throw new BadRequestException(`Failed to delete file`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const params = {
        Bucket: this.uploadConfig.s3Bucket,
        Key: key,
        Expires: expiresIn,
      };

      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for ${key}:`, error);
      throw new BadRequestException('Failed to generate file access URL');
    }
  }

  async getFileInfo(key: string): Promise<AWS.S3.HeadObjectOutput> {
    try {
      return await this.s3.headObject({
        Bucket: this.uploadConfig.s3Bucket,
        Key: key,
      }).promise();
    } catch (error) {
      this.logger.error(`Failed to get file info for ${key}:`, error);
      throw new BadRequestException('File not found');
    }
  }

  private validateFile(file: UploadedFile): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.uploadConfig.maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.uploadConfig.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.uploadConfig.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed. Allowed types: ${this.uploadConfig.allowedTypes.join(', ')}`);
    }
  }

  private async uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<string> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.uploadConfig.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'private', // Ethiopian privacy regulations
      Metadata: {
        uploadedAt: new Date().toISOString(),
        optimizedFor: 'Ethiopia',
      },
      // Ethiopian network optimization
      CacheControl: 'max-age=31536000', // 1 year for static assets
    };

    await this.s3.upload(params).promise();

    // Return CDN URL if configured, otherwise S3 URL
    if (this.ethiopianOptimization.enableCDN && this.uploadConfig.cloudfrontUrl) {
      return `${this.uploadConfig.cloudfrontUrl}/${key}`;
    }

    return `https://${this.uploadConfig.s3Bucket}.s3.${this.uploadConfig.s3Region}.amazonaws.com/${key}`;
  }

  private async compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
    try {
      if (!this.isImage(mimeType)) {
        return buffer;
      }

      // Ethiopian bandwidth optimization: aggressive compression
      const quality = mimeType === 'image/jpeg' ? 80 : 90;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sharpInstance = (sharp as any)(buffer);
      return await sharpInstance
        .jpeg({ quality })
        .png({ compressionLevel: 6 })
        .toBuffer();
    } catch (error) {
      this.logger.warn(`Image compression failed, using original:`, error);
      return buffer;
    }
  }

  private async generateThumbnail(buffer: Buffer): Promise<Buffer> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sharpInstance = (sharp as any)(buffer);
      return await sharpInstance
        .resize(this.ethiopianOptimization.maxThumbnailWidth, this.ethiopianOptimization.maxThumbnailHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (error) {
      this.logger.error('Thumbnail generation failed:', error);
      throw error;
    }
  }



  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }
}
