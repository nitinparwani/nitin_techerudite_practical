import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventItem } from '../../types/event';

export type FavoriteState = {
  favoriteIds: Record<string, boolean>;
  items: Record<string, EventItem>;
  touchedIds: Record<string, boolean>;
};

const initialState: FavoriteState = {
  favoriteIds: {},
  items: {},
  touchedIds: {},
};

export const getEventFavoriteKey = (item: EventItem) =>
  `${item.event_id}-${item.event_date_id}`;

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavoriteState: (state, action: PayloadAction<FavoriteState>) => {
      state.favoriteIds = action.payload.favoriteIds;
      state.items = action.payload.items;
      state.touchedIds = action.payload.touchedIds;
    },
    hydrateFavorites: (state, action: PayloadAction<EventItem[]>) => {
      action.payload.forEach(item => {
        const key = getEventFavoriteKey(item);

        if (state.touchedIds[key]) {
          return;
        }

        if (item.isFavorite === 1) {
          state.favoriteIds[key] = true;
          state.items[key] = { ...item, isFavorite: 1 };
        }
      });
    },
    toggleFavorite: (state, action: PayloadAction<EventItem>) => {
      const key = getEventFavoriteKey(action.payload);
      const isFavorite = !!state.favoriteIds[key];

      state.touchedIds[key] = true;

      if (isFavorite) {
        delete state.favoriteIds[key];
        delete state.items[key];
        return;
      }

      state.favoriteIds[key] = true;
      state.items[key] = { ...action.payload, isFavorite: 1 };
    },
  },
});

export const { hydrateFavorites, setFavoriteState, toggleFavorite } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
