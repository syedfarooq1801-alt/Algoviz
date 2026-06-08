import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #4f8ef7",
        }}
      >
        <span
          style={{
            color: "#4f8ef7",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          ∑
        </span>
      </div>
    ),
    { ...size }
  );
}
