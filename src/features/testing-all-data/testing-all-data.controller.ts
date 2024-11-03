import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingAllDataService } from './testing-all-data.service';

@Controller('testing')
export class TestingAllDataController {
  constructor(private readonly testingAllDataService: TestingAllDataService) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.testingAllDataService.clearAllData();
  }
}
