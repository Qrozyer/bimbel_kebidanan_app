import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  peserta: null,
};

const pesertaSlice = createSlice({
  name: 'peserta',
  initialState,
  reducers: {
    setPeserta: (state, action) => {
      state.peserta = action.payload.peserta;
    },
    clearPeserta: (state) => {
      state.peserta = null;
    },
  },
});

export const { setPeserta, clearPeserta } = pesertaSlice.actions;
export default pesertaSlice.reducer;
