import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { themable } from "../../hooks/theme";
import { ElectionNews } from "../../types/Election";
import { Button } from "../Button/Button";
import { ElectionNewsCard } from "../ElectionNewsCard/ElectionNewsCard";
import { Lightbox } from "../Lightbox/Lightbox";
import cssClasses from "./ElectionNewsSection.module.scss";

type Props = {
  feed: ElectionNews[];
  maxShownItems?: number;
  renderCardFooterLeft?: (news: ElectionNews, index: number) => ReactNode;
  renderCardFooterRight?: (news: ElectionNews, index: number) => ReactNode;
};

export const ElectionNewsSection = themable<Props>(
  "ElectionNewsSection",
  cssClasses,
)(({ classes, feed, maxShownItems = 5, renderCardFooterLeft, renderCardFooterRight }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const shownFeed = useMemo(() => (expanded ? feed : feed.slice(0, maxShownItems)), [feed, expanded, maxShownItems]);
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
          {shownFeed.map((news, index) => (
            <ElectionNewsCard
              key={news.id}
              news={news}
              onImageClick={onImageClick}
              footerLeft={renderCardFooterLeft && renderCardFooterLeft(news, index)}
              footerRight={renderCardFooterRight && renderCardFooterRight(news, index)}
            />
          ))}
        </div>
      </div>
      {!expanded && feed.length > maxShownItems && <Button onClick={onExpandClick}>Arată mai multe știri</Button>}
      {lightboxImage && <Lightbox src={lightboxImage} onRequestClose={onLightboxClose} />}
    </div>
  );
});
