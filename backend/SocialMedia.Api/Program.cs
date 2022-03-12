using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OData;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SocialMedia.Api.Configuration;
using SocialMedia.Data;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddControllers()
    .AddOData(opt => opt
        .Count()
        .Filter()
        .Expand()
        .Select()
        .OrderBy()
        .SetMaxTop(50)
        .AddRouteComponents("odata.v1", ODataModel.CreateConventionalModel()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // http://www.macoratti.net/21/06/aspnc_tkjwtswag1.htm
    // https://stackoverflow.com/questions/43447688/setting-up-swagger-asp-net-core-using-the-authorization-headers-bearer
    var jwtSecurityScheme = new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = @"JWT Authorization header using the Bearer scheme.
        Enter 'Bearer' [space] and then your token in the text input below.
        Example: ""Bearer 12345abcdef""",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {jwtSecurityScheme, new string[] {}}
    });
    c.OperationFilter<ODataParametersSwaggerDefinition>();
});

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

app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.DocExpansion(DocExpansion.None);
        c.DefaultModelExpandDepth(-1);
    });

    app.UseODataRouteDebug();
}

app.UseODataQueryRequest();
app.UseODataBatching();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
