import axios from 'axios';

const host = process.env.NEXT_PUBLIC_API_HOST;

export const axiosWithAuth = (token: string) => {
  return axios.create({
    baseURL: host,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};


export const axiosWithoutAuth = () => {
  return axios.create({
    baseURL: host,
    headers: {
      'Content-Type': 'application/json'
      // Authorization: `Bearer ${token}`
    }
  });
};
