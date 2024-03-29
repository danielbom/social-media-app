﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace SocialMedia.Data;

public class AppDbContext : DbContext
{
    private readonly bool _designTime;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        bool designTime = false)
        : base(options)
    {
        _designTime = designTime;
    }

    public virtual DbSet<User> Users => Set<User>();
    public virtual DbSet<Post> Posts => Set<Post>();
    public virtual DbSet<Comment> Comments => Set<Comment>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var isConfigured = optionsBuilder.Options.Extensions.OfType<RelationalOptionsExtension>().Any();
        if (!isConfigured)
            optionsBuilder.UseSqlite("Data Source=temp.db");
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        User.OnModelCreating(builder);
        Post.OnModelCreating(builder);
        Comment.OnModelCreating(builder);

        EnsureDesignTimeBuild(builder);
    }

    public override int SaveChanges()
    {
        AddTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddTimestamps();
        return base.SaveChangesAsync();
    }

    private void AddTimestamps()
    {
        foreach (var entity in ChangeTracker.Entries())
        {
            if (entity.State == EntityState.Added || entity.State == EntityState.Modified)
            {
                AutoTimestamp.Update(entity);
            }
        }
    }

    private void EnsureDesignTimeBuild(ModelBuilder builder)
    {
        if (Database.IsSqlite() && !_designTime)
            // SQLite does not have proper support for DateTimeOffset via Entity Framework Core, see the limitations
            // here: https://docs.microsoft.com/en-us/ef/core/providers/sqlite/limitations#query-limitations
            // To work around this, when the Sqlite database provider is used, all model properties of type DateTimeOffset
            // use the DateTimeOffsetToBinaryConverter
            // Based on: https://github.com/aspnet/EntityFrameworkCore/issues/10784#issuecomment-415769754
            // This only supports millisecond precision, but should be sufficient for most use cases.
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties()
                    .Where(p => p.PropertyType == typeof(DateTimeOffset));
                foreach (var property in properties)
                    builder
                        .Entity(entityType.Name)
                        .Property(property.Name)
                        .HasConversion(new DateTimeOffsetToBinaryConverter());
            }
    }
}