import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element with a placeholder', () => {
    render(<Input placeholder="Test placeholder" />);

    const inputElement = screen.getByPlaceholderText('Test placeholder');
    expect(inputElement).toBeInTheDocument();
  });
});
