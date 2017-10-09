// @flow
import type {Store} from 'redux';

import {setChapterText} from '../actions';
import type {Reference} from './model';
import {chapterIndex, before, after, CHAPTER_COUNT} from './model';
import type {State} from '../reducer';

const BASE = new URL('http://www.esvapi.org/v2/rest/passageQuery?key=IP');
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const chapterUrl = (reference: Reference): URL => {
  const url = new URL('', BASE);
  url.searchParams.set('passage', `${reference.book} ${reference.chapter}`);
  return url;
}

export const lookup = (url: URL | Reference): Promise<Response> => {
  if (!(url instanceof URL))
    url = chapterUrl(url);

  if (window.location.host === 'localhost:3000')
    return fetch(url.pathname + url.search);
  else
    return fetch(CORS_PROXY + url.toString());
}

const fetchChapter = (store: Store, reference: Reference): Promise<string> =>
  lookup(reference)
      .then(response => response.text())
      .then(text => store.dispatch(setChapterText(reference, text)));

const indexIsCached = (state: State, index: number): boolean =>
  state.chapters[index] != null;

export const updateStoreWithPassageText = (store: Store, reference: Reference) => {
  const state = store.getState();
  const index = chapterIndex(reference);

  if (!indexIsCached(state, index))
    fetchChapter(store, reference);

  if (index > 0 && !indexIsCached(state, index - 1))
    fetchChapter(store, before(reference));

  if (index < CHAPTER_COUNT && !indexIsCached(state, index + 1))
    fetchChapter(store, after(reference));
}
