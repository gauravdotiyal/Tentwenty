import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { TimesheetEntry, TimesheetStatus } from '@/types';
import Link from 'next/link';

const REQUIRED_HOURS = 40;

const calculateStatus = (totalHours: number): TimesheetStatus => {
  if (totalHours === 0) return 'MISSING';
  if (totalHours < REQUIRED_HOURS) return 'INCOMPLETE';
  return 'COMPLETED';
};

// Initial mock data
const initialTimesheets = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-01-01',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    totalHours: 40,
    status: calculateStatus(40) as TimesheetStatus,
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
    status: calculateStatus(42) as TimesheetStatus,
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
    status: calculateStatus(35) as TimesheetStatus,
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
    status: calculateStatus(40) as TimesheetStatus,
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
    status: calculateStatus(0) as TimesheetStatus,
    tasks: []
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Function to initialize local storage with mock data if empty
  const initializeLocalStorage = () => {
    const storedData = localStorage.getItem('timesheets');
    if (!storedData) {
      localStorage.setItem('timesheets', JSON.stringify(initialTimesheets));
      return initialTimesheets;
    }
    return JSON.parse(storedData);
  };

  const fetchTimesheets = () => {
    try {
      setLoading(true);
      setError('');
      
      // Get data from local storage
      const timesheetData = initializeLocalStorage();
      setTimesheets(timesheetData);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setError('Failed to fetch timesheet entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  // Fetch timesheets when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchTimesheets();
    }
  }, [status]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'timesheets' && e.newValue) {
        const updatedTimesheets = JSON.parse(e.newValue);
        setTimesheets(updatedTimesheets);
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Add event listener for custom storage event
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail) {
        setTimesheets(e.detail);
      } else {
        fetchTimesheets();
      }
    };

    window.addEventListener('timesheetUpdate', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('timesheetUpdate', handleCustomStorageChange as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace('/auth/login');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const getStatusBadgeStyle = (status: TimesheetStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700';
      case 'INCOMPLETE':
        return 'bg-yellow-50 text-yellow-700';
      case 'MISSING':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDateRange = (date: string) => {
    try {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4); // Assuming 5-day range

      const formatOptions: Intl.DateTimeFormatOptions = { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      const startStr = startDate.getDate();
      const endStr = endDate.toLocaleDateString('en-US', formatOptions);
      
      return `${startStr} - ${endStr}`;
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Invalid Date Range';
    }
  };

  const getActionType = (status: TimesheetStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'View';
      case 'INCOMPLETE':
        return 'Update';
      case 'MISSING':
        return 'Create';
      default:
        return 'View';
    }
  };

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
                <span>{session.user?.name}</span>
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Your Timesheets</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timesheets.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.weekNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateRange(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.totalHours} / {REQUIRED_HOURS}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(entry.status as TimesheetStatus)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/dashboard/timesheet/${entry.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {getActionType(entry.status as TimesheetStatus)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-500">
          © 2024 tentwenty. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 