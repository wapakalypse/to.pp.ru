import { Controller, Get, Param, Render, Res, UseFilters } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Controller('articles')
@UseFilters(HttpExceptionFilter)
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService){}

    @Get('/all/:page?')
    @Render('articles/list')
    async list(@Res() res, @Param('page') page?) {
        let allArticles = await this.articlesService.getAll(page),
            pagination = await this.articlesService.getPagination();
        return { title: 'Все новости от FoxNews по-русски - полный архив тем сегодня', 
                    description: 'Архив новостей и постов от FoxNews на русском. Политика, экономика, технологии, экология, наука, религия и другие темы. Фото и видео',
                    list:
                    allArticles,
                    articles: pagination,
                    currentPage: page };
    }

    @Get('/:slug')
    @Render('articles/single')
    async single(@Res() response, @Param('slug') slug) {
        let article = await this.articlesService.getSingle(slug);
        if(!article)
            return response.redirect('/404');

        let date = new Date(article.date).toLocaleDateString(),
            catName = await this.articlesService.convertCategory(article.category),
            otherNews = await this.articlesService.getByCategory(article.category),
            bestNews = await this.articlesService.getAll();
        return { title: article.title + ' - FoxNews по-русски', 
                    description: 'FoxNews по-русски | ' + article.title + '. ' + article.description.substr(0, 35) + '...',
                    article: article,
                    date: date,
                    catName: catName,
                    otherNews: otherNews,
                    bestNews: bestNews };
    }
}