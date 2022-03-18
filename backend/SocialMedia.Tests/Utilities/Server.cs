using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SocialMedia.Data;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Utilities;

internal class Server
{
    public Logger Logger { get; private set; }
    private AppDbContextFactory AppDbContextFactory;
    private LoggerProvider LogProvider;

    public string? Token { get; set; }

    public Server(ITestOutputHelper helper)
    {
        var DATABASE_OPTIONS = Options.Create(new DatabaseOptions()
        {
            ConnectionString = "Data Source=../../../../tmp/data/test.sqlite",
            DatabaseType = DatabaseType.Sqlite
        });

        Logger = new("Server", helper);
        LogProvider = new(helper);
        AppDbContextFactory = new AppDbContextFactory(DATABASE_OPTIONS);
    }

    public HttpClient CreateClient()
    {
        var application = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices((context, services) =>
                {
                    services.Add(ServiceDescriptor.Transient<ILoggerProvider, LoggerProvider>(provider => LogProvider));
                    services.Add(ServiceDescriptor.Singleton<AppDbContextFactory>(provider => AppDbContextFactory));
                });
                builder.ConfigureAppConfiguration((context, config) =>
                {
                });
            });

        var client = application.CreateClient();

        if (Token != null)
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {Token}");
        }

        return client;
    }

    public AppDbContext CreateContext()
    {
        return AppDbContextFactory.CreateContext();
    }

    public StringContent CreateBody(string text)
    {
        return new StringContent(text, Encoding.UTF8, "application/json");
    }

    public StringContent CreateBody<T>(T obj)
    {
        return CreateBody(JsonConvert.SerializeObject(obj));
    }
}
