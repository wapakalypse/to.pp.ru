import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article, ArticlesDocument } from "./schemas/articles.schema";
import { NestCrawlerService } from 'nest-crawler';
import translate from 'translate';
import cheerio from 'cheerio';

@Injectable()
export class ArticlesService {

    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticlesDocument>,
                                private readonly crawler: NestCrawlerService) {}


    async getAll(page = 1): Promise<Article[]> {

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

    async getAllForMain(page = 1): Promise<Article[]> {

        let articles;

        if (page == 1) {
            articles = await this.articleModel.find()
                .limit(3)
                .sort({date: -1})
                .exec();
        } else {
            articles = await this.articleModel.find()
                .limit(6)
                .skip(3)
                .sort({date: -1})
                .exec();
        }


        return articles;
    }

    async getPagination(): Promise<any> {
        let perArticle = 10;
        let countArticles = await this.articleModel.count().exec();
        countArticles = countArticles / perArticle;
        return await Math.ceil(countArticles);
    }

    async getPaginationForCategory(category: string): Promise<any> {
        let perArticle = 10;
        let countArticles = await this.articleModel.find({category: category}).count().exec();
        countArticles = countArticles / perArticle;
        return await Math.ceil(countArticles);
    }

    async getByCategory(category: string, page = 1): Promise<Article[]> {

        let perPage = 10;

        if (page == 1) {
            return await this.articleModel.find({category: category})
                .limit(perPage)
                .sort({date: -1})
                .exec();
        } else {
            page = page - 1;
            return await this.articleModel.find({category: category})
                .limit(perPage)
                .skip(perPage * page)
                .sort({date: -1})
                .exec();
        }
    }

    async getSingle(slug: string): Promise<Article> {
        return await this.articleModel.findOne({slug: slug}).exec();
    }

    async getNewsForMain(category): Promise<Article[]> {
            return await this.articleModel.find({category: category})
            .limit(6)
            .sort({date: -1})
            .exec();    
    }

    async convertCategory(category): Promise<string> {
        let catName: string;
        switch (category) {
            case 'politic':
                catName = 'Политика';
                break;
            case 'economy':
                catName = 'Экономика';
                break;
            case 'tech':
                catName = 'Технологии';
                break;
            case 'ecology':
                catName = 'Экология';
                break;
            case 'science':
                catName = 'Наука';
                break;
            case 'religion':
                catName = 'Религия';
                break;
            case 'Политика':
                catName = 'politic';
                break;
            case 'Экономика':
                catName = 'economy';
                break;
            case 'Технологии':
                catName = 'tech';
                break;
            case 'Экология':
                catName = 'ecology';
                break;
            case 'Наука':
                catName = 'science';
                break;
            case 'Религия':
                catName = 'religion';
                break;
        }
        return await catName;
    }

    public async scrape(): Promise<any> {
        interface news {
            title: string;
            orig_title: string;
            slug: string;
            description: string
            orig_description: string
            content: string;
            orig_content: string;
            category: string;
            img: string;
            date: string;
            pub: number;
        }

        interface linkOne {
            content: string;
        }

        let catLinks: string[] = ['category/world/conflicts',        // politic
                                    'category/world/global-economy', // economy
                                    'category/us/economy',           // economy
                                    'category/world/environment',    // ecology
                                    'category/world/religion',       // religion
                                    'tech',                          // tech
                                    'science'];                      // science
        
        let categories: string[] = ['Политика', 'Экономика', 'Экономика', 'Экология', 'Религия', 'Технологии', 'Наука'];
        
        let count: number = 0;

        for(let i = 0; i < catLinks.length; i++){

            let linksFetch: linkOne = await this.crawler.fetch({
                target: 'https://www.foxnews.com/' + catLinks[i],
                fetch: {
                    content: {
                        selector: '.article-list h4 > a',
                        attr: 'href',
                    },
                },
            });

            let url: string = linksFetch.content;

            if(url.includes('http')) continue;

            const data: news = await this.crawler.fetch({
                target: 'https://www.foxnews.com' + url,
                fetch: {
                    orig_title: 'h1',
                    orig_description: 'h2',
                        orig_content: {
                        selector: '.article-body',
                        how: 'html',
                    },
                    img: {
                        selector: '.article-body .image-ct img',
                        attr: 'src',
                    }
                },
            });

            let articleItem: any = this.articleModel;
            

            //    data.slug = data.orig_title.toLowerCase();
                
            //    data.slug = data.slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            //                            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            //                            .replace(/-+/g, '-'); // collapse dashes

            data.slug = url.split('/')[2];

            async function checkDupl(article: any): Promise<void> {
                return await articleItem.findOne({slug: data.slug});
            }

            let x = checkDupl(articleItem);

            if(await x != null) continue;

            data.category = categories[i];
                                        
            data.title = await translate(data.orig_title, { to: "ru", from: "en" });
            data.description = await translate(data.orig_description, { to: "ru", from: "en" });

        //    data.orig_content = data.orig_content.replace(/&#x26;/gi, '&');
        //    data.orig_content = data.orig_content.replace(/&#160;/gi, ' ');
        //    data.orig_content = data.orig_content.replace(/&#x2019;/gi, '’');

            let pArray: string[] = [];
    //        let embed: string = '';
            let $ = cheerio.load(data.orig_content);

            $('*').removeAttr("style");
            
       //     embed = $('.embed-media').html();

            if(data.img == '') {
                data.img = $('img').attr('src');
            }

/*            
            $('div:first').remove();
            $('source').remove();
            $('div[data-iu]').remove();
            $('div p').remove();
            $('.image-ct').replaceWith(function () { return $(this).contents() })
            $('.image-ct').replaceWith($('a').html());

            $('a').each(function () {
                $(this).replaceWith($(this).text());
            });
            
    //        $('*').removeAttr("class");
    //        $('*').each(function () {
    //            if($(this).html() == '')
    //               $(this).remove();
    //        });
*/

            $('p a strong').remove();
            $('.caption p').remove();

            $('p').each(function () {
                if($(this).html() != '')
                    pArray.push($(this).text());
            });

/*          
            data.orig_content = $.html();
            
            data.orig_content = data.orig_content.replace('<html><head></head><body>', '');
            data.orig_content = data.orig_content.replace('</body></html>', '');
            data.orig_content = data.orig_content.replace('', '');
            data.orig_content = data.orig_content.replace('', '');
            data.orig_content = data.orig_content.replace(/\s+/g,' ');              
            data.orig_content = data.orig_content.replace('?ve=1andtl=1', '');
            data.orig_content = data.orig_content.replace(/&#x2014;/gi, '—');

            data.orig_content = data.orig_content.replace(/&#x201c;/gi, '"');
            data.orig_content = data.orig_content.replace(/&#x201d;/gi, '"');
            data.orig_content = data.orig_content.replace(/&apos;/gi, '"');

*/

            data.content = '<p>' + pArray.join('</p><p>') + '</p>'; 
            data.content = await translate(data.content, { to: "ru", from: "en" });         

        //    data.content = data.content + embed;

        //    data.content = data.content.replace('', '<');
        //    data.content = data.content.replace('<div >', '<div>');      

            data.content = data.content.split('< p>').join('<p>');
            data.content = data.content.split('<p >').join('<p>');
            data.content = data.content.split('</ p>').join('</p>');
            data.content = data.content.split('< /p>').join('</p>');
            data.content = data.content.split('</ p>').join('</p>');
            data.content = data.content.split('</p >').join('</p>');

            data.date = new Date().toISOString();
 
            data.pub = 1;

            const newArticle = new this.articleModel(data);
            newArticle.save();

            count++;
        }

        return count;
    }
}
