import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ArticlesDocument = Article & Document;

@Schema()
export class Article {

    @Prop()
    orig_title: string

    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    content: string

    @Prop()
    slug: string

    @Prop()
    img: string

    @Prop()
    category: string

    @Prop()
    author: string

    @Prop()
    date: string

    @Prop()
    pub: number
}

export const ArticlesSchema = SchemaFactory.createForClass(Article);