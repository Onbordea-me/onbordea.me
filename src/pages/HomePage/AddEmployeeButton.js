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

const defaultProps = {
  label: 'Add New Employee',
};

const Button = (props) => {
  return (
    <button style={styles.Button}>
      {props.label ?? defaultProps.label}
    </button>
  );
};

export default AddEmployeeButton;
