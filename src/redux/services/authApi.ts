import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EventItem } from '../../types/event';

type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  usr_id: number;
  usr_fname: string;
  usr_lname: string;
  usr_username: string;
  usr_email: string;
  usr_profile?: string;
  usr_profile_img: string;
  role: string;
  [key: string]: unknown;
};

export type LoginSuccessData = {
  user: LoginUser;
  token: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: LoginSuccessData | [];
  [key: string]: unknown;
};

type EventsListingResponse = {
  success: boolean;
  message: string;
  data: {
    events: EventItem[];
    total: number;
  };
};

export const AUTH_STORAGE_KEY = 'authData';

export const getStoredAuthData = async () => {
  const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!authData) {
    return null;
  }

  try {
    return JSON.parse(authData) as LoginSuccessData;
  } catch {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getStoredAuthToken = async () => {
  const authData = await getStoredAuthData();
  return authData?.token ?? null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://techeruditestaging.com/projects/plie-api/public/api',
  prepareHeaders: async headers => {
    const token = await getStoredAuthToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        return {
          url: '/login',
          method: 'POST',
          body: formData,
        };
      },
    }),
    eventsListing: builder.query<EventsListingResponse, void>({
      query: () => ({
        url: '/events-listing',
        method: 'POST',
      }),
    }),
  }),
});

export const { useEventsListingQuery, useLoginMutation } = authApi;
