using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SocialMedia.Data;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Utilities;

internal class Server
{
    private Logger Logger;
    private AppDbContextFactory AppDbContextFactory;
    private LoggerProvider LogProvider;

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

        return application.CreateClient();
    }

    public AppDbContext CreateContext()
    {
        return AppDbContextFactory.CreateContext();
    }

    public StringContent CreateBody(string text)
    {
        return new StringContent(text, Encoding.UTF8, "application/json");
    }
}
