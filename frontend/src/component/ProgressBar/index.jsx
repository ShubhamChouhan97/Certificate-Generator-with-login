const ProgressBar = ({ progress }) => {
  const barStyle = {
    height: '25px',
    width: '20%',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    marginTop: '10px',
    marginRight: '20px',
    overflow: 'hidden',
  };

  const fillerStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#4caf50',
    textAlign: 'right',
    transition: 'width 0.5s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
    fontWeight: 'bold',
    paddingRight: '10px',
  };

  return (
    <div style={barStyle}>
      <div style={fillerStyle}>{Math.floor(progress)}%</div>
    </div>
  );
};
export default ProgressBar;