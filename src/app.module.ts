import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { PagesModule } from './pages/pages.module';
import { AdminModule } from './admin/admin.module';
import { NestCrawlerModule } from 'nest-crawler';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksService } from './common/shared/scheduled-tasks.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://mirovlad:elivery010203@cluster0.nkmwju4.mongodb.net/foxnews', { useNewUrlParser: true }),
    NestCrawlerModule,
    AdminModule,
    ArticlesModule,
    PagesModule,
    AuthModule,
    UsersModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, ScheduledTasksService],
})

export class AppModule {}