using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Application.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _context;

    public DoctorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Doctor?> GetByIdAsync(string id)
    {
        return await _context.Doctors
            .Include(d => d.Department)
            .Where(d => !d.IsDeleted)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IList<Doctor>> GetAllAsync()
    {
        return await _context.Doctors
            .Include(d => d.Department)
            .Where(d => !d.IsDeleted)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<IList<Doctor>> GetByDepartmentIdAsync(string departmentId)
    {
        return await _context.Doctors
            .Include(d => d.Department)
            .Where(d => d.DepartmentId == departmentId && !d.IsDeleted)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<Doctor> CreateAsync(Doctor doctor)
    {
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();
        return doctor;
    }

    public async Task UpdateAsync(Doctor doctor)
    {
        _context.Doctors.Update(doctor);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var doctor = await GetByIdAsync(id);
        if (doctor != null)
        {
            doctor.IsDeleted = true;
            await UpdateAsync(doctor);
        }
    }
}
