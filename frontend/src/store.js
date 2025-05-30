import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    removeChannel: (state, action) => {
      const removedId = typeof action.payload === 'object' ? action.payload.id : action.payload;
      state.channels = state.channels.filter((ch) => ch.id !== removedId);
      state.messages = state.messages.filter((msg) => msg.channelId !== removedId);
      const defaultChannel = state.channels.find((ch) => !ch.removable) || state.channels[0];
      state.currentChannelId = defaultChannel ? defaultChannel.id : null;
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const ch = state.channels.find((c) => c.id === id);
      if (ch) ch.name = name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
        state.currentChannelId = action.payload.currentChannelId
          ?? (action.payload.channels.find(ch => ch.name === 'general' || ch.name === 'General')?.id
          ?? (action.payload.channels[0]?.id || null));
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentChannel, addMessage, addChannel, removeChannel, renameChannel,
} = chatSlice.actions;

const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export default store;