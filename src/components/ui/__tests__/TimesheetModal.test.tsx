import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimesheetModal from '../../TimesheetModal';

describe('TimesheetModal', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    date: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(<TimesheetModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<TimesheetModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows edit mode with initial data', () => {
    const initialData = {
      description: 'Test Task',
      duration: 2,
      project: 'Test Project',
    };
    render(<TimesheetModal {...defaultProps} initialData={initialData} />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TimesheetModal {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 3 characters')).toBeInTheDocument();
      expect(screen.getByText('Duration must be a number')).toBeInTheDocument();
      expect(screen.getByText('Project name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('validates duration constraints', async () => {
    render(<TimesheetModal {...defaultProps} />);
    
    const durationInput = screen.getByLabelText(/duration/i);
    await userEvent.type(durationInput, '0.2');
    
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Duration must be at least 0.5 hours')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<TimesheetModal {...defaultProps} />);
    
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Task');
    await userEvent.type(screen.getByLabelText(/duration/i), '2');
    await userEvent.type(screen.getByLabelText(/project/i), 'Test Project');
    
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Test Task',
        duration: '2',
        project: 'Test Project',
      });
    });
  });

  it('closes modal when cancel button is clicked', () => {
    render(<TimesheetModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<TimesheetModal {...defaultProps} onSubmit={slowSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Task');
    await userEvent.type(screen.getByLabelText(/duration/i), '2');
    await userEvent.type(screen.getByLabelText(/project/i), 'Test Project');
    
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Saving...')).toBeInTheDocument();
  });
}); 