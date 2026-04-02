'use client';

import { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import departmentService, { Department } from '@/services/departmentService';
import { notify } from '@/lib/toast';
import { formatDate, extractApiError } from '@/lib/utils';

interface FormData {
  name: string;
  description: string;
}

const defaultForm: FormData = {
  name: '',
  description: '',
};

export function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await departmentService.getAll();
      setDepartments(data as unknown as Department[]);
    } catch (error) {
      notify.error(extractApiError(error), {
        id: 'departments:load:error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      description: department.description || '',
    });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      if (editingId) {
        // Update existing department
        await departmentService.update(editingId, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        });
        notify.success('Department updated successfully', {
          id: 'departments:update:success',
        });
      } else {
        // Create new department
        await departmentService.create({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        });
        notify.success('Department created successfully', {
          id: 'departments:create:success',
        });
      }

      // Reload departments
      await loadDepartments();
      handleReset();
    } catch (error) {
      const errorMessage = extractApiError(error);
      notify.error(errorMessage, {
        id: editingId
          ? 'departments:update:error'
          : 'departments:create:error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeletingId(id);
      await departmentService.delete(id);
      notify.success('Department deleted successfully', {
        id: 'departments:delete:success',
      });
      await loadDepartments();
    } catch (error) {
      notify.error(extractApiError(error), {
        id: 'departments:delete:error',
      });
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        <Loader2 className="mx-auto inline-block animate-spin" size={24} />
        <p className="mt-2">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {editingId ? 'Edit Department' : 'Add New Department'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g., Cardiology, Orthopedics"
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description)
                    setErrors({ ...errors, description: '' });
                }}
                placeholder="e.g., Specializes in heart and cardiovascular diseases"
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? 'Update Department' : 'Create Department'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setFormData(defaultForm);
            setEditingId(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Department
        </button>
      )}

      {/* Departments Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <AlertCircle className="mb-3 text-gray-400" size={32} />
            <p className="text-gray-600">No departments found</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first department to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {department.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(department.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(department)}
                          disabled={isSaving || isDeleting}
                          className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(department.id)}
                          disabled={isDeleting || deletingId !== null}
                          className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Delete"
                        >
                          {deletingId === department.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
