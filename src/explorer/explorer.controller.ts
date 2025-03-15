import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
    @Body('folder_name') folder_name: string,
  ) {
    return await this.explorerService.uploadFiles(files.files, folder_name);
  }

  @Get('list')
  async getFileList(@Query('folder_path') folder_path?: string) {
    return await this.explorerService.getAllFiles(undefined, folder_path);
  }

  @Post('folder')
  async createFolder(@Body('folder_name') folder_name: string) {
    // return new Promise((resolve) => {
    //   resolve(folder_name || 'noooo');
    // });
    return await this.explorerService.createFolder(folder_name);
  }

  @Delete('files')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFiles(@Body('files') files: string[]) {
    await this.explorerService.deleteFiles(files);
  }
}
