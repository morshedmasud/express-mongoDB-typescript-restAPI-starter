interface typeClientI {
  name: string;
  secret: string;
}

declare namespace Express {
  export interface Request {
    client?: typeClientI;
  }
}
