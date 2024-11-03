export class UserOutputModel {
  id: number;
  login: string;
  email: string;
  createdAt: Date;
}

export class UserWithIdOutputModel {
  id: string;
  accountData: {
    passwordRecoveryCode: string;
    createdAt: Date;
    login: string;
    recoveryCodeExpirationDate: Date | null;
    email: string;
    passwordHash: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
}
