import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Render, Res } from "@nestjs/common";
import { Page } from "./schemas/pages.schema";
import { PagesService } from "./pages.service";

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService){}

    @Get('/:slug')
    @Render('pages/single')
    async single(@Res() res, @Param('slug') slug) {
        let page = await this.pagesService.getSingle(slug);
        return { title: page.title,
                    description: page.description,
                    page: page };
    }
}