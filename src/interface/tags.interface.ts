import { Document } from 'mongoose';

export interface ITag {
  name: string;
}

export interface ITagDocument extends ITag, Document {}
