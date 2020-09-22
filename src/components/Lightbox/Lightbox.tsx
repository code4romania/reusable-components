import React from "react";
import { themable } from "../../hooks/theme";
import cssClasses from "./Lightbox.module.scss";

type Props = {
  src: string;
  onRequestClose?: () => unknown;
};

const stopPropagation = (evt: { stopPropagation: () => void }) => {
  evt.stopPropagation();
};

export const Lightbox = themable<Props>(
  "Lightbox",
  cssClasses,
)(({ classes, src, onRequestClose }) => {
  return (
    <div className={classes.root}>
      <div className={classes.veil} onClick={onRequestClose} />
      <img className={classes.image} src={src} onClick={stopPropagation} />
      <div className={classes.closeButton} onClick={onRequestClose}>
        &times;
      </div>
    </div>
  );
});
