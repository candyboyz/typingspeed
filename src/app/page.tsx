"use client";
import { useCallback, useRef, useState } from "react";

import dynamic from "next/dynamic";

const TestText = dynamic(() => import("@/components/test-text"), {
  ssr: false,
});

const HomePage = () => {
  const [isFocusedMode, setIsFocusedMode] = useState(true);

  const textInputRef = useRef<HTMLInputElement>(null);
  const focusTextInput = useCallback(
    () => textInputRef.current && textInputRef.current.focus(),
    [textInputRef],
  );

  return (
    <>
      <main className="w-full h-[calc(100vh-80px)] max-w-[1440px] mx-auto px-4 flex flex-col">
        <TestText
          textInputRef={textInputRef}
          isFocusedMode={isFocusedMode}
          handleInputFocus={focusTextInput}
        />
      </main>
    </>
  );
};

export default HomePage;
