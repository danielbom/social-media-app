using System;
using System.Text;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

public class Logger : ILogger, IDisposable
{
    public string Name { get; set; }
    private ITestOutputHelper Helper { get; set; }

    public Logger(string name, ITestOutputHelper helper)
    {
        Name = name;
        Helper = helper;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception, string> formatter)
    {
        StringBuilder builder = new StringBuilder();
        if (exception != null)
        {
            builder.Append(formatter(state, exception));
            builder.AppendLine();
            builder.Append(exception.ToString());
        }
        LogInformation(builder.ToString());
    }

    public void LogInformation(string msg)
    {
        if (msg != null)
            Helper.WriteLine(DateTimeOffset.UtcNow + " : " + Name + " : " + msg);
    }

    public IDisposable BeginScope<TState>(TState state) => this;

    public void Dispose() { }

    public bool IsEnabled(LogLevel logLevel) => true;
}
