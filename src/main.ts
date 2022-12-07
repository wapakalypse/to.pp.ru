import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { join } from 'path';
import { AppModule } from './app.module';
import hbs from 'hbs';

import session from 'express-session';
import flash = require('connect-flash');
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new HttpExceptionFilter());

  hbs.registerPartials(join(__dirname, '..', '/views/partials'));

  hbs.registerHelper('pagination', function(count, current, category) {
    let iter: string = '';
    for(let i = 1; i <= count; i++) {
      if((current == i) || (current == undefined && i == 1))
        iter += `<li>${i}</li>`;      
      else
        iter += `<li><a href="/rubrics/${category}/${i}">${i}</a></li>`;
    }
    return `<ul class="nav">${iter}</ul>` ;
  });

  hbs.registerHelper('adminPagination', function(count, current) {
    let iter: string = '';
    for(let i = 1; i <= count; i++) {
      if((current == i) || (current == undefined && i == 1))
        iter += `<li>${i}</li>`;      
      else
        iter += `<li><a href="${i}">${i}</a></li>`;
    }
    return `<ul class="nav">${iter}</ul>` ;
  });

  hbs.registerHelper('listItems', function(items, type) {

    let iter: string = '';
    for(let item of items) {

      let pub: string = item.pub;
      if (item.pub == 1)
        pub = '🟢';
      else 
        pub = '🔴';

      iter += `<div class="list_item">
                <div class="column">
                  <img class="list_item_img" src="${item.img}" />
                  <a class="list_item_edit" href="/cntrl/${type}/edit/${item._id}">${item.title}</a>
                </div>
                <div class="column">
                  <span class="list_item_cat">${item.category}</span>
                  <a class="list_item_del" href="/cntrl/${type}/delete/${item._id}"> ❌ </a>
                  <a class="list_item_pub" href="/cntrl/${type}/publish/${item._id}"> ${pub} </a>
                  <a class="list_item_open" target="_blank" href="/${type}/${item.slug}"> 🔎 </a>
                </div>
              </div>`
    }

    return iter;

  });

  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(8080);
}
bootstrap();
