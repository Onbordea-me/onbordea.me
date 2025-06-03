import React from 'react';

const styles = {
  Header: {
    top: '0px',
    left: '0px',
    width: '1440px',
    height: '64px',
    backgroundColor: '#161616',
  },
};

const Header = (props) => (
  <div style={styles.Header}>
    {props.children}
  </div>
);

export default Header;
