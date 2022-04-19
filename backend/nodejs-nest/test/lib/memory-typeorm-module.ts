import { TypeOrmModule } from '@nestjs/typeorm';

export function MemoryTypeOrmModule() {
  return TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    logging: false,
    synchronize: true,
  });
}
