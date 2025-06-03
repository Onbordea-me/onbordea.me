import React from 'react';

const styles = {
  Input: {
    top: '17px',
    left: '1081px',
    width: '168px',
    height: '30px',
    padding: '0px 8px',
    border: '1px solid #8d8d8d',
    boxSizing: 'border-box',
    backgroundColor: '#f4f4f4',
    color: '#94a3b8',
    fontSize: '14px',
    fontFamily: 'IBM Plex Sans',
    lineHeight: '30px',
    outline: 'none',
  },
};

const InputField = ({ text = 'Search employees, equipment...' }) => (
  <input style={styles.Input} placeholder={text} />
);

export default InputField;
