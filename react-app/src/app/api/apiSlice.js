import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../../features/auth/authSlice';
//setCredentials is the actionCreator that sends the
//payload and sets that token in our redux state (store)

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://technotes-api.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
    /**
     * return from prepareHeaders func
     * this is applied to every request we send
     */
  },
});
//query wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
  //logs for checking
  console.log(args); // request url, method(CRUD),
  // body (json-- {name:"name", email:"name@name.com"})
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);

  // If you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log('sending refresh token');

    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));
      //dispatching set credentials -- spreading in the refresh result data
      //what we expect as our refresh result is data (access token)

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      //if we don't have the data
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.';
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  //baseQuery becomes the key for the object, WithReAuth is the actual value
  tagTypes: ['Note', 'User'],
  endpoints: (builder) => ({}),
});
/**
 * fetchBaseQuery similar to axios
 * fetchBaseQuery is baseurl 'localhost:3500' for development- will change on deployment
 *
 * baseQuery is the foundational query config for making API requests
 * Defining common props e.g. endpoint, headers, or auth details
 *
 * fetchBaseQuery executes the actual HTTP Requests
 * It is usually a wrapper around a network-fetching library used for appending headers, handling auth tokens, and errors. (Modular -- D.R.Y)
 *
 *
 *
 *
 */
