import React, {Component} from 'react';

import './chapters.css';
import copyToClipboard from './copy-to-clipboard';
import {
  chapterIndex,
  reference as referenceFromIndex,
  referenceToLocation,
  verseNumIdToReference
} from '../data/model';
import {NAV_HEIGHT} from './nav';
import PagerView from './pagerview';

const handleFootnoteClicks = event => {
  const href = event.target.href;

  if (!href)
    return;

  const el = event.currentTarget.querySelector(new URL(href).hash);

  if (el) {
    el.scrollIntoView();
    event.preventDefault();
  }
};

const isToTheRightOf = (event, el) => {
  const rect = el.getBoundingClientRect();

  return event.clientY >= rect.top && event.clientY <= rect.bottom &&
    event.clientX >= rect.left;
};

const isAheadOf = (event, el) => {
  const rect = el.getBoundingClientRect();

  return (event.clientY >= rect.top && event.clientX >= rect.left) ||
    event.clientY > rect.bottom;
}

const getClickedReference = event => {
  if (event.target.classList.contains('verse-num'))
    return verseNumIdToReference(event.target.id);

  const verseNums = event.target.querySelectorAll('.verse-num');

  if (verseNums.length === 0)
    return null;

  for (let i = 0; i < verseNums.length; i++) {
    const verseNum = verseNums[i];
    if (isToTheRightOf(event, verseNum))
      return verseNumIdToReference(verseNum.id);
    if (!isAheadOf(event, verseNum))
      if (i > 0)
        return verseNumIdToReference(verseNums[i - 1].id);
      else
        return {
          ...verseNumIdToReference(verseNum.id),
          verse: 1,
        };
  }

  return verseNumIdToReference(verseNums[verseNums.length - 1].id);
}

class Chapter extends Component {
  lastClick = null;

  onClick = event => {
    handleFootnoteClicks(event);

    if (!event.defaultPrevented && this.props.onClick)
      this.props.onClick(event);

    if (event.defaultPrevented)
      return;

    if (this.lastClick != null && Date.now() - this.lastClick < 200) {
      const reference = getClickedReference(event);

      if (reference != null)
        copyToClipboard(
            new URL(
                referenceToLocation(reference),
                window.location)
              .toString());
    }

    this.lastClick = Date.now();
  }

  render() {
    return this.props.text == null?
      <div
          className="fit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
        <div>
          Loading {this.props.reference.book} {this.props.reference.chapter}
        </div>
      </div> :
      <div
        style={{
          marginBottom: NAV_HEIGHT,
          padding: '0 1rem 1rem 1rem',
          lineHeight: '1.4em',
        }}

        dangerouslySetInnerHTML={{__html: this.props.text}}

        onClick={this.onClick}/>;
  }
};

export default ({
      reference,
      chapterCache,
      onReferenceChange,
      onScroll,
      getInitialScroll,
      onClick
    }) =>
  <PagerView
    index={chapterIndex(reference)}
    onIndexChange={index => onReferenceChange(referenceFromIndex(index))}
    onScroll={onScroll || (() => null)}
    getInitialScroll={getInitialScroll || (() => null)}
    renderPage={index =>
      <Chapter
        reference={referenceFromIndex(index)}
        onClick={onClick}
        text={chapterCache[index]}/>}/>;

