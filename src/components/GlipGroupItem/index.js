import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import isPicture from '../../lib/isPicture';

import styles from './styles.scss';

import GlipGroupAvatar from '../GlipGroupAvatar';
import GlipGroupName from '../GlipGroupName';

function simpleFormatPostText(text, atRender) {
  if (text === undefined || text === null) {
    return null;
  }
  let firstLine = text.split('\n')[0];
  const matchedAtString = firstLine.match(/!\[:(Person|Team)\]\(\d+\)/);
  if (matchedAtString) {
    const atString = matchedAtString[0];
    const id = atString.match(/\d+/)[0];
    const type = atString.match(/!\[:\w+/)[0].replace('![:');
    let atText;
    if (typeof atRender === 'function') {
      atText = atRender({ id, type });
    } else {
      atText = `@${id}`;
    }
    firstLine = firstLine.replace(/!\[:(Person|Team)\]\(\d+\)/, atText);
    firstLine = simpleFormatPostText(firstLine, atRender);
  }
  return firstLine;
}

function LatestPost({ isGroup, latestPost, atRender }) {
  if (!latestPost) {
    return null;
  }
  let formatedText;
  if (latestPost.attachments && latestPost.attachments.length > 0) {
    const attachment = latestPost.attachments[0];
    if (isPicture(attachment.contentUri)) {
      formatedText = 'shared a picture';
    } else {
      formatedText = 'shared a file';
    }
  }

  if (latestPost.type === 'PersonJoined') {
    formatedText = 'joined the team';
  }

  if (latestPost.type === 'PersonsAdded') {
    const addedPersons = latestPost.addedPersonIds.map(id =>
      atRender({ id, type: 'Person' })
    );
    formatedText = `added ${addedPersons.join(' ')} to the team`;
  }

  if (!formatedText) {
    formatedText = simpleFormatPostText(latestPost.text, atRender);
  }

  if (!isGroup || !latestPost.creator) {
    return (
      <div className={styles.latestPost}>
        {formatedText || 'Unsupported message'}
      </div>
    );
  }
  return (
    <div className={styles.latestPost}>
      {latestPost.creator.firstName}: {formatedText || 'Unsupported message'}
    </div>
  );
}

LatestPost.propTypes = {
  isGroup: PropTypes.bool.isRequired,
  latestPost: PropTypes.object,
  atRender: PropTypes.func,
};

LatestPost.defaultProps = {
  latestPost: null,
  atRender: undefined,
};

export default function GlipGroup({
  group,
  className,
  goToGroup,
  active,
  atRender,
}) {
  return (
    <div
      className={classnames(
        styles.root,
        (active ? styles.active : null),
        className,
      )}
      onClick={goToGroup}
    >
      <GlipGroupAvatar
        persons={group.detailMembers}
        alt={group.id}
        className={styles.avatar}
        unread={group.unread}
      />
      <div className={styles.content}>
        <div className={styles.name} title={name}>
          <GlipGroupName group={group} />
        </div>
        <LatestPost
          isGroup={group.members.length > 2}
          latestPost={group.latestPost}
          atRender={atRender}
        />
      </div>
    </div>
  );
}

GlipGroup.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object,
  goToGroup: PropTypes.func.isRequired,
  active: PropTypes.bool,
  atRender: PropTypes.func,
};

GlipGroup.defaultProps = {
  className: undefined,
  group: {},
  active: false,
  atRender: undefined,

};
