using Microsoft.AspNetCore.Mvc;
using HMS.Application.Features.Departments;
using HMS.Application.Services;

namespace HMS.API.Controllers;

/// <summary>
/// Departments API Controller
/// All exceptions are handled globally by GlobalExceptionMiddleware
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;
    private readonly ILogger<DepartmentsController> _logger;

    public DepartmentsController(IDepartmentService departmentService, ILogger<DepartmentsController> logger)
    {
        _departmentService = departmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get all departments
    /// </summary>
    /// <returns>List of all active departments</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<List<DepartmentSummaryDto>>>> GetAll()
    {
        _logger.LogInformation("Fetching all departments");
        var departments = await _departmentService.GetAllAsync();
        return Ok(ApiResponse<List<DepartmentSummaryDto>>.SuccessResponse(
            departments.ToList(),
            $"{departments.Count} department(s) found"
        ));
    }

    /// <summary>
    /// Get department by ID
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <returns>Department details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DepartmentDto>>> GetById(string id)
    {
        _logger.LogInformation("Fetching department with ID: {DepartmentId}", id);
        var department = await _departmentService.GetByIdAsync(id);
        
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {id} not found");

        return Ok(ApiResponse<DepartmentDto>.SuccessResponse(department, "Department retrieved successfully"));
    }

    /// <summary>
    /// Create a new department
    /// </summary>
    /// <param name="request">Department creation data</param>
    /// <returns>201 Created with department details</returns>
    /// <remarks>
    /// Exceptions are handled by GlobalExceptionMiddleware:
    /// - ArgumentException → 400 Bad Request
    /// - Unhandled exceptions → 500 Internal Server Error
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<DepartmentDto>>> Create([FromBody] CreateDepartmentDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var createdBy = User?.Identity?.Name ?? "System";
        var createdDepartment = await _departmentService.CreateAsync(request, createdBy);

        _logger.LogInformation("Department created successfully with ID: {DepartmentId}", createdDepartment.Id);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdDepartment.Id },
            ApiResponse<DepartmentDto>.SuccessResponse(createdDepartment, "Department created successfully")
        );
    }

    /// <summary>
    /// Update an existing department
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <param name="request">Updated department data</param>
    /// <returns>200 OK with updated department details</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<string>>> Update(string id, [FromBody] CreateDepartmentDto request)
    {
        if (!ModelState.IsValid)
        {
            throw new ArgumentException("Invalid request data");
        }

        var updatedBy = User?.Identity?.Name ?? "System";
        await _departmentService.UpdateAsync(id, request, updatedBy);

        _logger.LogInformation("Department updated successfully with ID: {DepartmentId}", id);

        return Ok(ApiResponse<string>.SuccessResponse("Department updated successfully", "Update completed"));
    }

    /// <summary>
    /// Delete a department
    /// </summary>
    /// <param name="id">Department ID</param>
    /// <returns>204 No Content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(string id)
    {
        await _departmentService.DeleteAsync(id);
        _logger.LogInformation("Department deleted successfully with ID: {DepartmentId}", id);
        return NoContent();
    }
}
