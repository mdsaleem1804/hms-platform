using HMS.Application.Repositories;
using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _dbContext;

    public AppointmentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Appointment>> GetAllAsync()
    {
        return await BaseQuery()
            .OrderByDescending(appointment => appointment.AppointmentDate)
            .ThenByDescending(appointment => appointment.StartTime)
            .ToListAsync();
    }

    public async Task<Appointment?> GetByIdAsync(string id)
    {
        return await BaseQuery().FirstOrDefaultAsync(appointment => appointment.Id == id);
    }

    public async Task<Appointment?> GetByDisplayIdAsync(int displayId)
    {
        return await BaseQuery().FirstOrDefaultAsync(appointment => appointment.DisplayId == displayId);
    }

    public async Task<Appointment> CreateAsync(Appointment appointment)
    {
        _dbContext.Appointments.Add(appointment);
        await _dbContext.SaveChangesAsync();
        // Use the DB-generated display_id for a collision-free appointment number
        appointment.AppointmentNo = $"APT-{appointment.AppointmentDate:yyyyMMdd}-{appointment.DisplayId:D4}";
        await _dbContext.SaveChangesAsync();
        return await GetByIdAsync(appointment.Id) ?? appointment;
    }

    public async Task<Appointment> UpdateAsync(Appointment appointment)
    {
        appointment.UpdatedAt = DateTime.UtcNow;
        _dbContext.Appointments.Update(appointment);
        await _dbContext.SaveChangesAsync();
        return await GetByIdAsync(appointment.Id) ?? appointment;
    }

    public async Task DeleteAsync(string id)
    {
        var appointment = await GetByIdAsync(id);
        if (appointment == null)
        {
            return;
        }

        appointment.IsDeleted = true;
        appointment.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> GetDailyAppointmentCountAsync(DateTime appointmentDate)
    {
        return await _dbContext.Appointments
            .Where(appointment => !appointment.IsDeleted && appointment.AppointmentDate.Date == appointmentDate.Date)
            .CountAsync();
    }

    public async Task<int> GetNextTokenNumberAsync(string doctorId, DateTime appointmentDate)
    {
        var maxToken = await _dbContext.Appointments
            .Where(appointment =>
                !appointment.IsDeleted &&
                appointment.DoctorId == doctorId &&
                appointment.AppointmentDate.Date == appointmentDate.Date)
            .Select(appointment => (int?)appointment.TokenNumber)
            .MaxAsync();

        return (maxToken ?? 0) + 1;
    }

    public async Task<bool> HasConflictAsync(string doctorId, DateTime appointmentDate, TimeSpan startTime, TimeSpan endTime, string? excludeAppointmentId = null)
    {
        return await _dbContext.Appointments.AnyAsync(appointment =>
            !appointment.IsDeleted &&
            appointment.DoctorId == doctorId &&
            appointment.AppointmentDate.Date == appointmentDate.Date &&
            appointment.Id != excludeAppointmentId &&
            appointment.StartTime < endTime &&
            startTime < appointment.EndTime);
    }

    private IQueryable<Appointment> BaseQuery()
    {
        return _dbContext.Appointments
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.Doctor)
                .ThenInclude(doctor => doctor!.Department)
            .Include(appointment => appointment.Reminders)
            .Where(appointment => !appointment.IsDeleted);
    }
}