/**
 * adminStore.js — now just re-exports API functions for the public site.
 * All data comes from the Express + MongoDB backend.
 */
export {
  apiGetEvents     as getEventsAsync,
  apiGetEvent      as getEventAsync,
  apiGetCategories as getCategoriesAsync,
  apiGetCategory   as getCategoryAsync,
  apiGetConfig     as getConfigAsync,
} from '../api/client'
