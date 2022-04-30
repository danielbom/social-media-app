import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(data: string | Buffer): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async compare(data: string | Buffer, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
