import axios from 'axios';
import axiosInstance from './axiosInstance';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(() => {
      const instance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: {
            handlers: [],
            use: jest.fn(function (fulfilled, rejected) {
              this.handlers.push({ fulfilled, rejected });
            }),
            eject: jest.fn()
          },
          response: {
            handlers: [],
            use: jest.fn(function (fulfilled, rejected) {
              this.handlers.push({ fulfilled, rejected });
            }),
            eject: jest.fn()
          }
        }
      };
      return instance;
    })
  };
});

describe('Request Interceptor', () => {
  it('attaches the token to the request', async () => {
    const token = 'your-access-token';
    localStorage.setItem('accessToken', token);

    const fulfilledHandler = axiosInstance.interceptors.request.handlers[0].fulfilled;
    const config = await fulfilledHandler({
      headers: {},
    });

    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });
});

const refreshAccessToken = jest.fn().mockResolvedValue('new-access-token');

describe('Response Interceptor', () => {
  it('retries the request on 403 error', async () => {
    localStorage.setItem('accessToken', 'old-access-token');
    localStorage.setItem('authToken', 'refresh-token');

    // Mock the Axios post method for refresh token
    axios.post.mockImplementation((url) => {
      if (url === 'http://localhost:8080/auth/refreshToken') {
        // Simulate refresh token response
        return Promise.resolve({ data: { accessToken: 'new-access-token' } });
      }
      return Promise.resolve({});
    });

    const error = {
      response: {
        status: 403,
      },
      config: {
        headers: {},
      },
    };

    const rejectedHandler = axiosInstance.interceptors.response.handlers[0].rejected;
    const result = await rejectedHandler(error);

    expect(result.config.headers.Authorization).toBe('Bearer new-access-token');
    
    expect(refreshAccessToken).toHaveBeenCalledTimes(1); 
  });
});
