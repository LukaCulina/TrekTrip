import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Trips from './Trips';
import tripService from '../../Services/tripService/tripService';
import countryService from '../../Services/countryService/countryService';

jest.mock('../../Services/tripService/tripService');
jest.mock('../../Services/countryService/countryService');
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) =>
            key === 'months'
                ? [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                  ]
                : key,
    }),
}));

describe('Trips Component', () => {
    beforeEach(() => {
        tripService.getAllTrips.mockResolvedValue({
            data: [
                {
                    id: 1,
                    title: 'Trip to Country1',
                    description: 'A nice trip',
                    lengthInDays: 7,
                    price: 1000,
                    tripMonth: 'January',
                    locations: [{ country: { name: 'Country1' } }],
                    ratings: [3.9, 4.2, 4],
                },
                {
                    id: 2,
                    title: 'Trip to Country2',
                    description: 'Another nice trip',
                    lengthInDays: 10,
                    price: 1500,
                    tripMonth: 'February',
                    locations: [{ country: { name: 'Country2' } }],
                    ratings: [4.5, 5, 4.8],
                },
            ],
        });

        countryService.getAllCountries.mockResolvedValue({
            data: [
                { id: 1, name: 'Country1' },
                { id: 2, name: 'Country2' },
            ],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('displays error message when trips fetch fails', async () => {
        const errorMessage = 'Failed to fetch trips. Please try again later.';
        tripService.getAllTrips.mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
        });
    });

    it('renders trips without filters applied', async () => {
        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText(/Trip to Country1/i)).toBeInTheDocument();
            expect(screen.queryByText(/Trip to Country2/i)).toBeInTheDocument();
        });
    });

    it('applies country filter correctly', async () => {
        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );

        await waitFor(() => {
            const countryLabel = screen.getByText(/filters.country/i);
            const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

            fireEvent.mouseDown(countryCombobox);
            fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
        });

        expect(screen.queryAllByText(/Trip to Country1/i)).toHaveLength(1);
        expect(screen.queryByText(/Trip to Country2/i)).not.toBeInTheDocument();
    });

    it('applies month filter correctly', async () => {
        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );

        await waitFor(() => {
            const monthLabel = screen.getByText(/filters.month/i);
            const monthCombobox = monthLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

            fireEvent.mouseDown(monthCombobox);
            fireEvent.click(screen.getByRole('option', { name: 'January' }));
        });

        expect(screen.queryAllByText(/Trip to Country1/i)).toHaveLength(1); // Only January trip should be visible
        expect(screen.queryByText(/Trip to Country2/i)).not.toBeInTheDocument(); // February trip should not be visible
    });

    it('clears filters correctly', async () => {
        render(
            <MemoryRouter>
                <Trips />
            </MemoryRouter>
        );

        // Apply country filter first
        await waitFor(() => {
            const countryLabel = screen.getByText(/filters.country/i);
            const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

            fireEvent.mouseDown(countryCombobox);
            fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
        });

        // Assert that only Country1 trip is displayed and Country2 trip is not
        expect(screen.queryAllByText(/Trip to Country1/i)).toHaveLength(1);
        expect(screen.queryByText(/Trip to Country2/i)).not.toBeInTheDocument();

        // Clear filters
        fireEvent.click(screen.getByText(/Clear/i));

        // Assert that both Country1 and Country2 trips are displayed again
        await waitFor(() => {
            expect(screen.queryByText(/Trip to Country1/i)).toBeInTheDocument();
            expect(screen.queryByText(/Trip to Country2/i)).toBeInTheDocument();
        });
    });

    it('displays error message when fetching countries fails', async () => {
      const errorMessage = 'Failed to fetch countries. Please try again later.';
      countryService.getAllCountries.mockRejectedValue(new Error(errorMessage));
  
      render(
          <MemoryRouter>
              <Trips />
          </MemoryRouter>
      );
  
      await waitFor(() => {
          expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
  });
  
  /*it('sorts trips by highest rated', async () => {
    render(
        <MemoryRouter>
            <Trips />
        </MemoryRouter>
    );

    // Wait for trips to load
    await waitFor(() => {
        expect(screen.getByText(/Trip to Country1/i)).toBeInTheDocument();
        expect(screen.getByText(/Trip to Country2/i)).toBeInTheDocument();
    });

    // Select "Highest Rated" option from sort criteria dropdown
    const sortDropdown = screen.getByTestId('sort-dropdown');
    fireEvent.change(sortDropdown, { target: { value: 'highestRated' } });

    // Assert that trips are sorted correctly by highest rated
    await waitFor(() => {
        const tripTitles = screen.getAllByText(/Trip to Country/i);
        const ratings = tripTitles.map((title) => {
            const tripTitle = title.textContent;
            if (tripTitle.includes('Country1')) return 4.033; // Average of [3.9, 4.2, 4]
            if (tripTitle.includes('Country2')) return 4.766; // Average of [4.5, 5, 4.8]
            return 0; // Default case if none matched
        });

        // Check if ratings are in descending order
        for (let i = 0; i < ratings.length - 1; i++) {
            expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
        }
    });
});*/


it('sorts trips by longest duration', async () => {
  render(
      <MemoryRouter>
          <Trips />
      </MemoryRouter>
  );

  // Wait for trips to load
  await waitFor(() => {
      expect(screen.getByText(/Trip to Country1/i)).toBeInTheDocument();
      expect(screen.getByText(/Trip to Country2/i)).toBeInTheDocument();
  });

  // Select "Longest" option from sort criteria dropdown
  const sortLabel = screen.getByText(/filters.sort/i);
  const sortCombobox = sortLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

  fireEvent.mouseDown(sortCombobox);
  fireEvent.click(screen.getByRole('option', { name: /filters.longest/i }));

  // Assert that trips are sorted correctly by longest duration
  await waitFor(() => {
      const tripTitles = screen.getAllByText(/Trip to Country/i);
      const durations = tripTitles.map((title) => parseInt(title.textContent.match(/\d+/)[0]));

      // Check if durations are in descending order
      for (let i = 0; i < durations.length - 1; i++) {
          expect(durations[i]).toBeGreaterThanOrEqual(durations[i + 1]);
      }
  });
});

it('sorts trips by shortest duration', async () => {
  render(
      <MemoryRouter>
          <Trips />
      </MemoryRouter>
  );

  // Wait for trips to load
  await waitFor(() => {
      expect(screen.getByText(/Trip to Country1/i)).toBeInTheDocument();
      expect(screen.getByText(/Trip to Country2/i)).toBeInTheDocument();
  });

  // Select "Shortest" option from sort criteria dropdown
  const tripLabel = screen.getByText(/filters.sort/i);
  const tripCombobox = tripLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

  fireEvent.mouseDown(tripCombobox);
  fireEvent.click(screen.getByRole('option', { name: /filters.shortest/i }));
  // Assert that trips are sorted correctly by shortest duration
  await waitFor(() => {
      const tripTitles = screen.getAllByText(/Trip to Country/i);
      const durations = tripTitles.map((title) => parseInt(title.textContent.match(/\d+/)[0]));

      // Check if durations are in ascending order
      for (let i = 0; i < durations.length - 1; i++) {
          expect(durations[i]).toBeLessThanOrEqual(durations[i + 1]);
      }
  });
});


it('sorts trips by most expensive', async () => {
  render(
      <MemoryRouter>
          <Trips />
      </MemoryRouter>
  );

  // Wait for trips to load
  await waitFor(() => {
      expect(screen.getByText(/Trip to Country1/i)).toBeInTheDocument();
      expect(screen.getByText(/Trip to Country2/i)).toBeInTheDocument();
  });

  // Select "Most Expensive" option from sort criteria dropdown
  const tripLabel = screen.getByText(/filters.sort/i);
  const tripCombobox = tripLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

  fireEvent.mouseDown(tripCombobox);
  fireEvent.click(screen.getByRole('option', { name: /filters.mostExpensive/i }));
  // Assert that trips are sorted correctly by most expensive
  await waitFor(() => {
      const tripTitles = screen.getAllByText(/Trip to Country/i);
      const prices = tripTitles.map((title) => parseInt(title.textContent.match(/\d+/)[0]));

      // Check if prices are in descending order
      for (let i = 0; i < prices.length - 1; i++) {
          expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
      }
  });
});

it('sorts trips by least expensive', async () => {
  render(
      <MemoryRouter>
          <Trips />
      </MemoryRouter>
  );

  // Wait for trips to load
  await waitFor(() => {
      expect(screen.getByText(/Trip to Country1/i)).toBeInTheDocument();
      expect(screen.getByText(/Trip to Country2/i)).toBeInTheDocument();
  });

  // Select "Least Expensive" option from sort criteria dropdown
  const tripLabel = screen.getByText(/filters.sort/i);
            const tripCombobox = tripLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

            fireEvent.mouseDown(tripCombobox);
            fireEvent.click(screen.getByRole('option', { name: /filters.leastExpensive/i }));

  // Assert that trips are sorted correctly by least expensive
  await waitFor(() => {
      const tripTitles = screen.getAllByText(/Trip to Country/i);
      const prices = tripTitles.map((title) => parseInt(title.textContent.match(/\d+/)[0]));

      // Check if prices are in ascending order
      for (let i = 0; i < prices.length - 1; i++) {
          expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
  });
});
  // Add similar tests for error handling when fetching trips fails
  
  
  // Add similar tests for other sorting criteria (longest, shortest, mostExpensive, leastExpensive)
  
});
