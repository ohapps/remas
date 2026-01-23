import React from 'react';
import { render } from './test-utils';
import App from './App';

test('renders loading screen', () => {
  const { getByRole } = render(<App />);
  expect(getByRole('progressbar')).toBeInTheDocument();
});
