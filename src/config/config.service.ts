import { Constants } from '../common/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  getJwtSecret(): string {
    return process.env.JWT_SECRET || Constants.JWT_SECRET; // Use env or fallback
  }

  getMongoUri(): string {
    return process.env.MONGO_URI || Constants.MONGO_URI; // Use env or fallback
  }
}
