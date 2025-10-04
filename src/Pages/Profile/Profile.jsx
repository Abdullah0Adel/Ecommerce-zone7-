import React from 'react';
import styles from './Profile.module.css';
import Logout from '../Logout/Logout';

const Profile = () => {
    const getUserData = () => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }
    const user = getUserData();
    if (!user) {   
        window.location.href = '/login';
        return null;
    }

  return (
    <>
    <div className={` ${styles.container}`}>
      <div className={`mt-5 ${styles.profileCard}`}>
        
        <div className={styles.formContainer}>
          <h2>General Information</h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Name</label>
              <input 
                type="text" 
                id="lastName" 
                value={`${user.username}`} 
                readOnly 
                className={styles.formControl}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={`${user.email}`} 
              readOnly 
              className={styles.formControl}
            />
          </div>

          
          <div>
          <Logout/>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;