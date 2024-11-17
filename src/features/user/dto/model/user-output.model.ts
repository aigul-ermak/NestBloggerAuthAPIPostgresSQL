export class UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}

export const UserOutputModelMapper = (user: any): UserOutputModel => {
  const outputModel: UserOutputModel = new UserOutputModel();

  outputModel.id = user.id.toString();
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = new Date(user.created_at);

  return outputModel;
};

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
