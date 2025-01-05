import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('/')
  serveHtml(@Res() res: Response) {
    const filePath = join(__dirname, '../public/index.html');
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace placeholders with environment variables
    html = html.replace(
      '{{API_URL}}',
      process.env.HOST_URL || 'http://localhost:3000',
    );
    html = html.replace(
      '{{SOCKET_URL}}',
      process.env.HOST_URL || 'http://localhost:3000',
    );

    res.send(html);
  }
}
