using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Data.Migrations
{
    public partial class AddAdminUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Username", "Password", "Role" },
                values: new object[,]
                {
                    { Guid.Parse("47195858-ba8c-4c2f-9ab1-f254494dd8fc"), "admin", "$2a$11$Faw3t6J0cr3Z5vC41ZWbV.GbQx/yd.D8y3hNDQL6J3O0W1IB6wPvq", "admin" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
