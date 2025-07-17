import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import TimesheetModal from '@/components/TimesheetModal';
import { TimesheetStatus } from '@/types';

interface Task {
  id: string;
  date: string;
  description: string;
  duration: number;
  project: string;
}

interface Timesheet {
  id: string;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  tasks: Task[];
  totalHours: number;
}

interface GroupedTasks {
  [date: string]: Task[];
}

interface TimesheetEntry {
  id: string;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
  tasks: Task[];
}

const REQUIRED_HOURS = 40;

// Initial mock data
const initialTimesheets = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    totalHours: 40,
    status: 'COMPLETED' as TimesheetStatus,
    tasks: [
      {
        id: '1',
        date: '2024-01-01',
        description: 'Frontend Development',
        duration: 8,
        project: 'Project A'
      },
      {
        id: '2',
        date: '2024-01-02',
        description: 'API Integration',
        duration: 8,
        project: 'Project A'
      },
      {
        id: '3',
        date: '2024-01-03',
        description: 'Testing & Bug Fixes',
        duration: 8,
        project: 'Project A'
      },
      {
        id: '4',
        date: '2024-01-04',
        description: 'Documentation',
        duration: 8,
        project: 'Project A'
      },
      {
        id: '5',
        date: '2024-01-05',
        description: 'Code Review & Deployment',
        duration: 8,
        project: 'Project A'
      }
    ]
  },
  {
    id: '2',
    weekNumber: 2,
    date: '2024-01-08',
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    totalHours: 42,
    status: 'COMPLETED' as TimesheetStatus,
    tasks: [
      {
        id: '6',
        date: '2024-01-08',
        description: 'Feature Planning',
        duration: 9,
        project: 'Project B'
      },
      {
        id: '7',
        date: '2024-01-09',
        description: 'Implementation',
        duration: 9,
        project: 'Project B'
      },
      {
        id: '8',
        date: '2024-01-10',
        description: 'Testing',
        duration: 8,
        project: 'Project B'
      },
      {
        id: '9',
        date: '2024-01-11',
        description: 'Documentation',
        duration: 8,
        project: 'Project B'
      },
      {
        id: '10',
        date: '2024-01-12',
        description: 'Code Review',
        duration: 8,
        project: 'Project B'
      }
    ]
  },
  {
    id: '3',
    weekNumber: 3,
    date: '2024-01-15',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    totalHours: 35,
    status: 'INCOMPLETE' as TimesheetStatus,
    tasks: [
      {
        id: '11',
        date: '2024-01-15',
        description: 'Sprint Planning',
        duration: 7,
        project: 'Project C'
      },
      {
        id: '12',
        date: '2024-01-16',
        description: 'Development',
        duration: 7,
        project: 'Project C'
      },
      {
        id: '13',
        date: '2024-01-17',
        description: 'Testing',
        duration: 7,
        project: 'Project C'
      },
      {
        id: '14',
        date: '2024-01-18',
        description: 'Bug Fixes',
        duration: 7,
        project: 'Project C'
      },
      {
        id: '15',
        date: '2024-01-19',
        description: 'Documentation',
        duration: 7,
        project: 'Project C'
      }
    ]
  },
  {
    id: '4',
    weekNumber: 4,
    date: '2024-01-22',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    totalHours: 40,
    status: 'COMPLETED' as TimesheetStatus,
    tasks: [
      {
        id: '16',
        date: '2024-01-22',
        description: 'Feature Development',
        duration: 8,
        project: 'Project D'
      },
      {
        id: '17',
        date: '2024-01-23',
        description: 'Integration',
        duration: 8,
        project: 'Project D'
      },
      {
        id: '18',
        date: '2024-01-24',
        description: 'Testing',
        duration: 8,
        project: 'Project D'
      },
      {
        id: '19',
        date: '2024-01-25',
        description: 'Documentation',
        duration: 8,
        project: 'Project D'
      },
      {
        id: '20',
        date: '2024-01-26',
        description: 'Review & Deploy',
        duration: 8,
        project: 'Project D'
      }
    ]
  },
  {
    id: '5',
    weekNumber: 5,
    date: '2024-01-29',
    startDate: '2024-01-29',
    endDate: '2024-02-02',
    totalHours: 0,
    status: 'MISSING' as TimesheetStatus,
    tasks: []
  }
];

