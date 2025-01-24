import { IUserDocument, IUserAuthInfoRequest } from '../../interface';

declare global {
  export namespace Express {
    interface Request {
      user: IUserAuthInfoRequest;
      user_document: IUserDocument;
    }
  }
}
