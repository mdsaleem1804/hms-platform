using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class appointment_display_id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS display_id integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class
        WHERE relkind = 'S' AND relname = 'appointments_display_id_seq'
    ) THEN
        CREATE SEQUENCE appointments_display_id_seq;
    END IF;
END
$$;

ALTER SEQUENCE appointments_display_id_seq OWNED BY appointments.display_id;

ALTER TABLE appointments ALTER COLUMN display_id SET DEFAULT nextval('appointments_display_id_seq');

UPDATE appointments
SET display_id = nextval('appointments_display_id_seq')
WHERE display_id IS NULL OR display_id = 0;

ALTER TABLE appointments ALTER COLUMN display_id SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public' AND indexname = 'IX_appointments_display_id'
    ) THEN
        CREATE UNIQUE INDEX ""IX_appointments_display_id"" ON appointments (display_id);
    END IF;
END
$$;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DROP INDEX IF EXISTS ""IX_appointments_display_id"";

ALTER TABLE appointments ALTER COLUMN display_id DROP DEFAULT;
ALTER TABLE appointments DROP COLUMN IF EXISTS display_id;

DROP SEQUENCE IF EXISTS appointments_display_id_seq;
");
        }
    }
}
