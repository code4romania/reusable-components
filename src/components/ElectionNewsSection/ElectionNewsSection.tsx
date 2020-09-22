import React, { useCallback, useMemo, useState } from "react";
import { themable } from "../../hooks/theme";
import { ElectionNews } from "../../types/Election";
import { Button } from "../Button/Button";
import { ElectionNewsCard } from "../ElectionNewsCard/ElectionNewsCard";
import { Lightbox } from "../Lightbox/Lightbox";
import cssClasses from "./ElectionNewsSection.module.scss";

type Props = {
  feed: ElectionNews[];
};

export const ElectionNewsSection = themable<Props>(
  "ElectionNewsSection",
  cssClasses,
)(({ classes, feed }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const shownFeed = useMemo(() => (expanded ? feed : feed.slice(0, 5)), [feed, expanded]);
  const onExpandClick = useCallback(() => {
    setExpanded(true);
  }, []);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const onLightboxClose = useCallback(() => {
    setLightboxImage(null);
  }, []);

  const onImageClick = useCallback((src) => {
    setLightboxImage(src);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.feedContainer}>
        <div className={classes.feed}>
          {shownFeed.map((news) => (
            <ElectionNewsCard key={news.id} news={news} onImageClick={onImageClick} />
          ))}
        </div>
      </div>
      {!expanded && <Button onClick={onExpandClick}>Arată mai multe știri</Button>}
      {lightboxImage && <Lightbox src={lightboxImage} onRequestClose={onLightboxClose} />}
    </div>
  );
});
