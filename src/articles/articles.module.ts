import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticlesSchema } from './schemas/articles.schema';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { NestCrawlerModule } from 'nest-crawler';

@Module({
  imports: [NestCrawlerModule,
            MongooseModule.forRoot('mongodb://localhost/a1sport'),
            MongooseModule.forFeature([{name: Article.name, schema: ArticlesSchema}])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule {}