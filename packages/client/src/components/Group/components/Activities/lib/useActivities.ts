import { useCallback, useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useGroup from '../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../lib/hooks/useUpdateGroup';
import { groupIdState, pinnedStreamIdState } from '../../../lib/GroupState';

export enum ActivityId {
  SharedIframe = 'SharedIframe',
  Twitch = 'Twitch',
  Dominion = 'Dominion',
  Excalidraw = 'Excalidraw',
}

export const activeActivityIdsState = atom<ActivityId[]>({
  key: 'Activities__activeActivityIdsState',
  default: [],
});

const useSyncActivities = (groupId: string) => {
  const [activeActivityIds, setActiveActivityIds] = useRecoilState(
    activeActivityIdsState,
  );

  const [pinnedStreamId, setPinnedStreamId] = useRecoilState(
    pinnedStreamIdState,
  );

  const group = useGroup(groupId);

  useEffect(() => {
    if (group.data?.activityIds) {
      if (
        JSON.stringify(activeActivityIds) !==
        JSON.stringify(group.data?.activityIds)
      ) {
        const ids = group.data?.activityIds;

        if (
          Object.keys(ActivityId).includes(pinnedStreamId || '') &&
          !ids.length
        ) {
          setPinnedStreamId(null);
        }

        if (ids.length === 1) {
          setPinnedStreamId(ids[0]);
        }

        setActiveActivityIds(group.data?.activityIds);
      }
    }
  }, [
    activeActivityIds,
    group.data,
    pinnedStreamId,
    setActiveActivityIds,
    setPinnedStreamId,
  ]);
};

export default function useActivities() {
  const groupId = useRecoilValue(groupIdState);
  const [activeActivityIds, setActiveActivityIds] = useRecoilState(
    activeActivityIdsState,
  );

  const updateGroup = useUpdateGroup();

  const toggleActivity = useCallback(
    (activityId: ActivityId) => () => {
      const doesActivityExist = activeActivityIds.includes(activityId);

      let newIds = [];

      if (doesActivityExist) {
        newIds = activeActivityIds.filter(id => id !== activityId);
      } else {
        newIds = [...activeActivityIds, activityId];
      }

      setActiveActivityIds(newIds);
      updateGroup({
        groupId,
        activityIds: newIds,
      });
    },
    [activeActivityIds, groupId, setActiveActivityIds, updateGroup],
  );

  useSyncActivities(groupId);

  return { toggleActivity, activeActivityIds };
}
