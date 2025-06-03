import React from 'react';

const styles = {
  Card: {
    top: '88px',
    left: '1051px',
    width: '365px',
    height: '92px',
    backgroundColor: '#0f62fe',
    borderRadius: '2px',
  },
};

const Card = (props) => {
  return (
    <div style={styles.Card}>
      {props.children}
    </div>
  );
};

export default Card;
