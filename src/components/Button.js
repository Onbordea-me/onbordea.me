import React from 'react';

const styles = {
  Button: {
    cursor: 'pointer',
    top: '228px',
    left: '1237px',
    width: '155px',
    height: '36px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'IBM Plex Sans',
    lineHeight: '20px',
    outline: 'none',
  },
};

const Button = ({ label = 'Add New Employee' }) => (
  <button style={styles.Button}>
    {label}
  </button>
);

export default Button;
