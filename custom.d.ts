type typeClientObject = {
  name: string;
  email: string;
};

declare namespace Express {
  export interface Request {
    client?: typeClientObject;
  }
}
