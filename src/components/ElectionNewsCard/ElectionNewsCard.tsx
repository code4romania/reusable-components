import React, { ComponentProps, useCallback } from "react";
import { ClassNames, themable } from "../../hooks/theme";
import { ElectionNews } from "../../types/Election";
import { format, parseISO } from "date-fns";
import { DivBody, DivLabel, Heading3, makeTypographyComponent } from "../Typography/Typography";
import cssClasses from "./ElectionNewsCard.module.scss";
import SVGCode4Romania from "../../assets/code4romania.svg";
import LinkCircle from "../../assets/link-circle.svg";

type Props = {
  news: ElectionNews;
  onImageClick?: (src: string) => unknown;
};

const Heading3Link = makeTypographyComponent<ComponentProps<"a">>("a", "h3");

const Avatar = ({ classes, image, name }: { classes: ClassNames; image?: string | null; name: string }) => {
  if (image) {
    return <img className={classes.avatar} src={image} />;
  }
  return (
    <div className={classes.avatar}>
      <div className={classes.initials}>{name.substring(0, 1).toUpperCase()}</div>
    </div>
  );
};

function nodeScriptReplace(node: Node) {
  if (((node as unknown) as Element).tagName === "SCRIPT") {
    node.parentNode?.replaceChild(nodeScriptClone(node as HTMLScriptElement), node);
  } else {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      nodeScriptReplace(children[i]);
    }
  }

  return node;
}

function nodeScriptClone(node: HTMLScriptElement) {
  const script = document.createElement("script");
  script.text = node.innerHTML;

  const attrs = node.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    script.setAttribute(attrs[i].name, attr.value);
  }
  return script;
}

export const ElectionNewsCard = themable<Props>(
  "ElectionNewsCard",
  cssClasses,
)(({ classes, news, onImageClick }) => {
  const date = parseISO(news.timestamp);

  const embedRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      el.innerHTML = news.embed || "";
      nodeScriptReplace(el); // Script tags added with innerHTML are not executed by default
    },
    [news.embed],
  );

  return (
    <div className={classes.root}>
      <div className={classes.timestampColumn}>
        <DivBody className={classes.date}>{format(date, "dd MMM")}</DivBody>
        <DivBody className={classes.year}>{format(date, "yyyy")}</DivBody>
        <DivLabel className={classes.time}>{format(date, "HH:mm")}</DivLabel>
      </div>
      <div className={classes.container}>
        {news.author && (
          <div className={classes.author}>
            <Avatar image={news.author.avatar} name={news.author.name} classes={classes} />
            <DivBody className={classes.authorName}>{news.author.name}</DivBody>
          </div>
        )}
        <div className={classes.content}>
          {news.title && !news.link && <Heading3 className={classes.title}>{news.title}</Heading3>}
          {news.title && news.link && (
            <Heading3Link className={classes.title} href={news.link} target="_blank" rel="noopener noreferrer">
              {news.title}
            </Heading3Link>
          )}
          {news.body && <DivBody className={classes.body}>{news.body}</DivBody>}
          {news.pictures && news.pictures?.length > 0 && (
            <div className={classes.pictures}>
              {news.pictures.map((picture, index) => {
                const pic = typeof picture === "string" ? { thumbnail: picture, image: picture } : picture;
                if (!pic) return null;
                const src = pic.thumbnail || pic.image;
                if (!src) return null;
                const fullSrc = pic.image || pic.thumbnail || "";
                return (
                  <img
                    key={index}
                    className={classes.picture}
                    style={{ cursor: onImageClick ? "pointer" : undefined }}
                    src={src}
                    onClick={() => {
                      if (onImageClick) onImageClick(fullSrc);
                    }}
                  />
                );
              })}
            </div>
          )}
          {news.embed && <div className={classes.embed} ref={embedRef} />}
        </div>
        <div className={classes.footer}>
          {news.link && (
            <a className={classes.footerLink} href={news.link} target="_blank" rel="noopener noreferrer">
              <LinkCircle className={classes.footerLinkIcon} />
            </a>
          )}
          <div className={classes.separator} />
          <a href="https://code4.ro" target="_blank" rel="noopener noreferrer">
            <SVGCode4Romania className={classes.logo} />
          </a>
        </div>
      </div>
    </div>
  );
});
