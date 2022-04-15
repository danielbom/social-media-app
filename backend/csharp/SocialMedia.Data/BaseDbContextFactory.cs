using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Options;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure.Internal;
using Npgsql.EntityFrameworkCore.PostgreSQL.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Migrations.Operations;

namespace SocialMedia.Data;

public abstract class BaseDbContextFactory<T> where T : DbContext
{
    private readonly IOptions<DatabaseOptions> _options;
    private readonly string _schemaPrefix;

    protected BaseDbContextFactory(IOptions<DatabaseOptions> options, string schemaPrefix)
    {
        _options = options;
        _schemaPrefix = schemaPrefix;
    }

    public abstract T CreateContext();

    public void ConfigureBuilder(DbContextOptionsBuilder builder)
    {
        switch (_options.Value.DatabaseType)
        {
            case DatabaseType.Sqlite:
                builder.UseSqlite(_options.Value.ConnectionString, o =>
                {
                    if (!string.IsNullOrEmpty(_schemaPrefix)) o.MigrationsHistoryTable(_schemaPrefix);
                });
                break;
            case DatabaseType.Postgres:
                builder
                    .UseNpgsql(_options.Value.ConnectionString, o =>
                    {
                        o.EnableRetryOnFailure(10);
                        if (!string.IsNullOrEmpty(_schemaPrefix)) o.MigrationsHistoryTable(_schemaPrefix);
                    })
                    .ReplaceService<IMigrationsSqlGenerator, CustomNpgsqlMigrationsSqlGenerator>();
                break;
            case DatabaseType.MySql:
                var connetionString = _options.Value.ConnectionString;
                builder.UseMySql(connetionString, ServerVersion.AutoDetect(connetionString), o =>
                {
                    o.EnableRetryOnFailure(10);

                    if (!string.IsNullOrEmpty(_schemaPrefix)) o.MigrationsHistoryTable(_schemaPrefix);
                });
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private class CustomNpgsqlMigrationsSqlGenerator : NpgsqlMigrationsSqlGenerator
    {
#pragma warning disable EF1001
        public CustomNpgsqlMigrationsSqlGenerator(MigrationsSqlGeneratorDependencies dependencies, INpgsqlOptions opts)
            : base(dependencies, opts)
        {
        }
#pragma warning restore EF1001

        protected override void Generate(NpgsqlCreateDatabaseOperation operation, IModel? model,
            MigrationCommandListBuilder builder)
        {
            builder
                .Append("CREATE DATABASE ")
                .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier(operation.Name));

            // POSTGRES gotcha: Indexed Text column (even if PK) are not used if we are not using C locale
            builder
                .Append(" TEMPLATE ")
                .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier("template0"));

            builder
                .Append(" LC_CTYPE ")
                .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier("C"));

            builder
                .Append(" LC_COLLATE ")
                .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier("C"));

            builder
                .Append(" ENCODING ")
                .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier("UTF8"));

            if (operation.Tablespace != null)
                builder
                    .Append(" TABLESPACE ")
                    .Append(Dependencies.SqlGenerationHelper.DelimitIdentifier(operation.Tablespace));

            builder.AppendLine(Dependencies.SqlGenerationHelper.StatementTerminator);

            EndStatement(builder, true);
        }
    }
}