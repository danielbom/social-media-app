using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace SocialMedia.Tests.Utilities;

public class LoggerProvider : ILoggerProvider
{
    private ITestOutputHelper Helper { get; set; }

    public LoggerProvider(ITestOutputHelper helper) => Helper = helper;

    public void Dispose() { }

    ILogger ILoggerProvider.CreateLogger(string categoryName) => new Logger(categoryName, Helper);
}
