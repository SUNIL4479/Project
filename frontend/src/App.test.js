import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders landing page welcome text', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const welcomeText = screen.getByText(/Welcome to Contest Platform/i);
  expect(welcomeText).toBeInTheDocument();
});
