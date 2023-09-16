import React, { useState } from "react";

export const useDomToggle = (active = false) => {
    const [isActive, setIsActive] = useState(active);
    console.log({active})
    return [isActive, setIsActive]
}
