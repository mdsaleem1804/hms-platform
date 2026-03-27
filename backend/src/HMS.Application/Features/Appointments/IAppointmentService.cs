namespace HMS.Application.Features.Appointments;

public interface IAppointmentService
{
    Task<List<AppointmentDto>> GetAllAppointmentsAsync();
    Task<AppointmentDto?> GetAppointmentByIdAsync(string id);
    Task<AppointmentDto?> GetAppointmentByDisplayIdAsync(int displayId);
    Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto request);
    Task<AppointmentDto> UpdateAppointmentAsync(string id, UpdateAppointmentDto request);
    Task DeleteAppointmentAsync(string id);
}