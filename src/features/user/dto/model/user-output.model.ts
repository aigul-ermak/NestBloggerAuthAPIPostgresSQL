export class UserOutputModel {
  id: number;
  login: string;
  email: string;
  createdAt: Date;
}

export const UserOutputModelMapper = (user: any): UserOutputModel => {
  const outputModel: UserOutputModel = new UserOutputModel();

  outputModel.id = user.id;
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = new Date(user.created_at);

  return outputModel;
};

export class UserWithIdOutputModel {
  id: number;
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
