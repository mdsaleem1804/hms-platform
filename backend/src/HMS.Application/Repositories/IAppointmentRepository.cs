using HMS.Domain.Entities;

namespace HMS.Application.Repositories;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAllAsync(
        string? search = null,
        string? status = null,
        string? doctorId = null,
        string? departmentId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    Task<Appointment?> GetByIdAsync(string id);
    Task<Appointment?> GetByDisplayIdAsync(int displayId);
    Task<Appointment> CreateAsync(Appointment appointment);
    Task<Appointment> UpdateAsync(Appointment appointment);
    Task DeleteAsync(string id);
    Task<int> GetDailyAppointmentCountAsync(DateTime appointmentDate);
    Task<int> GetNextTokenNumberAsync(string doctorId, DateTime appointmentDate);
    Task<bool> HasConflictAsync(string doctorId, DateTime appointmentDate, TimeSpan startTime, TimeSpan endTime, string? excludeAppointmentId = null);
}