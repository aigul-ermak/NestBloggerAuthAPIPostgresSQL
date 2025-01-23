declare namespace Express {
  export interface Request {
    user?: {
      userId: number;
      deviceId: string;
      userIP: string;
      userAgent: string;
    };
  }
}
