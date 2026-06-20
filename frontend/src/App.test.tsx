import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the EduLedger heading', () => {
    render(<App />);
    expect(screen.getByText('EduLedger')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Credentials')).toBeInTheDocument();
  });
});
