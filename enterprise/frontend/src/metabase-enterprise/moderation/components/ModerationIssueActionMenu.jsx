import React from "react";
import PropTypes from "prop-types";

import EntityMenu from "metabase/components/EntityMenu";
import { MODERATION_TEXT } from "metabase-enterprise/moderation/constants";
import { getModerationActionsList } from "metabase-enterprise/moderation";

function ModerationIssueActionMenu({ className, onAction }) {
  const moderationActionsList = getModerationActionsList();

  return (
    <EntityMenu
      triggerChildren={MODERATION_TEXT.moderator.action}
      triggerProps={{
        iconRight: "chevrondown",
        round: true,
        className: "text-brand border-brand",
      }}
      className={className}
      items={moderationActionsList.map(({ type, icon, color }) => {
        return {
          icon,
          iconSize: 18,
          className: `text-${color}`,
          action: () => onAction(type),
          title: MODERATION_TEXT.moderator[type].action,
        };
      })}
    />
  );
}

ModerationIssueActionMenu.propTypes = {
  className: PropTypes.string,
  onAction: PropTypes.func,
};

export default ModerationIssueActionMenu;
