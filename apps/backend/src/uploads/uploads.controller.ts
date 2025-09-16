import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  Body,
} from '@nestjs/common';
import { Readable } from 'stream';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadsService } from './uploads.service';

interface MulterFile {
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

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body() body: { userId: string; folder?: string; generateThumbnail?: string; compression?: string },
  ) {
    const options = {
      userId: body.userId,
      folder: body.folder,
      generateThumbnail: body.generateThumbnail !== 'false',
      compression: body.compression !== 'false',
    };

    return this.uploadsService.uploadFile(file, options);
  }

  @Get(':key')
  async getSignedUrl(@Param('key') key: string) {
    return { url: await this.uploadsService.getSignedUrl(key) };
  }

  @Get(':key/info')
  async getFileInfo(@Param('key') key: string) {
    return this.uploadsService.getFileInfo(key);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.uploadsService.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}
