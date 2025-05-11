import countryService from './countryService'; // Adjust the import path as per your file structure
import axiosInstance from '../../axios/axiosInstance'; // Adjust the import path as per your file structure

// Mock axiosInstance
jest.mock('../../axios/axiosInstance');

describe('countryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockCountries = [
    { id: 1, name: 'Country 1' },
    { id: 2, name: 'Country 2' },
  ];

  const mockCountry = { id: 1, name: 'Updated Country 1' };

  // Test getAllCountries
  it('should fetch all countries', async () => {
    const response = { data: mockCountries };
    axiosInstance.get.mockResolvedValue(response);

    const result = await countryService.getAllCountries();

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.get).toHaveBeenCalledWith('/country/all');
  });

  // Test getCountryById
  it('should fetch a country by id', async () => {
    const id = 1;
    const response = { data: mockCountry };
    axiosInstance.get.mockResolvedValue(response);

    const result = await countryService.getCountryById(id);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.get).toHaveBeenCalledWith(`/country/${id}`);
  });

  // Test createCountry
  it('should create a new country', async () => {
    const newCountry = { name: 'New Country' };
    const response = { data: mockCountry };
    axiosInstance.post.mockResolvedValue(response);

    const result = await countryService.createCountry(newCountry);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith('/country', newCountry);
  });

  // Test updateCountry
  it('should update an existing country', async () => {
    const id = 1;
    const updatedCountry = { ...mockCountry };
    const response = { data: updatedCountry };
    axiosInstance.put.mockResolvedValue(response);

    const result = await countryService.updateCountry(id, updatedCountry);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.put).toHaveBeenCalledTimes(1);
    expect(axiosInstance.put).toHaveBeenCalledWith(`/country/${id}`, updatedCountry);
  });

  // Test deleteCountry
  it('should delete a country', async () => {
    const id = 1;
    const response = { status: 200 };
    axiosInstance.delete.mockResolvedValue(response);

    const result = await countryService.deleteCountry(id);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/country/${id}`);
  });
});
