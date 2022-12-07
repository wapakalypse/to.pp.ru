import { Body, Controller, Get, Param, Post, Render, Res, UseFilters, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Article } from "../articles/schemas/articles.schema";
import { ArticlesService } from "../articles/articles.service";
import { Page } from "../pages/schemas/pages.schema";
import { AuthExceptionFilter } from '../common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('cntrl')
@UseFilters(AuthExceptionFilter)
export class AdminController {
    constructor(private readonly adminService: AdminService,
                private readonly articlesService: ArticlesService){}

    @UseGuards(AuthenticatedGuard)
    @Get()
    @Render('admin/index')
    async main(@Res() res) {
        let articles = await this.adminService.getLastArticles(),
            pages = await this.adminService.getLastPages();
        return { title: 'Admin', articles: articles, pages: pages };
    }

    /* Articles */
    
    @UseGuards(AuthenticatedGuard)
    @Get('/articles/list/:page?')
    @Render('admin/list')
    async listArticles(@Res() res, @Param('page') page?) {
        let articles = await this.adminService.getArticles(page),
            pagination = await this.articlesService.getPagination();
        return { title: 'Articles List', link: 'articles', list: articles, pages: pagination, currentPage: page };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/articles/add')
    @Render('admin/form')
    createArticle() {
        return { title: 'Add Article', formMethod: 'add' };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/articles/edit/:id')
    @Render('admin/form')
    async editArticle(@Res() response, @Param('id') id) {
        const article = await this.adminService.editArticle(id);
        return { title: 'Edit Article', list: article };
    }
 
    @UseGuards(AuthenticatedGuard)
    @Post('/articles/add')
    async addArticle(@Res() response, @Body() article: Article) {
        const newArticle = await this.adminService.addArticle(article);
        return response.redirect('/cntrl/articles/list/');
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/articles/edit/:id')
    async updateArticle(@Res() response, @Param('id') id, @Body() article: Article) {
        const updatedArticle = await this.adminService.updateArticle(id, article);
        return response.redirect('/cntrl/articles/list/');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/articles/publish/:id')
    async activateArticle(@Res() response, @Param('id') id) {
        const activatedArticle = await this.adminService.activateArticle(id);
        return response.redirect('/cntrl/articles/list/');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('articles/delete/:id')
    async deleteArticle(@Res() response, @Param('id') id) {
        const deletedArticle = await this.adminService.deleteArticle(id);
        return response.redirect('/cntrl/');
    }


    /* Pages */

    @UseGuards(AuthenticatedGuard)
    @Get('/pages/list/')
    @Render('admin/list')
    async listPages() {
        let pages = await this.adminService.getPages();
        return { title: 'Pages list', link: 'pages', list: pages };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/pages/add')
    @Render('admin/form')
    createPage() {
        return { title: 'Add Page' };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/pages/form/:id')
    @Render('admin/edit')
    async editPage(@Res() response, @Param('id') id) {
        const page = await this.adminService.editPage(id);
        return { title: 'Edit page', list: page };
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/pages/add')
    async addPage(@Res() response, @Body() page: Page) {
        const newPage = await this.adminService.addPage(page);
        return response.redirect('/cntrl/pages/list/');
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/pages/edit/:id')
    async updatePage(@Res() response, @Param('id') id, @Body() article: Article) {
        const updatedArticle = await this.adminService.updatePage(id, article);
        return response.redirect('/cntrl/pages/list/');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('pages/delete/:id')
    async deletePage(@Res() response, @Param('id') id) {
        const deletedArticle = await this.adminService.deletePage(id);
        return response.redirect('/cntrl/pages/list/');
    }
}