import React from 'react';

const styles = {
  Card: {
    top: '64px',
    left: '0px',
    width: '250px',
    height: '836px',
    backgroundColor: '#f4f4f4',
  },
};

const SidebarCard = (props) => (
  <div style={styles.Card}>
    {props.children}
  </div>
);

export default SidebarCard;
