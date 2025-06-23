"use client";
import { useState, useRef, useEffect } from "react";
import { transform } from "framer-motion";
import { device, icon } from "./settings";

export function useIconTransform({
  x,
  y,
  scale,
  planeX,
  planeY,
  xOffset,
  yOffset,
}) {
  const xScale = useRef(1);
  const yScale = useRef(1);
  const scaleRange = [0, 1, 1, 0];

  // Transform x and scale based on planeX
  useEffect(() => {
    // const xRange = createScreenRange("width");
    const xRange = [
      -60,
      80,
      window.innerWidth - (icon.size + icon.margin) / 2 - 80,
      window.innerWidth - (icon.size + icon.margin) / 2 + 60,
    ];
    const mapScreenToXOffset = transform(xRange, [50, 0, 0, -50]);
    const mapScreenXToScale = transform(xRange, scaleRange);

    const transformx = (v) => {
      const screenOffset = v + xOffset + 20;
      xScale.current = mapScreenXToScale(screenOffset);
      const newScale = Math.min(xScale.current, yScale.current);
      scale.set(newScale);
      x.set(mapScreenToXOffset(screenOffset));
    };

    // Subscribe to changes
    const unsubscribe = planeX.on("change", transformx);
    return () => unsubscribe();
  }, [planeX, scale, x, xOffset, scaleRange]);

  // Transform y and scale based on planeY
  useEffect(() => {
    const yRange = [
      -60,
      80,
      window.innerHeight - (icon.size + icon.margin) / 2 - 80,
      window.innerHeight - (icon.size + icon.margin) / 2 + 60,
    ];
    const mapScreenToYOffset = transform(yRange, [50, 0, 0, -50]);
    const mapScreenYToScale = transform(yRange, scaleRange);

    const transformy = (v) => {
      const screenOffset = v + yOffset + 20;
      yScale.current = mapScreenYToScale(screenOffset);
      const newScale = Math.min(xScale.current, yScale.current);
      scale.set(newScale);
      y.set(mapScreenToYOffset(screenOffset));
    };

    // Subscribe to changes
    const unsubscribe = planeY.on("change", transformy);
    return () => unsubscribe();
  }, [planeY, scale, y, yOffset, scaleRange]);
}

// As the draggable plane moves around we want to map each icon's position
// on the screen to new x/y positions and scale. As they get smaller we move them
// back into the screen slightly until they disappear.
// This function basically generates an inputRange for the `transform` function
// that's maps from when an icon is 60px outside an edge of the screen to
// when it's 80px inside the screen.
// const createScreenRange = (axis) => [
//   -60,
//   80,
//   device[axis] - (icon.size + icon.margin) / 2 - 80,
//   device[axis] - (icon.size + icon.margin) / 2 + 60,
// ];
// Try changing these values to see how scrolling affects the scale and position of the icons
// const scaleRange = [0, 1, 1, 0];
// // const xRange = createScreenRange("width");
// const xRange = [
//   -60,
//   80,
//   window.innerWidth - (icon.size + icon.margin) / 2 - 80,
//   window.innerWidth - (icon.size + icon.margin) / 2 + 60,
// ];
// const yRange = [
//   -60,
//   80,
//   window.innerHeight - (icon.size + icon.margin) / 2 - 80,
//   window.innerHeight - (icon.size + icon.margin) / 2 + 60,
// ];
// const mapScreenToXOffset = transform(xRange, [50, 0, 0, -50]);
// const mapScreenToYOffset = transform(yRange, [50, 0, 0, -50]);
// const mapScreenXToScale = transform(xRange, scaleRange);
// const mapScreenYToScale = transform(yRange, scaleRange);
