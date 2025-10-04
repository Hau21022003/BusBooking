export type SeatVariant =
  | "default" // normal available seat
  | "selected" // user selected seat
  | "disabled" // unavailable seat
  | "front" // front seat
  | "middle" // middle seat
  | "back" // rear seat
  | "vip";

interface SeatIconProps {
  variant?: SeatVariant;
  size?: number;
}

export default function SeatIcon({
  variant = "default",
  size = 40,
}: SeatIconProps) {
  const colors: Record<SeatVariant, { stroke: string; fill: string }> = {
    default: { stroke: "#B8B8B8", fill: "#fff" },
    selected: { stroke: "#27ae60", fill: "#8be5b0" },
    // disabled: { stroke: "#F2F2F2", fill: "#E0E0E0" },
    disabled: { stroke: "#BDBDBD", fill: "#E0E0E0" },
    front: { stroke: "#ae70ff", fill: "#fff" }, // blue border
    middle: { stroke: "#fba442", fill: "#fff" }, // orange border
    back: { stroke: "#6bd600", fill: "#fff" }, // purple border
    vip: { stroke: "#ce2029", fill: "#fff" },
  };

  const { stroke, fill } = colors[variant];

  return (
    <svg
      width={size}
      height={(size * 32) / 40}
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8.75"
        y="2.75"
        width="22.5"
        height="26.5"
        rx="2.25"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="10.25"
        y="11.75"
        width="14.5"
        height="5.5"
        rx="2.25"
        transform="rotate(90 10.25 11.75)"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="35.25"
        y="11.75"
        width="14.5"
        height="5.5"
        rx="2.25"
        transform="rotate(90 35.25 11.75)"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="8.75"
        y="22.75"
        width="22.5"
        height="6.5"
        rx="2.25"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {variant === "selected" && (
        <path
          className="icon-selected"
          d="M20 6.333A6.67 6.67 0 0 0 13.334 13 6.67 6.67 0 0 0 20 19.667 6.67 6.67 0 0 0 26.667 13 6.669 6.669 0 0 0 20 6.333zm-1.333 10L15.333 13l.94-.94 2.394 2.387 5.06-5.06.94.946-6 6z"
          fill={stroke}
        />
      )}
      {variant === "disabled" && (
        <path
          className="icon-disabled"
          d="M24.96 9.46l-1.42-1.42L20 11.59l-3.54-3.55-1.42 1.42L18.59 13l-3.55 3.54 1.42 1.42L20 14.41l3.54 3.55 1.42-1.42L21.41 13l3.55-3.54z"
          fill={stroke}
        />
      )}
    </svg>
  );
}
