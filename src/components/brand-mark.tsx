export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: "#367BEC" }}
    >
      <svg
        width={size * 0.47}
        height={size * 0.47}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M5 17V13M12 17V9M19 17V6" />
      </svg>
    </span>
  );
}
