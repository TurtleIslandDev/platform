import React, { useEffect, useState } from "react";
import InteractionGuide from "./../../components/IG/InteractionGuide";
import useWindowHeight from "../../features/hooks/useWindowHeight";

const InteractionGuidePage = () => {
  const height = useWindowHeight();
  return (
    <div style={{ height: `${height}px` }}>
      <InteractionGuide />
    </div>
  );
};

export default InteractionGuidePage;
