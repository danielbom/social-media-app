using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OData;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SocialMedia.Api.Configuration;
using SocialMedia.Api.Repositories;
using SocialMedia.Api.Services;
using SocialMedia.Data;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddControllers()
    .AddNewtonsoftJson()
    .AddOData(opt => opt
        .EnableQueryFeatures(50)
        .AddRouteComponents("odata.v1", ODataModel.CreateConventionalModel()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
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

// Api Options
builder.Services.AddOptions<DatabaseOptions>().Configure<IOptions<DataDirectories>>((options, datadirs) =>
{
    DatabaseType databaseType;
    if (Enum.TryParse(builder.Configuration["ConnectionStrings:Type"], out databaseType))
    {
        options.ConnectionString = builder.Configuration["ConnectionStrings:Url"];
        options.DatabaseType = databaseType;
    }
    else
    {
        throw new InvalidOperationException("No database option was configured.");
    }
});

// Services Register
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<PasswordService>();
builder.Services.AddSingleton<AppDbContextFactory>();
builder.Services.AddScoped<CommentRepository>();
builder.Services.AddScoped<PostRepository>();
builder.Services.AddScoped<UserRepository>();

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

if (app.Environment.IsProduction())
{
    // Disable https redirects with invalid ssl certification
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();

public partial class Program { }
