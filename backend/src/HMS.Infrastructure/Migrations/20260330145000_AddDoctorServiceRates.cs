using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorServiceRates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "doctor_service_rates",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    doctor_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    service_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    service_description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    rate = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    effective_from = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    effective_to = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    updated_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_service_rates", x => x.id);
                    table.ForeignKey(
                        name: "FK_doctor_service_rates_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_doctor_id",
                table: "doctor_service_rates",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_service_name",
                table: "doctor_service_rates",
                column: "service_name");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_doctor_id_service_name",
                table: "doctor_service_rates",
                columns: new[] { "doctor_id", "service_name" });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_is_active",
                table: "doctor_service_rates",
                column: "is_active");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "doctor_service_rates");
        }
    }
}
