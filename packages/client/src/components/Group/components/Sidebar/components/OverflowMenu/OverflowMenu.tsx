import { IconButton, Menu, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import SettingsIcon from '@material-ui/icons/Settings';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import { mediaSettingsModalIsOpenState } from '../../../MediaSettingsModal/MediaSettingsModal';
import * as S from './OverflowMenu.styles';

interface Props {
  toggleIsSharingScreen: () => void;
  isSharingScreen: boolean;
}

export default function OverflowMenu(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const setIsSettingsModalOpen = useSetRecoilState(
    mediaSettingsModalIsOpenState,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSettingsClick = () => {
    handleClose();
    setIsSettingsModalOpen(true);
  };

  const onScreenShareClick = () => {
    handleClose();
    props.toggleIsSharingScreen();
  };

  return (
    <div>
      <IconButton onClick={handleClick} aria-label="overflow-menu-button">
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="overflow-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <S.MenuItem onClick={onSettingsClick}>
          <S.ListItemIcon>
            <SettingsIcon fontSize="small" />
          </S.ListItemIcon>
          <Typography variant="inherit">Settings</Typography>
        </S.MenuItem>
        <S.MenuItem onClick={onScreenShareClick}>
          <S.ListItemIcon>
            {props.isSharingScreen ? (
              <StopScreenShareIcon fontSize="small" />
            ) : (
              <ScreenShareIcon fontSize="small" />
            )}
          </S.ListItemIcon>
          <Typography variant="inherit">
            {props.isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
          </Typography>
        </S.MenuItem>
      </Menu>
    </div>
  );
}
