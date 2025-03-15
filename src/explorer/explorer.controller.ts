import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ExplorerService } from './explorer.service';

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadMultipleFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ) {
    return await this.explorerService.uploadFiles(files.files);
  }

  @Get('list')
  async getFileList(@Query('folder_path') folder_path?: string) {
    return await this.explorerService.getAllFiles(undefined, folder_path);
  }
}
