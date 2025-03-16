import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ExplorerService } from './explorer.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../decorators/user.decorator';

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadMultipleFiles(
    @User() user: any,
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Body('folder_name') folder_name: string,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.uploadFiles(
      files.files,
      clientId as string,
      folder_name,
    );
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  async getFileList(
    @User() user: any,
    @Query('folder_path') folder_path?: string,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.getAllFiles(
      clientId as string,
      folder_path,
    );
  }

  @Post('folder')
  @UseGuards(AuthGuard('jwt'))
  async createFolder(
    @User() user: any,
    @Body('folder_name') folder_name: string,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.createFolder(
      folder_name,
      clientId as string,
    );
  }

  @Delete('files')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFiles(@User() user: any, @Body('files') files: string[]) {
    const { username: clientId } = user;
    await this.explorerService.deleteFiles(files, clientId as string);
  }

  @Post('download')
  @UseGuards(AuthGuard('jwt'))
  async downloadFiles(
    @User() user: any,
    @Body('files') files: string[],
    @Res() res: Response,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.downloadFiles(
      res,
      files,
      clientId as string,
    );
  }
}
