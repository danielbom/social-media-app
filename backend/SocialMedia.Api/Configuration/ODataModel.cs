using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using SocialMedia.Data;

namespace SocialMedia.Api.Configuration;

static class ODataModel
{
    public static IEdmModel CreateConventionalModel()
    {
        var builder = new ODataConventionModelBuilder();

        builder.EntitySet<User>(nameof(User));
        builder.EntitySet<Post>(nameof(Post));
        builder.EntitySet<Comment>(nameof(Comment));

        return builder.GetEdmModel();
    }
}
