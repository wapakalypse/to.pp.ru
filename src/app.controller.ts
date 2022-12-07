import { Controller, Get, Render, Post, Request, UseGuards, Param, Res, UseFilters } from '@nestjs/common';
import { ArticlesService } from "./articles/articles.service";
import { Response } from 'express';
import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { SitemapStream, streamToPromise } from 'sitemap';

@Controller()
export class AppController {
  constructor(private readonly articlesService: ArticlesService){}

  @Get()
  @Render('index')
  async mainPage() {
    let all1 = await this.articlesService.getAllForMain(1),
        all2 = await this.articlesService.getAllForMain(2),
        politic = await this.articlesService.getNewsForMain('Политика'),
        economy = await this.articlesService.getNewsForMain('Экономика'),
        tech = await this.articlesService.getNewsForMain('Технологии'),
        ecology = await this.articlesService.getNewsForMain('Экология'),
        science = await this.articlesService.getNewsForMain('Наука'),
        religion= await this.articlesService.getNewsForMain('Религия');
    return { title: 'FoxNews по-русски - свежие новости, статьи, мнения на сегодня',
              description: 'Переводы новостей от сайта FoxNews на русском сегодня. Политика, экономика, технологии, экология, наука, религия и другие темы. Фото и видео',
              all1: all1,
              all2: all2,
              politic: politic,
              economy: economy,
              tech: tech,
              ecology: ecology,
              science: science,
              religion: religion };
  }


  @Get('/rubrics/:category/:page?')
  @Render('articles/list')
  async category(@Res() res, @Param('category') category, @Param('page') page?) {
    let catName = await this.articlesService.convertCategory(category),
        allArticles = await this.articlesService.getByCategory(catName, page),
        pagination = await this.articlesService.getPaginationForCategory(catName),
        bestNews = await this.articlesService.getAll();
    return { title: catName + ' | FoxNews по-русски - новости, статьи, мнения по теме ' + catName,
              description: 'Новости от FoxNews по категории ' + catName + ' - полные статьи, мнения авторов, актуальные темы, фоторепортажи, видеоролики с переводом на русский',
              catName: catName,
              list: allArticles,
              bestNews: bestNews,
              pages: pagination,
              currentPage: page,
              category: category };
  }

  @Get('/rss')
  @Render('rss')
  async feedRSS(@Res() res) {
    res.set('Content-Type', 'text/xml');
    let articles = await this.articlesService.getAll(1),
        date = new Date().toISOString();
    return { title: 'RSS Feed', articles: articles, date: date };
  }

  @Get('/lgn')
  @Render('login')
  index() {
    return { title: 'login' };
  }

  @UseGuards(LoginGuard)
  @Post('/lgn')
  login(@Request() req, @Res() res: Response): void {
    res.redirect('/cntrl');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('home')
  @Render('profile')
  getHome(@Request() req, @Res() res: Response): {user: any } {
    return { user: req.user };
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response): void {
    req.logout();
    res.redirect('/');
  }

  @Get('/yyy')
  async scrape() {
    let articles = await this.articlesService.scrape();
    return true;
  }
}