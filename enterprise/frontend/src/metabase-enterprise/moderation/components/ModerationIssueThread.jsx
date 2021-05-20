import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { t } from "ttag";

import {
  getColor,
  getModerationStatusIcon,
} from "metabase-enterprise/moderation";
import { MODERATION_TEXT } from "metabase-enterprise/moderation/constants";
import Button from "metabase/components/Button";
import Icon from "metabase/components/Icon";
import Comment from "metabase/components/Comment";
import ModerationIssueActionMenu from "metabase-enterprise/moderation/components/ModerationIssueActionMenu";

ModerationIssueThread.propTypes = {
  className: PropTypes.string,
  request: PropTypes.object.isRequired,
  comments: PropTypes.array,
  onComment: PropTypes.func,
  onModerate: PropTypes.func,
};

const COMMMENT_VISIBLE_LINES = 3;

export function ModerationIssueThread({
  className,
  request,
  comments = [],
  onComment,
  onModerate,
}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const color = getColor(request.type);
  const icon = getModerationStatusIcon(request.type);
  const showButtonBar = !showCommentForm && !!(onComment || onModerate);

  const onSubmit = e => {
    e.preventDefault();
  };

  return (
    <div className={cx(className, "")}>
      <div className={`flex align-center text-${color} text-bold`}>
        <Icon name={icon} className="mr1" />
        {MODERATION_TEXT.user[request.type].action}
      </div>
      <Comment
        className="pt1"
        title={request.requesterDisplayName}
        text={request.text}
        timestamp={request.created_at}
        visibleLines={COMMMENT_VISIBLE_LINES}
      />
      {comments.map(comment => {
        return (
          <Comment
            className="pt2"
            key={comment.id}
            icon={comment.isModerator && "shield"}
            title={comment.title}
            text={comment.text}
            timestamp={comment.timestamp}
            visibleLines={COMMMENT_VISIBLE_LINES}
          />
        );
      })}
      {showCommentForm && (
        <CommentForm
          className="pt1"
          onSubmit={onSubmit}
          onCancel={() => setShowCommentForm(false)}
        />
      )}
      {showButtonBar && (
        <div className="flex justify-end column-gap-1 pt1">
          {onComment && (
            <Button
              className="py1"
              onClick={() => setShowCommentForm(true)}
            >{t`Comment`}</Button>
          )}
          {onModerate && (
            <ModerationIssueActionMenu
              triggerClassName="text-white text-white-hover bg-brand bg-brand-hover py1"
              onAction={actionType => onModerate(actionType, request)}
              request={request}
            />
          )}
        </div>
      )}
    </div>
  );
}

CommentForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
};

function CommentForm({ className, onSubmit, onCancel, isPending }) {
  const [value, setValue] = useState("");
  return (
    <form className={className} onSubmit={onSubmit}>
      <textarea
        className="input full max-w-full min-w-full"
        value={value}
        onChange={e => setValue(e.target.value)}
        name="comment"
      />
      <div className="pt1 flex column-gap-1 justify-end">
        <Button
          className="py1"
          disabled={isPending}
          type="button"
          onClick={onCancel}
        >
          {t`Cancel`}
        </Button>
        <Button className="py1" disabled={isPending} type="submit" primary>
          {t`Done`}
        </Button>
      </div>
    </form>
  );
}
