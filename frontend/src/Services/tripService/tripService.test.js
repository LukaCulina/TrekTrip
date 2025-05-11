import tripService from './tripService'; // Adjust the import path as per your file structure
import axiosInstance from '../../axios/axiosInstance'; // Adjust the import path as per your file structure

// Mock axiosInstance
jest.mock('../../axios/axiosInstance');

describe('tripService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockTrips = [
    { id: 1, name: 'Trip 1' },
    { id: 2, name: 'Trip 2' },
  ];

  const mockTrip = { id: 1, name: 'Updated Trip 1' };

  // Test getAllTrips
  it('should fetch all trips', async () => {
    const response = { data: mockTrips };
    axiosInstance.get.mockResolvedValue(response);

    const result = await tripService.getAllTrips();

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.get).toHaveBeenCalledWith('/trip/all');
  });

  // Test getTripById
  it('should fetch a trip by id', async () => {
    const id = 1;
    const response = { data: mockTrip };
    axiosInstance.get.mockResolvedValue(response);

    const result = await tripService.getTripById(id);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.get).toHaveBeenCalledWith(`/trip/${id}`);
  });

  // Test createTrip
  it('should create a new trip', async () => {
    const newTrip = { name: 'New Trip' };
    const response = { data: mockTrip };
    axiosInstance.post.mockResolvedValue(response);

    const result = await tripService.createTrip(newTrip);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    expect(axiosInstance.post).toHaveBeenCalledWith('/trip', newTrip);
  });

  // Test updateTrip
  it('should update an existing trip', async () => {
    const id = 1;
    const updatedTrip = { ...mockTrip };
    const response = { data: updatedTrip };
    axiosInstance.put.mockResolvedValue(response);

    const result = await tripService.updateTrip(id, updatedTrip);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.put).toHaveBeenCalledTimes(1);
    expect(axiosInstance.put).toHaveBeenCalledWith(`/trip/${id}`, updatedTrip);
  });

  // Test deleteTrip
  it('should delete a trip', async () => {
    const id = 1;
    const response = { status: 200 };
    axiosInstance.delete.mockResolvedValue(response);

    const result = await tripService.deleteTrip(id);

    expect(result).toEqual(response); // Check if result matches expected response
    expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith(`/trip/${id}`);
  });
});
