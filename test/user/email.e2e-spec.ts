import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../../src/settings/apply.app.setting';
import { EmailService } from '../../src/features/email/email.service';
import { EmailAdapter } from '../../src/features/email/email-adapter.service';
import { User } from '../../src/features/user/entities/user.entity';
const request = require('supertest');

describe('Email testing', () => {
  let emailService: EmailService;
  let emailAdapter: EmailAdapter;

  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    applyAppSettings(app);
    await app.init();

    httpServer = app.getHttpServer();

    emailService = app.get<EmailService>(EmailService);
    emailAdapter = app.get<EmailAdapter>(EmailAdapter);

    jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    if (httpServer) {
      await request(httpServer).delete('/testing/all-data').expect(204);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send email confirmation message', async () => {
    const mockUser: Partial<User> = {
      email: 'test@example.com',
      confirmationCode: '123456',
    };

    await emailService.sendEmailConfirmationMessage(mockUser);

    expect(emailAdapter.sendEmail).toHaveBeenCalledWith(
      mockUser.email,
      'Email Confirmation',
      expect.stringContaining('https://somesite.com/confirm-email?code=123456'),
    );
  });

  it('should throw an error if email is missing', async () => {
    const mockUser: Partial<User> = {
      confirmationCode: '123456',
    };

    await expect(
      emailService.sendEmailConfirmationMessage(mockUser),
    ).rejects.toThrow('Email is required');
  });
});
