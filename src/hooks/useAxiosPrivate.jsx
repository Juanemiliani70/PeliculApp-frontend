import { useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const useAxiosPrivate = () => {
  const { setAuth } = useAuth();

  const axiosAuth = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, response = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(response);
      }
    });
    failedQueue = [];
  };

  useEffect(() => {
    const responseInterceptor = axiosAuth.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(() => axiosAuth(originalRequest));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          return new Promise((resolve, reject) => {
            axiosAuth
              .post('/refresh') 
              .then(() => {
                processQueue(null);
                axiosAuth(originalRequest).then(resolve).catch(reject);
              })
              .catch(err => {
                processQueue(err, null);
                localStorage.removeItem('user'); 
                setAuth(null);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.response.eject(responseInterceptor);
    };
  }, [setAuth]);

  return axiosAuth;
};

export default useAxiosPrivate;
