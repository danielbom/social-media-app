﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Data.Migrations
{
    public partial class UnlinkCommentPost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostParentId",
                table: "Comments");

            migrationBuilder.AlterColumn<Guid>(
                name: "PostParentId",
                table: "Comments",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostParentId",
                table: "Comments",
                column: "PostParentId",
                principalTable: "Posts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Posts_PostParentId",
                table: "Comments");

            migrationBuilder.AlterColumn<Guid>(
                name: "PostParentId",
                table: "Comments",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Posts_PostParentId",
                table: "Comments",
                column: "PostParentId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
