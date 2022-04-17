import dataSource from 'src/database/typeorm-data-source';

(async () => {
  dataSource.initialize();
  await dataSource.runMigrations();
})();
