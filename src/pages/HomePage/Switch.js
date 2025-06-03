import React from 'react';

const styles = {
  Container: {
    cursor: 'pointer',
    display: 'block',
    position: 'relative',
    width: '48px',
    height: '24px',
    pointerEvents: 'auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(141, 141, 141, 1)',
    border: '0px solid rgba(229, 231, 235, 1)',
  },
  Toggle: {
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '3px',
    width: 'calc(50% - 6px)',
    height: 'calc(100% - 6px)',
    transform: 'translate(0%, -50%)',
    fontSize: '14px',
    transition: 'left 0.3s ease',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Input: {
    position: 'absolute',
    opacity: 0,
    visibility: 'hidden',
    width: '1px',
    height: '1px',
    pointerEvents: 'none',
  },
};

const Switch = () => {
  const [isToggled, setIsToggled] = React.useState(false);

  const onClick = () => setIsToggled(!isToggled);

  return (
    <div style={styles.Container} onClick={onClick}>
      <div style={{
        ...styles.Toggle,
        left: isToggled ? 'calc(50% + 3px)' : '3px',
      }} />
      <input type="checkbox" style={styles.Input} />
    </div>
  );
};

export default Switch;
