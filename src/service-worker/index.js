// @flow
/**
 * Service worker for app-specific logic.
 *
 * In development, this code will run alone as a service worker, and in
 * production this will get appended to the "sw-precache" code that's generated
 * by the build.
 */
/* eslint-disable no-restricted-globals */

import {FROM_DB_HEADER, FROM_SERVICE_WORKER_HEADER} from '../constants';
import store from '../data/db';
import {stringToReference, chapterIndex} from '../data/model';
import transform from '../data/transform';

const isPassageLookup = (url: URL): boolean => {
  if (process.env.NODE_ENV !== 'development' &&
      url.host === 'cors-anywhere.herokuapp.com')
    url = new URL(url.pathname.substring(1));

  return /^\/v3\/passage\/html/.test(url.pathname) ||
         /^\/v2\/rest\/passageQuery/.test(url.pathname);
}

const fromDb = (url: URL): Promise<string> => {
  const passageString = url.searchParams.has('q')?
    url.searchParams.get('q') : url.searchParams.get('passage');
  return store().get(chapterIndex(stringToReference(passageString)));
}

const toDb = (url: URL, text: string) => {
  const passage = url.searchParams.has('q')?
    url.searchParams.get('q') : url.searchParams.get('passage');
  const reference = stringToReference(passage);
  const index = chapterIndex(reference);

  if (Number.isNaN(index))
    return;

  if (process.env.NODE_ENV === 'development')
    console.log(`storing ${url.toString()} (${passage})
                 with reference ${JSON.stringify(reference)}
                 as ${index}`);

  store().set(index, text);
};

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (isPassageLookup(url))
    event.respondWith(fromDb(url)
      .then(text => new Response(text, {
        status: 200,
        headers: {[FROM_DB_HEADER]: true, [FROM_SERVICE_WORKER_HEADER]: true},
      }))
      .catch(error =>
        fetch(event.request)
          .then(response => response.text())
          .then(transform)
          .then(text => {
            toDb(new URL(event.request.url), text)
            return new Response(text, {
              status: 200,
              headers: {[FROM_SERVICE_WORKER_HEADER]: true},
            });
          })));
});
