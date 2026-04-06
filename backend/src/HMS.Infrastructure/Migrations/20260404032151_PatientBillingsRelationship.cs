using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PatientBillingsRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "departments",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    updated_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_departments", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "hospital_settings",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    hospital_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    address_line1 = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    address_line2 = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    city = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    state = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    postal_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    country = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    phone_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    alternate_phone_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    email = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    website = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    gst_number = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    registration_number = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    report_header_tagline = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    report_footer_note = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hospital_settings", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "patients",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    uhid = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    patient_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    dob = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    gender = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    blood_group = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    mobile = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "text", nullable: false),
                    postal_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    photo = table.Column<string>(type: "text", nullable: true),
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
                name: "revenue_rates",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    module = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "OPD"),
                    service_code = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false, defaultValue: ""),
                    display_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false, defaultValue: ""),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    visit_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    rate = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_revenue_rates", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    role = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    department_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    reference_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "doctors",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    specialization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    mobile = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    department_id = table.Column<string>(type: "text", nullable: false),
                    created_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    updated_by = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctors", x => x.id);
                    table.ForeignKey(
                        name: "FK_doctors_departments_department_id",
                        column: x => x.department_id,
                        principalTable: "departments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
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

            migrationBuilder.CreateTable(
                name: "appointments",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    display_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    appointment_no = table.Column<string>(type: "text", nullable: false),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    appointment_date = table.Column<DateTime>(type: "date", nullable: false),
                    start_time = table.Column<TimeSpan>(type: "interval", nullable: false),
                    end_time = table.Column<TimeSpan>(type: "interval", nullable: false),
                    token_number = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false, defaultValue: "Scheduled"),
                    visit_type = table.Column<string>(type: "text", nullable: false),
                    department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "normal"),
                    notes = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_appointments_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateTable(
                name: "billings",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    bill_number = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    patient_id = table.Column<long>(type: "bigint", nullable: false),
                    appointment_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    visit_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    doctor_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    date = table.Column<DateTime>(type: "date", nullable: false),
                    subtotal = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    discount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    tax = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    net_amount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    paid_amount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    payment_mode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    transaction_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_billings", x => x.id);
                    table.ForeignKey(
                        name: "FK_billings_appointments_appointment_id",
                        column: x => x.appointment_id,
                        principalTable: "appointments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_billings_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_billings_patients_patient_id",
                        column: x => x.patient_id,
                        principalTable: "patients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "billing_items",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    billing_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    service_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    qty = table.Column<int>(type: "integer", nullable: false),
                    rate = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_billing_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_billing_items_billings_billing_id",
                        column: x => x.billing_id,
                        principalTable: "billings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_reminders_appointment_id",
                table: "appointment_reminders",
                column: "appointment_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_appointment_no",
                table: "appointments",
                column: "appointment_no",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointments_display_id",
                table: "appointments",
                column: "display_id",
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
                name: "IX_billing_items_billing_id",
                table: "billing_items",
                column: "billing_id");

            migrationBuilder.CreateIndex(
                name: "IX_billings_appointment_id",
                table: "billings",
                column: "appointment_id");

            migrationBuilder.CreateIndex(
                name: "IX_billings_bill_number",
                table: "billings",
                column: "bill_number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_billings_date",
                table: "billings",
                column: "date");

            migrationBuilder.CreateIndex(
                name: "IX_billings_doctor_id",
                table: "billings",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_billings_patient_id",
                table: "billings",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_departments_name",
                table: "departments",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_doctor_id",
                table: "doctor_service_rates",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_doctor_id_service_name",
                table: "doctor_service_rates",
                columns: new[] { "doctor_id", "service_name" });

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_is_active",
                table: "doctor_service_rates",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_service_rates_service_name",
                table: "doctor_service_rates",
                column: "service_name");

            migrationBuilder.CreateIndex(
                name: "IX_doctors_department_id",
                table: "doctors",
                column: "department_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctors_mobile",
                table: "doctors",
                column: "mobile",
                unique: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_revenue_rates_visit_type",
                table: "revenue_rates",
                column: "visit_type",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_is_active",
                table: "users",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "IX_users_role",
                table: "users",
                column: "role");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointment_reminders");

            migrationBuilder.DropTable(
                name: "attenders");

            migrationBuilder.DropTable(
                name: "billing_items");

            migrationBuilder.DropTable(
                name: "doctor_service_rates");

            migrationBuilder.DropTable(
                name: "emergency_contacts");

            migrationBuilder.DropTable(
                name: "hospital_settings");

            migrationBuilder.DropTable(
                name: "referrals");

            migrationBuilder.DropTable(
                name: "revenue_rates");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "billings");

            migrationBuilder.DropTable(
                name: "appointments");

            migrationBuilder.DropTable(
                name: "doctors");

            migrationBuilder.DropTable(
                name: "patients");

            migrationBuilder.DropTable(
                name: "departments");
        }
    }
}
