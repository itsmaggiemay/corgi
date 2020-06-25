import Box from '@material-ui/core/Box';
import React, { useEffect, useRef, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useGroup from '../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../lib/hooks/useUpdateGroup';
import { groupIdState } from '../../../lib/GroupState';
import { SourceSelect } from './components/SourceSelect/SourceSelect';

function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export const sharedIframeUrlState = atom<string>({
  key: 'Activities__sharedIframeUrl',
  default: 'https://',
});

export default function SharedIframe() {
  const [sharedIframeUrl, setSharedIframeUrl] = useRecoilState(
    sharedIframeUrlState,
  );
  const groupId = useRecoilValue(groupIdState);
  const group = useGroup(groupId);
  const updateGroup = useUpdateGroup();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sharedIframeUrlInput, setSharedIframeUrlInput] = useState(
    addProtocol(group.data?.activityUrl || 'https://'),
  );

  useEffect(() => {
    if (
      group.data?.activityUrl &&
      group.data?.activityUrl !== sharedIframeUrl
    ) {
      setSharedIframeUrl(addProtocol(group.data?.activityUrl));
      setSharedIframeUrlInput(addProtocol(group.data?.activityUrl));
    }
  }, [group, setSharedIframeUrl, sharedIframeUrl]);

  const updateActivityUrl = (value: string) => {
    updateGroup({ groupId, activityUrl: value });
  };

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivityUrl(addProtocol(sharedIframeUrlInput));
    setSharedIframeUrl(sharedIframeUrlInput);
  };

  const onClickRefresh = () => {
    const src = iframeRef.current?.src;
    if (iframeRef.current?.src) {
      iframeRef.current.src = src || '';
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" bgcolor="black">
      <SourceSelect
        activityUrl={sharedIframeUrlInput}
        onSubmit={onSubmitSource}
        setActivityUrl={setSharedIframeUrlInput}
        updateActivityUrl={updateActivityUrl}
        onClickRefresh={onClickRefresh}
      />
      <iframe
        title="shared-browser"
        ref={iframeRef}
        style={{
          border: 0,
          outline: 'none',
          maxHeight: '100%',
        }}
        width="100%"
        height="100%"
        src={sharedIframeUrl}
      />
    </Box>
  );
}