import React, { useState } from "react";

type Props = {
  data: unknown;
  loading: boolean;
  error?: Error | null;
};

export const APIRequestPreview: React.FC<Props> = ({ data, loading, error }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error.toString()}</div>}
      {data && (
        <div
          style={{
            background: "#ccc",
            borderRadius: 4,
            padding: 8,
            fontFamily: "monospace",
          }}
        >
          <button
            onClick={() => {
              setVisible((x) => !x);
            }}
          >
            {visible ? "Hide" : "Show"} data as JSON
          </button>
          {visible && <pre style={{ marginTop: 8 }}>{JSON.stringify(data, null, 2)}</pre>}
        </div>
      )}
    </>
  );
};
