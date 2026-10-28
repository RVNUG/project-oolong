/** Decorative Roanoke-style ridge line for the homepage hero (vector, theme-aware). */
const HeroLandscape = () => (
  <svg
    className="hero-landscape preserve-color"
    viewBox="0 0 400 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      className="hero-landscape-fill"
      d="M0 95 L45 72 L95 88 L150 55 L210 78 L265 48 L320 70 L360 58 L400 75 L400 120 L0 120 Z"
    />
    <path
      className="hero-landscape-ridge"
      d="M0 95 L45 72 L95 88 L150 55 L210 78 L265 48 L320 70 L360 58 L400 75"
      fill="none"
      strokeWidth="2"
    />
  </svg>
);

export default HeroLandscape;
