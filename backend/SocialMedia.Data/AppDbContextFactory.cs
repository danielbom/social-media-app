using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace SocialMedia.Data;

public class AppDbContextFactory : BaseDbContextFactory<AppDbContext>
{
    public AppDbContextFactory(IOptions<DatabaseOptions> options) : base(options, "")
    {
    }

    public override AppDbContext CreateContext()
    {
        var builder = new DbContextOptionsBuilder<AppDbContext>();
        ConfigureBuilder(builder);
        return new AppDbContext(builder.Options);
    }
}