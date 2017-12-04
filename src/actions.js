// @flow

import type {Reference, Translation} from './data/model';

export type SetChapterText = {|
  +type: 'set-chapter-text',
  +translation: Translation,
  +reference: Reference,
  +text: string,
|};

export const setChapterText = (
        translation: Translation,
        reference: Reference,
        text: string,
      ): SetChapterText =>
    ({type: 'set-chapter-text', translation, reference, text});

export type AddRecent = {|
  +type: 'add-recent',
  +reference: Reference,
|};

export const addRecent = (reference: Reference): AddRecent =>
  ({type: 'add-recent', reference});

export type SetRecents = {|
  +type: 'set-recents',
  +recents: Array<Reference>,
|};

export const setRecents = (recents: Array<Reference>): SetRecents =>
  ({type: 'set-recents', recents});

export type Preferences = {|
  +enableFocusMode: boolean,
  +enableNightMode: boolean,
  +hasConfirmedFocusMode: boolean,
  +translation: Translation,
|};

export type SettablePreferences = {
  +enableFocusMode?: boolean,
  +enableNightMode?: boolean,
  +hasConfirmedFocusMode?: boolean,
  +translation?: Translation,
};

export type EnableFocusMode = {|
  +type: 'enable-focus-mode',
  +enabled: boolean,
|};

export const enableFocusMode = (enabled: boolean): EnableFocusMode =>
  ({type: 'enable-focus-mode', enabled});

export type EnableNightMode = {|
  +type: 'enable-night-mode',
  +enabled: boolean,
|};

export const enableNightMode = (enabled: boolean): EnableNightMode =>
  ({type: 'enable-night-mode', enabled});

export type SetPreferences = {|
  +type: 'set-preferences',
  +preferences: SettablePreferences,
|};

export const setPreferences = (preferences: SettablePreferences):
    SetPreferences =>
  ({type: 'set-preferences', preferences});

export type AddToast = {|
  +type: 'add-toast',
  +text: string,
|};

export const addToast = (text: string): AddToast => ({type: 'add-toast', text});

export type ConfirmFocusMode = {|+type: 'confirm-focus-mode'|};

export const confirmFocusMode = (): ConfirmFocusMode =>
  ({type: 'confirm-focus-mode'});

export type SetDownload = {|
  +type: 'set-download',
  +translation: Translation,
  +download: Set<Reference> | null,
|};

export const setDownload = (
    translation: Translation,
    download: Set<Reference> | null): SetDownload =>
  ({type: 'set-download', translation, download})

export type Action =
    SetChapterText
  | AddRecent
  | SetRecents
  | EnableFocusMode
  | EnableNightMode
  | SetPreferences
  | AddToast
  | ConfirmFocusMode
  | SetDownload;
