import { Module } from '@nestjs/common';
import { TestingAllDataController } from './testing-all-data.controller';
import { TestingAllDataService } from './testing-all-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TestingAllDataController],
  providers: [TestingAllDataService],
})
export class TestingAllDataModule {}
