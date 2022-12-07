import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ArticlesService } from "../../articles/articles.service";

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(private readonly articlesService: ArticlesService){}

  // List scheduled jobs below
  @Cron('* * * * * */1')
  async handleCron() {
  //  const scraping = await this.articlesService.scrape2();
  //  this.logger.debug('Scraping done: ' + scraping + ' items');
  }
}
