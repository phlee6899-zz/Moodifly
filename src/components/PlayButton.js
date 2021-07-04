export function PlayButton({ onButtonClick }) {
  return (
    <svg
      className="playButton"
      viewBox="0 0 60 60"
      width="50"
      height="50"
      // fill="blue"
      onClick={onButtonClick}
    >
      <polygon points="0,0 50,30 0,60" />
    </svg>
  );
}

export function PauseButton({ onButtonClick }) {
  return (
    <svg
      className="pauseButton"
      viewBox="0 0 60 60"
      width="50"
      height="50"
      onClick={onButtonClick}
    >
      <polygon points="0,0 15,0 15,60 0,60" />
      <polygon points="25,0 40,0 40,60 25,60" />
    </svg>
  );
}
