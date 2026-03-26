using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "patients",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    uhid = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    patient_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    dob = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    gender = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    blood_group = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    mobile = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "text", nullable: false),
                    postal_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    photo = table.Column<string>(type: "text", nullable: false),
                    id_proof_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    id_proof_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "ACTIVE"),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patients", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "appointments",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    appointment_no = table.Column<string>(type: "text", nullable: false),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    appointment_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    start_time = table.Column<TimeSpan>(type: "interval", nullable: false),
                    end_time = table.Column<TimeSpan>(type: "interval", nullable: false),
                    token_number = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false, defaultValue: "Scheduled"),
                    visit_type = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_appointments_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "attenders",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    phone = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    address = table.Column<string>(type: "text", nullable: false),
                    id_proof_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    id_proof_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_attenders", x => x.id);
                    table.ForeignKey(
                        name: "FK_attenders_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "emergency_contacts",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    relationship = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    contact_number = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emergency_contacts", x => x.id);
                    table.ForeignKey(
                        name: "FK_emergency_contacts_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "referrals",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    data = table.Column<JsonDocument>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_referrals", x => x.id);
                    table.ForeignKey(
                        name: "FK_referrals_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_appointment_no",
                table: "appointments",
                column: "appointment_no",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_doctor_id_appointment_date",
                table: "appointments",
                columns: new[] { "doctor_id", "appointment_date" });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_patient_id",
                table: "appointments",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_status",
                table: "appointments",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_attenders_patient_id",
                table: "attenders",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_emergency_contacts_patient_id",
                table: "emergency_contacts",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_patients_mobile",
                table: "patients",
                column: "mobile",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_patients_status",
                table: "patients",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_patients_uhid",
                table: "patients",
                column: "uhid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_referrals_patient_id",
                table: "referrals",
                column: "patient_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointments");

            migrationBuilder.DropTable(
                name: "attenders");

            migrationBuilder.DropTable(
                name: "emergency_contacts");

            migrationBuilder.DropTable(
                name: "referrals");

            migrationBuilder.DropTable(
                name: "patients");
        }
    }
}
