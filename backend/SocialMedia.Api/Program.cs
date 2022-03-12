using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SocialMedia.Api.Configuration;
using SocialMedia.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Authentication
var key = Encoding.ASCII.GetBytes(Settings.Secret);
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(builder =>
    {
        builder.RequireHttpsMetadata = false;
        builder.SaveToken = true;
        builder.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Database Context
builder.Services.AddDbContext<AppDbContext>((provider, options) =>
{
    var factory = provider.GetRequiredService<AppDbContextFactory>();
    factory.ConfigureBuilder(options);
});
builder.Services.AddSingleton<AppDbContextFactory>();

// Api Options
builder.Services.AddOptions<DatabaseOptions>().Configure<IOptions<DataDirectories>>((options, datadirs) =>
{
    var postgresConnectionString = builder.Configuration["ConnectionStrings:Postgres"];
    var mySQLConnectionString = builder.Configuration["ConnectionStrings:MySql"];
    var sqliteFileName = builder.Configuration["ConnectionStrings:Sqlite"];

    if (!string.IsNullOrEmpty(postgresConnectionString))
    {
        options.DatabaseType = DatabaseType.Postgres;
        options.ConnectionString = postgresConnectionString;
    }
    else if (!string.IsNullOrEmpty(mySQLConnectionString))
    {
        options.DatabaseType = DatabaseType.MySql;
        options.ConnectionString = mySQLConnectionString;
    }
    else if (!string.IsNullOrEmpty(sqliteFileName))
    {
        var connStr = sqliteFileName;
        if (Path.IsPathRooted(sqliteFileName))
            connStr = "Data Source=" + connStr;
        else if (!string.IsNullOrEmpty(datadirs.Value.DataDir))
            connStr = "Data Source=" + Path.Combine(datadirs.Value.DataDir, sqliteFileName);

        options.DatabaseType = DatabaseType.Sqlite;
        options.ConnectionString = connStr;
    }
    else
    {
        throw new InvalidOperationException("No database option was configured.");
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
