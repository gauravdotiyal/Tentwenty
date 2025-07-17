import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const taskSchema = z.object({
  description: z.string()
    .min(3, 'Description must be at least 3 characters')
    .max(100, 'Description must be less than 100 characters'),
  duration: z.string()
    .refine((val) => !isNaN(parseFloat(val)), 'Duration must be a number')
    .refine((val) => parseFloat(val) >= 0.5, 'Duration must be at least 0.5 hours')
    .refine((val) => parseFloat(val) <= 24, 'Duration cannot exceed 24 hours'),
  project: z.string()
    .min(2, 'Project name must be at least 2 characters')
    .max(50, 'Project name must be less than 50 characters'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string; duration: string; project: string }) => void;
  date: string;
  initialData?: {
    description: string;
    duration: number;
    project: string;
  };
}

export default function TimesheetModal({
  isOpen,
  onClose,
  onSubmit,
  date,
  initialData,
}: TimesheetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          description: initialData.description,
          duration: initialData.duration.toString(),
          project: initialData.project,
        }
      : {
          description: '',
          duration: '',
          project: '',
        },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setValue('description', initialData.description);
      setValue('duration', initialData.duration.toString());
      setValue('project', initialData.project);
    } else if (!isOpen) {
      reset({
        description: '',
        duration: '',
        project: '',
      });
    }
  }, [isOpen, initialData, setValue, reset]);

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        description: data.description.trim(),
        duration: data.duration,
        project: data.project.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {initialData ? 'Edit Task' : 'Add New Task'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="description"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.description ? 'border-red-300' : ''
                      }`}
                      placeholder="What did you work on?"
                      {...register('description')}
                      aria-invalid={errors.description ? 'true' : 'false'}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (hours)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="duration"
                      step="0.5"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.duration ? 'border-red-300' : ''
                      }`}
                      {...register('duration')}
                      aria-invalid={errors.duration ? 'true' : 'false'}
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                    Project
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="project"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.project ? 'border-red-300' : ''
                      }`}
                      placeholder="Project name"
                      {...register('project')}
                      aria-invalid={errors.project ? 'true' : 'false'}
                    />
                    {errors.project && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.project.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : initialData ? (
                      'Save Changes'
                    ) : (
                      'Add Task'
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 