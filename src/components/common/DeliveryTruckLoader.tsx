/*
From Uiverse.io by yeisonordonez - https://uiverse.io/yeisonordonez/short-owl-85
MIT License, Copyright (c) yeisonordonez (Yeison Ordoñez)
*/

import React from 'react';
import './DeliveryTruckLoader.css';

interface DeliveryTruckLoaderProps {
  scale?: number;
  className?: string;
  caption?: string;
}

export const DeliveryTruckLoader: React.FC<DeliveryTruckLoaderProps> = ({
  scale = 0.75,
  className = '',
  caption,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div
        className="dtk-outer-stage"
        style={{
          width: `${400 * scale}px`,
          height: `${240 * scale}px`,
        }}
      >
        <div
          className="dtk-scale-wrapper"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="dtk-container">
            <div className="dtk-car">
              <div className="dtk-window" />
              <div className="dtk-cargo-details" />
              <div className="dtk-door" />
              <div className="dtk-lights" />
            </div>
            <div className="dtk-wheels dtk-wheels1" />
            <div className="dtk-wheels dtk-wheels2" />
            <div className="dtk-street" />
            <div className="dtk-post" />
          </div>
        </div>
      </div>
      {caption && (
        <span className="font-mono text-[10px] text-stone-500 uppercase tracking-wider mt-1 text-center">
          {caption}
        </span>
      )}
    </div>
  );
};

export default DeliveryTruckLoader;
