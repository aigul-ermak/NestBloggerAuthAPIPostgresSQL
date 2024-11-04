import { User } from '../../entities/user.entity';

export class UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
}

export const UserOutputModelMapper = (user: User): UserOutputModel => {
  const outputModel: UserOutputModel = new UserOutputModel();

  outputModel.id = user.id.toString();
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = user.createdAt;

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
