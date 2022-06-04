type ReactionRoleMap = {
  reaction_id: string;
  role_ids: string[];
};

type Config = {
  message_channel_id: string;
  message_id: string;
  reaction_role_maps: ReactionRoleMap[];
};
