using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SocialMedia.Api.Configuration;

/// <summary>
/// Help your swagger show OData query options with example pre-fills
/// </summary>
public class ODataParametersSwaggerDefinition : IOperationFilter
{
    private static readonly Type QueryableType = typeof(IQueryable);
    private static readonly OpenApiSchema STRING_SCHEMA = new OpenApiSchema { Type = "string" };
    private static readonly OpenApiSchema INT_SCHEMA = new OpenApiSchema { Type = "integer" };

    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasNoParams = (operation.Parameters == null || operation.Parameters.Count == 0);
        var isQueryable = context.MethodInfo.ReturnType.GetInterfaces().Any(x => x == QueryableType);

        if (hasNoParams && isQueryable)
        {

            operation.Parameters = new List<OpenApiParameter>();
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "$filter",
                Description = "Filter the results using OData syntax.",
                Required = false,
                In = ParameterLocation.Query,
                Schema = STRING_SCHEMA

            });
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "$select",
                Description = "Trim the fields returned using OData syntax",
                Required = false,
                In = ParameterLocation.Query,
                Schema = new OpenApiSchema { Type = "string" }
            });
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "$orderby",
                Description = "Order the results using OData syntax.",
                Required = false,
                In = ParameterLocation.Query,
                Schema = new OpenApiSchema { Type = "string" }
            });
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "$skip",
                Description = "The number of results to skip.",
                Required = false,
                In = ParameterLocation.Query,
                Schema = INT_SCHEMA
            });
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "$top",
                Description = "The number of results to return.",
                Required = false,
                In = ParameterLocation.Query,
                Schema = INT_SCHEMA
            });
        }
    }
}