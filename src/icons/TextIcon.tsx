function TextIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="icon"
      stroke="#000000"
    >
      <polyline points="44 8 44 16 52 16" />
      <polygon points="52 16 44 8 12 8 12 56 52 56 52 16" />
      <line x1={20} y1={20} x2={28} y2={20} />
      <line x1={20} y1={28} x2={44} y2={28} />
      <line x1={36} y1={36} x2={20} y2={36} />
      <line x1={20} y1={44} x2={44} y2={44} />
    </svg>
  );
}
export default TextIcon;
