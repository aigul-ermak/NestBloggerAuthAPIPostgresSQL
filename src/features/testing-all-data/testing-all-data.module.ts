import { Module } from '@nestjs/common';
import { TestingAllDataController } from './testing-all-data.controller';
import { TestingAllDataService } from './testing-all-data.service';
import { DatabaseModule } from '../../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TestingAllDataController],
  providers: [TestingAllDataService],
})
export class TestingAllDataModule {}
