import { randomUUID } from 'crypto';
import { Role } from 'src/app/users/entities/role.enum';
import { env } from 'src/environment';
import { HashService } from 'src/services/hash/hash.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAdmin1651342670440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const id = randomUUID();
    const hash = await new HashService().hash(env.app.adminPassword);
    await queryRunner.query(`
        INSERT INTO \`user\` (id, username, password, role) 
        VALUES ('${id}', 'admin', '${hash}', '${Role.ADMIN}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`user\`
      WHERE username = 'admin';
    `);
  }
}
