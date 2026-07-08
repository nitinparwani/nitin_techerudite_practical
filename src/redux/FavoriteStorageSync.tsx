import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '.';
import {
  FavoriteState,
  setFavoriteState,
} from './slices/favoriteSlice';

const FAVORITE_STORAGE_KEY = 'favoriteEvents';

const isFavoriteState = (value: unknown): value is FavoriteState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const favoriteState = value as FavoriteState;
  return (
    typeof favoriteState.favoriteIds === 'object' &&
    typeof favoriteState.items === 'object' &&
    typeof favoriteState.touchedIds === 'object'
  );
};

const FavoriteStorageSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favorite = useSelector((state: RootState) => state.favorite);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedValue = await AsyncStorage.getItem(FAVORITE_STORAGE_KEY);

      if (storedValue) {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (isFavoriteState(parsedValue)) {
          dispatch(setFavoriteState(parsedValue));
        }
      }

      hasHydrated.current = true;
    };

    loadFavorites();
  }, [dispatch]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    AsyncStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favorite));
  }, [favorite]);

  return null;
};

export default FavoriteStorageSync;
