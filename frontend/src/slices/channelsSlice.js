import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createSlice } from '@reduxjs/toolkit'
import apiRoutes from '../routes.js'

const setTokenHeader = (headers) => {
  headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return headers
}

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
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/api/resource/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
  }),
})

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: { selectedChannelId: '1' },
  reducers: {
    selectChannel: (state, action) => { state.selectedChannelId = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(channelsApi.endpoints.deleteChannel.matchFulfilled, (state, { payload }) => {
        if (payload.id === state.selectedChannelId) {
          state.selectedChannelId = '1'
        }
      })
      .addMatcher(channelsApi.endpoints.addChannel.matchFulfilled, (state, { payload }) => {
        state.selectedChannelId = payload.id
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
