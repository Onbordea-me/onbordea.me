import React from 'react';

const styles = {
  Card: {
    top: '200px',
    left: '274px',
    width: '1142px',
    height: '260px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  },
};

const MainCard = (props) => (
  <div style={styles.Card}>
    {props.children}
  </div>
);

export default MainCard;
