import React from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../features/auth';

// Get access to profile name or id from redux state
// display it in the profile component

function Profile() {
  // console.log('Profile');
  const { isAuthenticated, user } = useSelector(userSelector);

  return (
    <div>
      {isAuthenticated ? <div>Profile - {user.username}</div> : <div>Profile - not logged in</div>}
    </div>
  );
}

export default Profile;
  