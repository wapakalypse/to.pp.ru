import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PagesSchema } from './schemas/pages.schema';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { NestCrawlerModule } from 'nest-crawler';

@Module({
  imports: [NestCrawlerModule,
            MongooseModule.forRoot('mongodb://localhost/a1sport'),
            MongooseModule.forFeature([{name: Page.name, schema: PagesSchema}])],
  controllers: [PagesController],
  providers: [PagesService]
})
export class PagesModule {}