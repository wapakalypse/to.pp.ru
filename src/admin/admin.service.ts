import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticlesDocument } from "../articles/schemas/articles.schema";
import { Page, PagesDocument } from "../pages/schemas/pages.schema";

@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticlesDocument>, 
        @InjectModel(Page.name) private pageModel: Model<PagesDocument>) {}    

    async getLastArticles(): Promise<Article[]> {
        return await this.articleModel.find()
            .limit(10)
            .sort({date: -1})
            .exec();
    }

    async getLastPages(): Promise<Page[]> {
        return await this.pageModel.find()
            .limit(5)
            .sort({
                name: 'asc'
            })
            .exec();
    }


    /* Articles */

    async getArticles(page = 1): Promise<Article[]> {

        let perPage = 10;

        if (page == 1) {
            return await this.articleModel.find()
                .limit(perPage)
                .sort({date: -1})
                .exec();
        } else {
            page = page - 1;
            return await this.articleModel.find()
                .limit(perPage)
                .skip(perPage * page)
                .sort({date: -1})
                .exec();
        }
    }
        
    async addArticle(article: Article): Promise<Article> {
        const newArticle = new this.articleModel(article);
        return await newArticle.save();
    }

    async editArticle(id): Promise<Article> {
        return await this.articleModel.findOne({_id: id}).exec();
    }

    async getSingle(id, category): Promise<Article> {
        return await this.articleModel.findOne({id: id, category: category}).exec();
    }

    async updateArticle(id, Article: Article): Promise<Article> {
        return await this.articleModel.findByIdAndUpdate(id, Article)
    }

    async activateArticle(id): Promise<any> {
        let article = await this.articleModel.findOne({_id: id}).exec();

        if(article.pub == 1)
            return await this.articleModel.findByIdAndUpdate(id, { pub: 0 });
        else
            return await this.articleModel.findByIdAndUpdate(id, { pub: 1 });   
    }

    async deleteArticle(id): Promise<any> {
        return await this.articleModel.findOneAndDelete({_id: id});
    }

    async getCategory(category, Article = 1): Promise<Article[]> {
        if (Article == 1)
            return await this.articleModel.find({category: category}).exec();
        else
            return await this.articleModel.find({category: category}).exec();           
    }


    /* Pages */

    async getPages(): Promise<Page[]> {
        return await this.pageModel.find().sort({ name: 'asc' }).exec();
    }

    async addPage(page: Page): Promise<Page> {
        const newPage = new this.pageModel(page);
        return await newPage.save();
    }

    async editPage(id): Promise<Page> {
        return await this.pageModel.findOne({_id: id}).exec();
    }

    async updatePage(id, Page: Page): Promise<Page> {
        return await this.pageModel.findByIdAndUpdate(id, Page, {new: true})
    }

    async deletePage(slug): Promise<any> {
        return await this.pageModel.findByIdAndRemove(slug);
    }

}