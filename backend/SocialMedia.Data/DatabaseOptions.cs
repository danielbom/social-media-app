namespace SocialMedia.Data;

public enum DatabaseType
{
    Sqlite,
    Postgres,
    MySql
}

public class DatabaseOptions
{
    public DatabaseType DatabaseType { get; set; }
    public string ConnectionString { get; set; } = "";
}