// Function to update timesheet in local storage
const updateTimesheetInStorage = (updatedTimesheet: Timesheet) => {
  try {
    const storedData = localStorage.getItem('timesheets');
    if (!storedData) return;

    const timesheets = JSON.parse(storedData);
    const updatedTimesheets = timesheets.map((t: TimesheetEntry) => {
      if (t.id === updatedTimesheet.id) {
        return {
          ...t,
          totalHours: updatedTimesheet.totalHours,
          status: updatedTimesheet.status,
          tasks: updatedTimesheet.tasks
        };
      }
      return t;
    });

    localStorage.setItem('timesheets', JSON.stringify(updatedTimesheets));
    
    // Dispatch custom event for the current window
    const event = new CustomEvent('timesheetUpdate', { detail: updatedTimesheets });
    window.dispatchEvent(event);
    
    // Dispatch storage event for other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'timesheets',
      newValue: JSON.stringify(updatedTimesheets)
    }));
  } catch (error) {
    console.error('Error updating timesheet in storage:', error);
  }
};

interface TimesheetDetailPageProps {
  id: string;
}

export default function TimesheetDetailPage({ id: initialId }: TimesheetDetailPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  // Add isReady check from router
  useEffect(() => {
    if (status === 'authenticated') {
      fetchTimesheet();
    }
  }, [status]);

  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Generate array of dates between start and end date
  const generateDateRange = (startDate: string, endDate: string): string[] => {
    try {
      const dates: string[] = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(currentDate.getTime()) || isNaN(end.getTime())) {
        return [];
      }

      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    } catch (error) {
      console.error('Error generating date range:', error);
      return [];
    }
  };

  const calculateStatus = (totalHours: number): TimesheetStatus => {
    if (totalHours === 0) return 'MISSING';
    if (totalHours < REQUIRED_HOURS) return 'INCOMPLETE';
    return 'COMPLETED';
  };

  const calculateTotalHours = (tasks: Task[]): number => {
    return tasks.reduce((total, task) => total + task.duration, 0);
  };

  const updateTimesheetStatus = (tasks: Task[]) => {
    const totalHours = calculateTotalHours(tasks);
    const newStatus = calculateStatus(totalHours);

    setTimesheet(prev => {
      if (!prev) return prev;
      const updatedTimesheet = {
        ...prev,
        status: newStatus,
        totalHours: totalHours
      };
      
      // Sync with local storage
      updateTimesheetInStorage(updatedTimesheet);
      
      return updatedTimesheet;
    });
  };

  const fetchTimesheet = async () => {
    try {
      setLoading(true);
      if (!initialId) {
        setError('Invalid timesheet ID');
        return;
      }

      // Initialize localStorage with mock data if empty
      const storedData = localStorage.getItem('timesheets');
      const timesheets = storedData ? JSON.parse(storedData) : initialTimesheets;
      
      if (!storedData) {
        localStorage.setItem('timesheets', JSON.stringify(timesheets));
      }

      // Find the timesheet
      const currentTimesheet = timesheets.find((t: TimesheetEntry) => t.id === initialId);
      
      if (!currentTimesheet) {
        setError('Timesheet not found');
        return;
      }

      // Validate dates
      const startDate = new Date(currentTimesheet.startDate);
      const endDate = new Date(currentTimesheet.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Invalid timesheet dates');
        return;
      }

      // Ensure tasks have valid dates
      const validTasks = currentTimesheet.tasks.map(task => ({
        ...task,
        date: new Date(task.date).toISOString().split('T')[0]
      }));

      const validatedTimesheet = {
        ...currentTimesheet,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        tasks: validTasks
      };

      setTimesheet(validatedTimesheet);
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      setError('Failed to fetch timesheet');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const groupTasksByDate = (tasks: Task[]): GroupedTasks => {
    // Handle undefined or null tasks
    if (!tasks) {
      return {};
    }

    const grouped = tasks.reduce((groups, task) => {
      const date = task.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {} as GroupedTasks);

    // Add empty arrays for dates without tasks
    if (timesheet) {
      const allDates = generateDateRange(timesheet.startDate, timesheet.endDate);
      allDates.forEach(date => {
        if (!grouped[date]) {
          grouped[date] = [];
        }
      });
    }

    return grouped;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid Date Range';
      }

      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
      })}`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Invalid Date Range';
    }
  };

  const handleAddTask = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (taskData: { description: string; duration: string; project: string }) => {
    if (!timesheet) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      description: taskData.description,
      duration: parseFloat(taskData.duration),
      project: taskData.project
    };

    const updatedTasks = [...timesheet.tasks, newTask];
    const totalHours = calculateTotalHours(updatedTasks);
    const status = calculateStatus(totalHours);

    const updatedTimesheet = {
      ...timesheet,
      tasks: updatedTasks,
      totalHours,
      status
    };

    setTimesheet(updatedTimesheet);
    updateTimesheetInStorage(updatedTimesheet);
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
    setActiveTaskMenu(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!timesheet) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = timesheet.tasks.filter(task => task.id !== taskId);
      const totalHours = calculateTotalHours(updatedTasks);
      const status = calculateStatus(totalHours);

      const updatedTimesheet = {
        ...timesheet,
        tasks: updatedTasks,
        totalHours,
        status
      };

      setTimesheet(updatedTimesheet);
      updateTimesheetInStorage(updatedTimesheet);
    }
    setActiveTaskMenu(null);
  };

  const handleSubmitEditTask = (taskData: { description: string; duration: string; project: string }) => {
    if (!timesheet || !taskToEdit) return;

    const updatedTasks = timesheet.tasks.map(task =>
      task.id === taskToEdit.id
        ? {
            ...task,
            description: taskData.description,
            duration: parseFloat(taskData.duration),
            project: taskData.project
          }
        : task
    );

    const totalHours = calculateTotalHours(updatedTasks);
    const status = calculateStatus(totalHours);

    const updatedTimesheet = {
      ...timesheet,
      tasks: updatedTasks,
      totalHours,
      status
    };

    setTimesheet(updatedTimesheet);
    updateTimesheetInStorage(updatedTimesheet);
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeTaskMenu && !(event.target as Element).closest('.task-menu')) {
        setActiveTaskMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTaskMenu]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Timesheet not found</div>
      </div>
    );
  }

  const groupedTasks = groupTasksByDate(timesheet.tasks || []);
  const dateRange = formatDateRange(timesheet.startDate, timesheet.endDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">ticktock</h1>
              <Link href="/dashboard" className="text-gray-900 text-sm font-medium">
                Timesheets
              </Link>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900"
              >
                <span>{session?.user?.name}</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">This week's timesheet</h2>
                <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm text-gray-600">{timesheet?.totalHours || 0}/40 hrs</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-orange-500 rounded-full" 
                      style={{ 
                        width: `${Math.min((timesheet?.totalHours || 0) / 40 * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedTasks)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, tasks]) => (
                  <div key={date} className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{task.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{task.duration} hrs</span>
                              <span className="text-sm text-blue-600">{task.project}</span>
                            </div>
                            <div className="relative task-menu">
                              <button 
                                className="text-gray-400 hover:text-gray-600 p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id);
                                }}
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                              {activeTaskMenu === task.id && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTask(date)}
                        className="w-full text-left py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 hover:bg-blue-50 rounded-md px-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add new task</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-500">
          © 2024 tentwenty. All rights reserved.
        </div>
      </footer>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        date={selectedDate}
      />

      <TimesheetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleSubmitEditTask}
        date={taskToEdit?.date || ''}
        initialData={taskToEdit ? {
          description: taskToEdit.description,
          duration: taskToEdit.duration,
          project: taskToEdit.project
        } : undefined}
      />
    </div>
  );
} 

export async function getServerSideProps(context) {
  const { id } = context.params;

  // We're not doing any server-side data fetching since we use localStorage
  // But we need to return the id so it's available on the client
  return {
    props: {
      id: id || null,
    },
  };
} 