import { MigrationInterface, QueryRunner } from "typeorm";

export class updateComments1650516854027 implements MigrationInterface {
    name = 'updateComments1650516854027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`comment\`
            ADD \`author_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`comment\`
            ADD CONSTRAINT \`FK_3ce66469b26697baa097f8da923\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3ce66469b26697baa097f8da923\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`comment\` DROP COLUMN \`author_id\`
        `);
    }

}
