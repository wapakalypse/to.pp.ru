import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Page, PagesDocument } from "./schemas/pages.schema";
import { NestCrawlerService } from 'nest-crawler';

@Injectable()
export class PagesService {

    constructor(
        @InjectModel(Page.name) private pageModel: Model<PagesDocument>,
                                private readonly crawler: NestCrawlerService) {}

    async getSingle(slug): Promise<Page> {
        return await this.pageModel.findOne({slug: slug}).exec();
    }

}