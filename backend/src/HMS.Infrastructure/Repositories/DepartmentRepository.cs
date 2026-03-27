using HMS.Domain.Entities;
using HMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HMS.Application.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;

    public DepartmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Department?> GetByIdAsync(string id)
    {
        return await _context.Departments
            .Where(d => !d.IsDeleted)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<IList<Department>> GetAllAsync()
    {
        return await _context.Departments
            .Where(d => !d.IsDeleted)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<Department> CreateAsync(Department department)
    {
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return department;
    }

    public async Task UpdateAsync(Department department)
    {
        _context.Departments.Update(department);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(string id)
    {
        var department = await GetByIdAsync(id);
        if (department != null)
        {
            department.IsDeleted = true;
            await UpdateAsync(department);
        }
    }
}
