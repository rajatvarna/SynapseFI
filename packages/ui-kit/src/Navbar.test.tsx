import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the site title and navigation links', () => {
    render(<Navbar />);

    // Check for the site title
    expect(screen.getByText('SynapseFI')).toBeInTheDocument();

    // Check for navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
