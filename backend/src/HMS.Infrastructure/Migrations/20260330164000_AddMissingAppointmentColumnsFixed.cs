using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingAppointmentColumnsFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add missing columns to appointments table if they don't exist
            // Note: These columns may already exist, so we use IF NOT EXISTS pattern in raw SQL
            migrationBuilder.Sql(@"
                ALTER TABLE appointments
                ADD COLUMN IF NOT EXISTS department character varying(100) NOT NULL DEFAULT '';
                
                ALTER TABLE appointments
                ADD COLUMN IF NOT EXISTS priority character varying(20) NOT NULL DEFAULT 'normal';
                
                ALTER TABLE appointments
                ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE appointments
                DROP COLUMN IF EXISTS department;
                
                ALTER TABLE appointments
                DROP COLUMN IF EXISTS priority;
                
                ALTER TABLE appointments
                DROP COLUMN IF EXISTS notes;
            ");
        }
    }
}
