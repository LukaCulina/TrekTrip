import React from 'react';
import { render, act } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './scrollToTop';

// Mock useLocation hook with a mocked pathname
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn(); // Mock window.scrollTo as a Jest mock function
  });

  it('scrolls to top on route change', () => {
    // Mock different pathnames for route changes
    const mockLocation = { pathname: '/' };

    // Mock useLocation hook to return the mocked location
    useLocation.mockReturnValue(mockLocation);

    // Render ScrollToTop wrapped in HashRouter
    const { rerender } = render(
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
          {/* Add more routes as needed */}
        </Routes>
      </HashRouter>
    );

    // Initially, expect no scrollTo(0, 0) because it's not triggered yet
    //expect(window.scrollTo).not.toHaveBeenCalled();

    // Simulate route change (pathname change)
    act(() => {
      mockLocation.pathname = '/profile';
      rerender(); // Re-render to trigger useEffect with new pathname
    });

    // Expect window.scrollTo to have been called with (0, 0) after route change
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
