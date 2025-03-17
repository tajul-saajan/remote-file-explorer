import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from '../types';

@ApiTags('Explorer')
@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @ApiOperation({ summary: 'Upload single or multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadMultipleFiles(
    @User() user: AuthUser,
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Body('folder_name') folder_name: string,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.uploadFiles(
      files.files,
      clientId,
      folder_name,
    );
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List files and folders with metadata' })
  @ApiResponse({
    schema: {
      example: [
        {
          name: 'tajul1/1742159955061-validation.png',
          isFolder: false,
          metadata: {},
          properties: {
            contentType: 'image/png',
            contentLength: 88912,
            lastModified: '2025-03-16T21:20:32.000Z',
            etag: '"0x8DD64D06252A378"',
          },
        },
      ],
    },
  })
  async getFileList(
    @User() user: AuthUser,
    @Query('folder_path') folder_path?: string,
    @Query('search') search?: string,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.getAllFiles(
      clientId,
      folder_path,
      search,
    );
  }

  @Post('folder')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'create a folder' })
  @ApiResponse({
    schema: {
      example: {
        path: 'https://statratenantupload.blob.core.windows.net/dummy-client1/dummy-client1/newFolder1/',
      },
    },
  })
  async createFolder(
    @User() user: AuthUser,
    @Body('folder_name') folder_name: string,
  ) {
    const { username: clientId } = user;
    const path = await this.explorerService.createFolder(folder_name, clientId);

    return { path };
  }

  @Delete('files')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete files or folders' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            example: 'newFolder/1742073748067-validation.png',
          },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async deleteFiles(@User() user: AuthUser, @Body('files') files: string[]) {
    const { username: clientId } = user;
    await this.explorerService.deleteFiles(files, clientId);
  }

  @Post('download')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Download a files',
    description:
      'if single file, download it. if multiple files, download zipped file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            example: 'newFolder/1742073748067-validation.png',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Header('Content-Disposition', 'attachment; filename="file.txt"')
  async downloadFiles(
    @User() user: AuthUser,
    @Body('files') files: string[],
    @Res() res: Response,
  ) {
    const { username: clientId } = user;
    return await this.explorerService.downloadFiles(res, files, clientId);
  }
}
