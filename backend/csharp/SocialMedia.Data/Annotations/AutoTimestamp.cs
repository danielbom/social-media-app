using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

// https://stackoverflow.com/questions/45429719/automatic-createdat-and-updatedat-fields-onmodelcreating-in-ef6

namespace SocialMedia.Data;

[AttributeUsage(AttributeTargets.Class)]
public class AutoTimestamp : Attribute
{
    public int MyProperty { get; set; }

    public static bool HasAnnotation(Type type)
    {
        var attributes = System.Attribute.GetCustomAttributes(type);
        foreach (var attribute in attributes)
            if (attribute is AutoTimestamp)
                return true;
        return false;
    }

    private static void UpdateEntityEntry(EntityEntry entityEntry)
    {
        var now = DateTime.UtcNow;
        if (entityEntry.State == EntityState.Added)
        {
            PropertyInfo? createdAtInfo = entityEntry.Entity.GetType().GetProperty("CreatedAt");
            if (createdAtInfo != null)
                createdAtInfo.SetValue(entityEntry.Entity, Convert.ChangeType(now, createdAtInfo.PropertyType), null);
        }

        PropertyInfo? updatedAtInfo = entityEntry.Entity.GetType().GetProperty("UpdatedAt");
        if (updatedAtInfo != null)
            updatedAtInfo.SetValue(entityEntry.Entity, Convert.ChangeType(now, updatedAtInfo.PropertyType), null);
    }

    public static void Update(EntityEntry entityEntry)
    {
        var typ = entityEntry.Entity.GetType();
        if (HasAnnotation(typ))
            UpdateEntityEntry(entityEntry);
    }
}

