import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Article, ArticlesSchema } from '../articles/schemas/articles.schema';
import { ArticlesModule } from '../articles/articles.module';
import { Page, PagesSchema } from '../pages/schemas/pages.schema';
import { NestCrawlerModule } from 'nest-crawler';

@Module({
  imports: [NestCrawlerModule,
            MongooseModule.forRoot('mongodb://localhost/a1sport'),
            MongooseModule.forFeature([{name: Article.name, schema: ArticlesSchema}, {name: Page.name, schema: PagesSchema}]),
            ArticlesModule],
  controllers: [AdminController],
  providers: [AdminService]
})

export class AdminModule {}