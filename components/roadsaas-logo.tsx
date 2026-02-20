export function RoadSaasLogo({
  className,
  size = "default",
}: {
  className?: string
  size?: "small" | "default" | "large"
}) {
  const dimensions = {
    small: { width: 120, height: 24 },
    default: { width: 150, height: 30 },
    large: { width: 200, height: 40 },
  }

  const { width, height } = dimensions[size]

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="RoadSaaS logo"
    >
      <text
        x="0"
        y="45"
        fontFamily="var(--font-space-grotesk), Space Grotesk, sans-serif"
        fontWeight="700"
        fontSize="48"
        fill="var(--color-off-white)"
        letterSpacing="-2"
      >
        Road
        <tspan fill="var(--color-safety-orange)">SaaS</tspan>
        <tspan fill="var(--color-safety-orange)">.</tspan>
      </text>
      <rect x="2" y="55" width="230" height="4" fill="var(--color-concrete)" rx="2" />
      <rect x="115" y="55" width="40" height="4" fill="var(--color-safety-orange)" rx="2" />
    </svg>
  )
}
