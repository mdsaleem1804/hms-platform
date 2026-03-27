using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class appointment_reminders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Priority",
                table: "appointments",
                newName: "priority");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "appointments",
                newName: "notes");

            migrationBuilder.RenameColumn(
                name: "Department",
                table: "appointments",
                newName: "department");

            migrationBuilder.AlterColumn<string>(
                name: "priority",
                table: "appointments",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "normal",
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "notes",
                table: "appointments",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "department",
                table: "appointments",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "appointment_reminders",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    appointment_id = table.Column<string>(type: "text", nullable: false),
                    channel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    timing = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointment_reminders", x => x.id);
                    table.ForeignKey(
                        name: "FK_appointment_reminders_appointments_appointment_id",
                        column: x => x.appointment_id,
                        principalTable: "appointments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_reminders_appointment_id",
                table: "appointment_reminders",
                column: "appointment_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointment_reminders");

            migrationBuilder.RenameColumn(
                name: "priority",
                table: "appointments",
                newName: "Priority");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "appointments",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "department",
                table: "appointments",
                newName: "Department");

            migrationBuilder.AlterColumn<string>(
                name: "Priority",
                table: "appointments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldDefaultValue: "normal");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "appointments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Department",
                table: "appointments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);
        }
    }
}
