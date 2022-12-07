import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PagesDocument = Page & Document;

@Schema()
export class Page {

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
    date: string
}

export const PagesSchema = SchemaFactory.createForClass(Page);