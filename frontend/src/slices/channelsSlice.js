import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createSlice } from '@reduxjs/toolkit'
import apiRoutes from '../routes.js'

const setTokenHeader = (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};


export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiRoutes.channels(), prepareHeaders: setTokenHeader }),
  endpoints: builder => ({
    getChannels: builder.query({
      query: () => '',
      providesTags: ['Channels'],
    }),
    addChannel: builder.mutation({
      query: name => ({
        url: '',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    deleteChannel: builder.mutation({
      query: id => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
  }),
})

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: { selectedChannelId: null },
  reducers: {
    selectChannel: (state, action) => { state.selectedChannelId = String(action.payload) },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(channelsApi.endpoints.getChannels.matchFulfilled, (state, { payload }) => {
        if (!state.selectedChannelId && payload.length > 0) {
          state.selectedChannelId = String(payload[0].id)
        }
      })
      .addMatcher(channelsApi.endpoints.deleteChannel.matchFulfilled, (state, { payload }, action) => {
        if (String(payload.id) === String(state.selectedChannelId)) {
          state.selectedChannelId = null
        }
      })
      .addMatcher(channelsApi.endpoints.addChannel.matchFulfilled, (state, { payload }) => {
        state.selectedChannelId = String(payload.id)
      })
  },
})

export const { actions } = channelsSlice
export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useDeleteChannelMutation,
  useRenameChannelMutation,
} = channelsApi
